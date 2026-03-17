import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-bg p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-extrabold text-gradient">Teez Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-dim">{user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <div className="bg-bg-card border border-border rounded-xl p-12 text-center">
        <h2 className="text-xl font-bold mb-4">Coming Soon</h2>
        <p className="text-text-dim">
          Deal pipeline, document analysis, and team collaboration — launching with the Excel add-in beta.
        </p>
      </div>
    </div>
  );
}
