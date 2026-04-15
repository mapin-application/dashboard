import { BottomNav } from "./BottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-container">
      <main className="pb-20 min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
