/**
 * CS2 Steam Bot Service
 * 
 * Handles:
 * - Steam login with 2FA
 * - Sending trade offers (deposits & withdrawals)
 * - Accepting incoming trades
 * - Monitoring trade status
 * - Inventory management
 * 
 * Communicates with main app via internal REST API
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const BOT_PORT = Number(process.env.BOT_PORT) || 5001;
const BOT_API_KEY = process.env.BOT_API_KEY || "change-this";

// ─── Auth Middleware ───────────────────────────────────
function requireAuth(req, res, next) {
  const key = req.headers["x-bot-key"];
  if (key !== BOT_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ─── Bot State ────────────────────────────────────────
let botReady = false;
let botSteamId = null;
let client = null;
let community = null;
let manager = null;

// ─── Steam Bot Setup ──────────────────────────────────
async function initBot() {
  try {
    // Dynamic imports for ESM
    const SteamUser = (await import("steam-user")).default;
    const SteamCommunity = (await import("steamcommunity")).default;
    const TradeOfferManager = (await import("steam-tradeoffer-manager")).default;
    const SteamTotp = (await import("steam-totp")).default;

    client = new SteamUser();
    community = new SteamCommunity();
    manager = new TradeOfferManager({
      steam: client,
      community: community,
      language: "en",
      pollInterval: 10000,
    });

    const accountName = process.env.STEAM_ACCOUNT_NAME;
    const password = process.env.STEAM_PASSWORD;
    const sharedSecret = process.env.STEAM_SHARED_SECRET;

    if (!accountName || !password || !sharedSecret) {
      console.log("[BOT] Missing Steam credentials. Running in MOCK mode.");
      botReady = true;
      return;
    }

    const twoFactorCode = SteamTotp.generateAuthCode(sharedSecret);

    client.logOn({
      accountName,
      password,
      twoFactorCode,
    });

    client.on("loggedOn", () => {
      console.log(`[BOT] Logged in as ${client.steamID.getSteamID64()}`);
      botSteamId = client.steamID.getSteamID64();
      client.setPersona(1); // Online
      client.gamesPlayed([730]); // CS2
    });

    client.on("webSession", (sessionID, cookies) => {
      community.setCookies(cookies);
      manager.setCookies(cookies, (err) => {
        if (err) {
          console.error("[BOT] Failed to set cookies:", err);
          return;
        }
        botReady = true;
        console.log("[BOT] Trade manager ready!");
      });
    });

    client.on("error", (err) => {
      console.error("[BOT] Steam error:", err);
    });

    // Handle incoming trade offers
    manager.on("newOffer", (offer) => {
      console.log(`[BOT] New trade offer from ${offer.partner.getSteamID64()}`);
      // Auto-decline incoming offers (we only send outgoing)
      offer.decline((err) => {
        if (err) console.error("[BOT] Failed to decline offer:", err);
        else console.log(`[BOT] Declined offer ${offer.id}`);
      });
    });

    // Monitor sent offer state changes
    manager.on("sentOfferChanged", (offer, oldState) => {
      console.log(`[BOT] Offer ${offer.id} changed: ${oldState} -> ${offer.state}`);
      notifyMainApp(offer);
    });

  } catch (err) {
    console.error("[BOT] Failed to initialize:", err);
    console.log("[BOT] Running in MOCK mode.");
    botReady = true;
  }
}

// ─── Notify Main App ─────────────────────────────────
async function notifyMainApp(offer) {
  try {
    const mainUrl = process.env.MAIN_APP_URL || "http://localhost:3000";
    const secret = process.env.MAIN_APP_WEBHOOK_SECRET || "webhook-secret";

    const stateMap = {
      2: "PENDING",   // Active
      3: "ACCEPTED",  // Accepted
      5: "EXPIRED",   // Expired
      6: "CANCELLED", // Cancelled
      7: "DECLINED",  // Declined
    };

    await fetch(`${mainUrl}/api/trade/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": secret,
      },
      body: JSON.stringify({
        steamTradeId: offer.id,
        status: stateMap[offer.state] || "PENDING",
        items: offer.itemsToReceive?.map(i => ({
          assetId: i.assetid,
          name: i.name || i.market_hash_name,
          appId: i.appid,
        })) || [],
      }),
    });
  } catch (err) {
    console.error("[BOT] Failed to notify main app:", err);
  }
}

// ─── API Routes ───────────────────────────────────────

app.get("/health", (req, res) => {
  res.json({ ok: true, botReady, botSteamId, uptime: process.uptime() });
});

/**
 * POST /trade/deposit
 * Send a deposit trade offer (user → bot)
 * Body: { userSteamId, tradeUrl, assetIds }
 */
