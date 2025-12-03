import { ReactNode } from "react";

// Force dynamic rendering - authenticated routes can't be statically generated
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}

