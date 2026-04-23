import { BackgroundTracker } from "@/components/collectrice/BackgroundTracker";

export default function CollectriceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <BackgroundTracker />
      <main>
        {children}
      </main>
    </div>
  );
}
