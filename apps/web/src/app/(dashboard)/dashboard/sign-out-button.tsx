"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-text-dim hover:border-green hover:text-green transition-all"
    >
      Sign Out
    </button>
  );
}
