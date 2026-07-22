"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/portfolio";
import { Container } from "./ui";

type Node = { id: string; label: string; x: number; y: number };

// Central node = Mohamed. Satellites = the disciplines his projects connect —
// mirrors the Auditor/Fixer/Tester/Documenter orchestration in Refactoring Swarm,
// and doubles as a literal map of the skills below.
const nodes: Node[] = [
  { id: "fe", label: "FRONTEND", x: 60, y: 40 },
  { id: "be", label: "BACKEND", x: 340, y: 30 },
  { id: "db", label: "DATABASE", x: 380, y: 210 },
  { id: "ai", label: "AI AGENTS", x: 200, y: 260 },
  { id: "mobile", label: "MOBILE", x: 30, y: 200 },
];

const center = { x: 205, y: 130 };

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="bp-grid pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative grid gap-14 md:grid-cols-[1.15fr_1fr] md:items-center">
        <div>
          <div className="bp-label mb-5 flex items-center gap-3">
            <span className="text-signal">SHEET 00/05</span>
            <span className="h-px w-10 bg-line" />
            <span>{profile.seeking}</span>
          </div>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Building systems,
            <br />
            not just screens.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            {profile.tagline}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="rounded-sm bg-signal px-5 py-3 font-mono text-sm font-medium tracking-wide text-bg transition-transform hover:-translate-y-0.5"
            >
              View the work
            </a>
            <a
              href="#contact"
              className="rounded-sm border border-line px-5 py-3 font-mono text-sm tracking-wide text-ink transition-colors hover:border-signal hover:text-signal"
            >
              Get in touch
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 bp-label">
            <span>{profile.school}</span>
            <span>{profile.location}</span>
          </div>
        </div>

        <div className="relative mx-auto aspect-[410/300] w-full max-w-md">
          <svg
            viewBox="0 0 410 300"
            className="h-full w-full overflow-visible"
            aria-hidden="true"
          >
            {nodes.map((n, i) => (
              <motion.line
                key={`line-${n.id}`}
                x1={center.x}
                y1={center.y}
                x2={n.x}
                y2={n.y}
                stroke="var(--bp-line)"
                strokeWidth={1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 * i, ease: "easeInOut" }}
              />
            ))}

            {nodes.map((n, i) => (
              <g key={`node-${n.id}`}>
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={5}
                  fill="var(--bp-bg)"
                  stroke="var(--bp-cyan)"
                  strokeWidth={1.5}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 * i + 0.6 }}
                />
                <motion.text
                  x={n.x}
                  y={n.y - 12}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={9}
                  fill="var(--bp-ink-muted)"
                  letterSpacing={1}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.15 * i + 0.8 }}
                >
                  {n.label}
                </motion.text>
              </g>
            ))}

            <motion.circle
              cx={center.x}
              cy={center.y}
              r={22}
              fill="var(--bp-bg-raised)"
              stroke="var(--bp-signal)"
              strokeWidth={1.5}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <text
              x={center.x}
              y={center.y + 4}
              textAnchor="middle"
              className="font-mono"
              fontSize={11}
              fill="var(--bp-signal)"
              fontWeight={600}
            >
              M.E.
            </text>
          </svg>
        </div>
      </Container>
    </section>
  );
}
