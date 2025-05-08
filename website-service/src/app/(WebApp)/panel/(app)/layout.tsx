import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";

// =============================================================================================

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[calc(100dvh-4rem)]">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="p-6 pb-12 flex-1">{children}</div>
      </div>
    </div>
  );
}

// =============================================================================================
