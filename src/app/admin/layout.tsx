import AdminSidebar from "@/components/admin/AdminSidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s — SOS Brasil" },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f3f3" }}>
      <AdminSidebar />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: "32px 40px",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {children}
      </main>
    </div>
  );
}
