import { ForumSidebar } from "./_components/forum-sidebar";

export default function ForumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 space-y-6">{children}</main>
          <aside className="space-y-8">
            <ForumSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
