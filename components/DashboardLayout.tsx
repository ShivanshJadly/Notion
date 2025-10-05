import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// This layout will be used to wrap pages that require a header and sidebar
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hide dark:bg-black">
          {children}
        </main>
      </div>
    </>
  );
}