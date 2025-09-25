import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="w-full mx-auto bg-gray-100 px-6 flex-grow pt-7">
          {children}
        </main>
      </div>
    </div>
  );
}
