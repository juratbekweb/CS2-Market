import { auth } from "@/auth";
import { getWalletSnapshot } from "@/lib/store";
import { redirect } from "next/navigation";
import { WalletClient } from "./wallet-client";

export default async function WalletPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const data = await getWalletSnapshot(session.user);
  return <WalletClient data={data} />;
}