app.post("/trade/deposit", requireAuth, async (req, res) => {
  if (!botReady) return res.status(503).json({ error: "Bot not ready" });

  const { userSteamId, tradeUrl, assetIds } = req.body;
  if (!tradeUrl || !assetIds?.length) {
    return res.status(400).json({ error: "tradeUrl and assetIds required" });
  }

  if (!manager?.createOffer) {
    // Mock mode
    const mockTradeId = `mock-${Date.now()}`;
    return res.json({ tradeId: mockTradeId, status: "SENT" });
  }

  try {
    const offer = manager.createOffer(tradeUrl);
    const appId = Number(process.env.STEAM_APP_ID) || 730;
    const contextId = Number(process.env.STEAM_CONTEXT_ID) || 2;

    for (const assetId of assetIds) {
      offer.addTheirItem({ appid: appId, contextid: String(contextId), assetid: assetId });
    }

    offer.setMessage("NightMarket skin deposit");

    offer.send((err, status) => {
      if (err) {
        console.error("[BOT] Failed to send deposit offer:", err);
        return res.status(500).json({ error: "Failed to send trade offer" });
      }
      console.log(`[BOT] Deposit offer sent: ${offer.id} (${status})`);

      // Auto-confirm with mobile authenticator
      if (status === "pending") {
        community.acceptConfirmationForObject(
          process.env.STEAM_IDENTITY_SECRET,
          offer.id,
          (confErr) => {
            if (confErr) console.error("[BOT] Confirmation error:", confErr);
            else console.log(`[BOT] Confirmed offer ${offer.id}`);
          }
        );
      }

      res.json({ tradeId: String(offer.id), status: "SENT" });
    });
  } catch (err) {
    console.error("[BOT] Deposit error:", err);
    res.status(500).json({ error: "Internal bot error" });
  }
});

/**
 * POST /trade/withdraw
 * Send a withdrawal trade offer (bot → user)
 * Body: { tradeUrl, assetIds }
 */
app.post("/trade/withdraw", requireAuth, async (req, res) => {
  if (!botReady) return res.status(503).json({ error: "Bot not ready" });

  const { tradeUrl, assetIds } = req.body;
  if (!tradeUrl || !assetIds?.length) {
    return res.status(400).json({ error: "tradeUrl and assetIds required" });
  }

  if (!manager?.createOffer) {
    const mockTradeId = `mock-${Date.now()}`;
    return res.json({ tradeId: mockTradeId, status: "SENT" });
  }

  try {
    const offer = manager.createOffer(tradeUrl);
    const appId = Number(process.env.STEAM_APP_ID) || 730;
    const contextId = Number(process.env.STEAM_CONTEXT_ID) || 2;

    for (const assetId of assetIds) {
      offer.addMyItem({ appid: appId, contextid: String(contextId), assetid: assetId });
    }

    offer.setMessage("NightMarket skin withdrawal");

    offer.send((err, status) => {
      if (err) {
        console.error("[BOT] Failed to send withdraw offer:", err);
        return res.status(500).json({ error: "Failed to send trade offer" });
      }
      console.log(`[BOT] Withdraw offer sent: ${offer.id} (${status})`);

      if (status === "pending") {
        community.acceptConfirmationForObject(
          process.env.STEAM_IDENTITY_SECRET,
          offer.id,
          (confErr) => {
            if (confErr) console.error("[BOT] Confirmation error:", confErr);
            else console.log(`[BOT] Confirmed offer ${offer.id}`);
          }
        );
      }

      res.json({ tradeId: String(offer.id), status: "SENT" });
    });
  } catch (err) {
    console.error("[BOT] Withdraw error:", err);
    res.status(500).json({ error: "Internal bot error" });
  }
});

/**
 * GET /inventory
 * Get bot's CS2 inventory
 */
app.get("/inventory", requireAuth, async (req, res) => {
  if (!botReady) return res.status(503).json({ error: "Bot not ready" });

  if (!manager?.getInventoryContents) {
    return res.json({ items: [] });
  }

  const appId = Number(process.env.STEAM_APP_ID) || 730;
  const contextId = Number(process.env.STEAM_CONTEXT_ID) || 2;

  manager.getInventoryContents(appId, contextId, true, (err, inventory) => {
    if (err) {
      console.error("[BOT] Inventory error:", err);
      return res.status(500).json({ error: "Failed to load inventory" });
    }
    res.json({
      items: inventory.map((item) => ({
        assetId: item.assetid,
        name: item.market_hash_name || item.name,
        icon: item.getImageURL(),
        tradable: item.tradable,
      })),
    });
  });
});

/**
 * GET /trade/:id
 * Check trade offer status
 */
app.get("/trade/:id", requireAuth, (req, res) => {
  if (!manager?.getOffer) {
    return res.json({ tradeId: req.params.id, status: "MOCK", state: 3 });
  }

  manager.getOffer(req.params.id, (err, offer) => {
    if (err) return res.status(404).json({ error: "Trade not found" });
    res.json({
      tradeId: offer.id,
      state: offer.state,
      status: offer.state === 3 ? "ACCEPTED" : offer.state === 2 ? "PENDING" : "OTHER",
      itemsReceived: offer.itemsToReceive?.length || 0,
      itemsSent: offer.itemsToGive?.length || 0,
    });
  });
});

// ─── Start ────────────────────────────────────────────
initBot().then(() => {
  app.listen(BOT_PORT, () => {
    console.log(`[BOT] API server running on http://localhost:${BOT_PORT}`);
  });
});
