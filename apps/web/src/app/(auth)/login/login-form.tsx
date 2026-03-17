"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/images/teez-icon.png"
            alt="Teez"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl font-extrabold text-gradient">Sign in to Teez</h1>
          <p className="text-sm text-text-dim mt-2">
            We&apos;ll send you a magic link to your email.
          </p>
        </div>

        {status === "sent" ? (
          <div className="bg-green/10 border border-green/20 rounded-xl p-6 text-center">
            <svg className="w-8 h-8 text-green mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-green font-medium">Check your email</p>
            <p className="text-text-dim text-sm mt-1">
              We sent a magic link to <strong className="text-text-primary">{email}</strong>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="you@company.com"
              required
              className="w-full px-4 py-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-green/50 focus:ring-1 focus:ring-green/20 transition-all"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-6 py-3 rounded-lg font-semibold bg-gradient-to-br from-green-dim to-green text-bg transition-all hover:shadow-[0_0_30px_rgba(74,222,128,0.15)] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Send Magic Link"}
            </button>
            {status === "error" && (
              <p className="text-red-400 text-sm text-center">{message}</p>
            )}
          </form>
        )}

        <p className="text-center text-text-muted text-xs mt-6">
          <a href="/" className="hover:text-green transition-colors">
            &larr; Back to home
          </a>
        </p>
      </div>
    </div>
  );
}
