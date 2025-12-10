import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function MatchLayout({ children }: { children: ReactNode }) {
  return children;
}
