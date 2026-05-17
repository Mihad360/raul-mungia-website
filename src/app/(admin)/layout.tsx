import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bati_token")?.value;
  const role = cookieStore.get("bati_role")?.value;

  if (!token) redirect("/login");
  if (role !== "admin") redirect("/dashboard");

  return <>{children}</>;
}
