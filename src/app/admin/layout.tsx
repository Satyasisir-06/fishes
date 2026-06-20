import AdminNavbar from "@/components/admin/AdminNavbar";

export const metadata = {
  title: "Admin Panel | Kicchu",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}
