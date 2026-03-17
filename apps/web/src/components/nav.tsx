"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 border-b ${
        scrolled
          ? "bg-bg/85 backdrop-blur-2xl border-border"
          : "border-transparent"
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-6 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-3">
          <Image
            src="/images/teez-icon.png"
            alt="Teez"
            width={44}
            height={44}
          />
          <span className="text-2xl font-extrabold tracking-tight text-gradient">
            Teez
          </span>
        </Link>

        <div
          className={`hidden md:flex gap-8 ${
            menuOpen
              ? "!flex flex-col absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-2xl p-6 gap-4 border-b border-border"
              : ""
          }`}
        >
          <a
            href="#problem"
            className="text-sm text-text-dim hover:text-green transition-colors"
          >
            Problem
          </a>
          <a
            href="#solution"
            className="text-sm text-text-dim hover:text-green transition-colors"
          >
            Solution
          </a>
          <a
            href="#pricing"
            className="text-sm text-text-dim hover:text-green transition-colors"
          >
            Pricing
          </a>
          <a
            href="#advantage"
            className="text-sm text-text-dim hover:text-green transition-colors"
          >
            Why Us
          </a>
        </div>

        <a
          href="#waitlist"
          className="hidden md:inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-green-dim to-green text-bg transition-all hover:shadow-[0_0_30px_rgba(74,222,128,0.15)] hover:-translate-y-px"
        >
          Join Waitlist
        </a>

        <button
          className="md:hidden p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block w-6 h-0.5 bg-text-primary transition-transform ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-text-primary transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-text-primary transition-transform ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-2xl p-6 border-b border-border flex flex-col gap-4">
          <a
            href="#problem"
            className="text-sm text-text-dim"
            onClick={() => setMenuOpen(false)}
          >
            Problem
          </a>
          <a
            href="#solution"
            className="text-sm text-text-dim"
            onClick={() => setMenuOpen(false)}
          >
            Solution
          </a>
          <a
            href="#pricing"
            className="text-sm text-text-dim"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </a>
          <a
            href="#advantage"
            className="text-sm text-text-dim"
            onClick={() => setMenuOpen(false)}
          >
            Why Us
          </a>
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-br from-green-dim to-green text-bg"
            onClick={() => setMenuOpen(false)}
          >
            Join Waitlist
          </a>
        </div>
      )}
    </nav>
  );
}
