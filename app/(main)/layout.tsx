import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default async function MainAppLayout({
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