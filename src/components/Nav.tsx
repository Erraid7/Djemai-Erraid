"use client";

import { useEffect, useState } from "react";
import { Container } from "./ui";

const links = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#leadership", label: "Leadership" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-bg/90 backdrop-blur border-b border-line-soft" : "bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-mono text-sm tracking-wide text-ink">
          <span className="text-signal">DJ</span>—ERRAID
          <span className="ml-2 hidden text-ink-muted sm:inline">/ full-stack</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="bp-label transition-colors hover:text-signal"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="/resume.pdf"
          className="rounded-sm border border-line px-3 py-1.5 font-mono text-xs tracking-wide text-ink transition-colors hover:border-signal hover:text-signal"
        >
          Resume ↓
        </a>
      </Container>
    </header>
  );
}
