import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting Prisma setup test...");

  try {
    // 1. Verify connection
    await prisma.$connect();
    console.log("✅ Database connection successful.");

    // 2. Test Atomic User + Wallet creation
    const uniqueEmail = `test_${Date.now()}@example.com`;
    console.log(`Attempting to create user with email: ${uniqueEmail}`);

    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: uniqueEmail,
          name: "Test User",
          role: "USER",
        },
      });

      console.log(`User created with ID: ${user.id}`);

      // Create wallet linked to user
      const wallet = await tx.wallet.create({
        data: {
          userId: user.id,
          balance: 1000.00, // Initial balance
        },
      });

      console.log(`Wallet created with ID: ${wallet.id}`);

      return { user, wallet };
    });

    console.log("✅ Atomic transaction successful!");
    console.log("Created User:", result.user);
    console.log("Created Wallet:", result.wallet);

    // 3. Verify Decimal comparison
    const wallet = result.wallet;
    const amountToDeduct = 500.00;
    
    // Safer Decimal comparison using Prisma.Decimal methods
    // wallet.balance is a Decimal object
    if (wallet.balance.lessThan(amountToDeduct)) {
      console.log("❌ Decimal check failed: Balance is less than amount to deduct (unexpected).");
    } else {
      console.log("✅ Decimal check successful: Balance is sufficient.");
    }

  } catch (error) {
    console.error("❌ Test failed with error:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected.");
  }
}

main();
