import Sidebar from "./components/sidebar";
import Topnav from "./components/topnav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Topnav />
        <main className="flex-1 overflow-auto">
          <div className="h-full p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}