import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAdminSnapshot } from "@/lib/store";
import { AdminDashboardClient } from "./admin-client";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");
  
  const data = await getAdminSnapshot();
  return <AdminDashboardClient data={data} />;
}
