"use client";

import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/stores";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const loadUser = useAuthStore((s) => s.loadUser);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <div className="min-h-screen bg-[#0a0e17] cyber-grid">
      <Sidebar />
      <main className="ml-[240px] min-h-screen">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
