import Header from "@/components/Header/Header";

// =============================================================================================

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4.5rem)]">
      <Header />
      {children}
    </div>
  );
}

// =============================================================================================
