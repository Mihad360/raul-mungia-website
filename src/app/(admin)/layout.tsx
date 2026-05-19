import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminNavbar from "@/components/admin/Navbar";
import AdminSidebar from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth guard — check token and role
  //   const cookieStore = await cookies();
  //   const token = cookieStore.get("bati_token")?.value;
  //   const role = cookieStore.get("bati_role")?.value;

  //   if (!token) redirect("/login");
  //   if (role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar (top sticky) */}
      <AdminNavbar />

      {/* Sidebar + Main Content (flex row) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (fixed left, sticky) */}
        <AdminSidebar />

        {/* Main content area (scrollable) */}
        <main className="flex-1 overflow-y-auto pt-6 px-8 pb-12 h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
