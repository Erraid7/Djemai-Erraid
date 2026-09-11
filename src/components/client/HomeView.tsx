"use client";

import { useEffect, useRef, useState } from "react";
import { FolderGit2, Sparkles, Mail, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { HttpMethod } from "@/hooks/useApiClient";

type Stat = { value: string; label: string };

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function CountUpStat({ stat, delay }: { stat: Stat; delay: number }) {
  const match = stat.value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1]!, 10) : null;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(target === null ? stat.value : 0);

  useEffect(() => {
    if (target === null) return;
    if (prefersReducedMotion()) {
      // Intentional: skip the count-up animation entirely and just show the
      // final value -- matchMedia is only available client-side, so this
      // has to be decided in an effect on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(target);
      return;
    }

    let raf = 0;
    const startTimer = setTimeout(() => {
      const duration = 900;
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        // Quart-out: matches --e-out-quart so numbers settle with the same
        // deceleration as everything else on screen.
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplay(Math.round(eased * target!));
        if (progress < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [target, delay]);

  return (
    <div
      className="spotlight group animate-fade-up relative overflow-hidden rounded-xl border border-border bg-card px-3 py-3 transition-[transform,border-color,box-shadow] duration-300 ease-(--e-out-quart) hover:-translate-y-1 hover:border-primary/40 hover:elev-2"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span aria-hidden className="spotlight-layer" />
      <div className="mono relative text-xl font-semibold tabular-nums text-foreground">
        {display}
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="relative mt-0.5 text-[13px] leading-tight text-muted-foreground">
        {stat.label}
      </div>
    </div>
  );
}

function TiltPhoto({ photoUrl, name }: { photoUrl?: string; name: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  // Written straight to the DOM inside a rAF rather than through state: a
  // pointer-driven transform that re-renders React on every mousemove is the
  // single easiest way to make a hero feel laggy.
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || prefersReducedMotion()) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(900px) rotateX(${py * -9}deg) rotateY(${px * 12}deg) scale(1.02)`;
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = "1";
        glareRef.current.style.background = `radial-gradient(340px circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, oklch(1 0 0 / 0.16), transparent 60%)`;
      }
    });
  }

  function reset() {
    cancelAnimationFrame(frame.current);
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
    if (glareRef.current) glareRef.current.style.opacity = "0";
  }

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <div
      ref={wrapperRef}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      className="relative mx-auto w-full max-w-70 sm:max-w-80"
    >
      {/* Colour bloom behind the card -- reads as light spilling off the photo. */}
      <div
        aria-hidden
        className="animate-float pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-linear-to-tr from-primary/20 via-cyan-accent/10 to-transparent blur-2xl"
      />
      <div
        ref={cardRef}
        className="relative aspect-4/5 w-full overflow-hidden rounded-3xl border border-border-strong transition-transform duration-500 ease-(--e-out-expo) will-change-transform elev-3"
      >
        <Avatar className="h-full w-full rounded-3xl">
          <AvatarImage
            src={photoUrl}
            alt={name}
            className="object-cover"
            fetchPriority="high"
          />
          <AvatarFallback className="mono h-full w-full rounded-3xl text-4xl">
            {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent" />
        {/* Specular highlight tracking the pointer. */}
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />
      </div>

      <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border-strong bg-card px-3 py-1.5 elev-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="mono whitespace-nowrap text-[12px] font-medium text-foreground">
          open to work
        </span>
      </div>
    </div>
  );
}

export function HomeView({
  data,
  onNavigate,
}: {
  data: {
    name: string;
    role: string;
    photoUrl?: string;
    status: string;
    tagline: string;
    howToUse: string[];
    stats?: Stat[];
  };
  onNavigate: (url: string, method: HttpMethod) => void;
}) {
  const quickActions = [
    {
      label: "View projects",
      url: "/api/projects",
      method: "GET" as HttpMethod,
      icon: FolderGit2,
    },
    {
      label: "What I offer",
      url: "/api/services",
      method: "GET" as HttpMethod,
      icon: Sparkles,
    },
    {
      label: "Get in touch",
      url: "/api/contact",
      method: "POST" as HttpMethod,
      icon: Mail,
    },
  ];

  return (
    <div className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-drift absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="animate-drift absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-cyan-accent/8 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[280px_1fr] md:gap-12">
        <div className="animate-pop">
          <TiltPhoto photoUrl={data.photoUrl} name={data.name} />
        </div>

        <div className="text-center md:text-left">
          <p
            className="mono animate-fade-up inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[12px] uppercase tracking-[0.18em] text-primary"
            style={{ animationDelay: "60ms" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {data.role}
          </p>

          <h1
            className="animate-fade-up animate-gradient-pan mt-3 bg-linear-to-r from-foreground via-foreground/70 to-foreground bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
            style={{ animationDelay: "120ms" }}
          >
            {data.name}
          </h1>

          <p
            className="animate-fade-up mt-2 text-sm text-muted-foreground"
            style={{ animationDelay: "180ms" }}
          >
            {data.status}
          </p>

          <p
            className="animate-fade-up mt-5 max-w-lg text-base leading-relaxed text-foreground/85"
            style={{ animationDelay: "240ms" }}
          >
            {data.tagline}
          </p>

          {data.stats && data.stats.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {data.stats.map((s, i) => (
                <CountUpStat key={s.label} stat={s} delay={300 + i * 90} />
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-2.5 md:justify-start">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.url}
                  type="button"
                  onClick={() => onNavigate(action.url, action.method)}
                  className="press group animate-fade-up relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border-strong bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary hover:shadow-(--glow-primary)"
                  style={{ animationDelay: `${660 + i * 80}ms` }}
                >
                  <Icon className="h-4 w-4 transition-transform duration-300 ease-(--e-spring) group-hover:scale-115" />
                  {action.label}
                  <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 ease-(--e-out-quart) group-hover:translate-x-0 group-hover:opacity-100" />
                </button>
              );
            })}
          </div>

          {/* howToUse ships in the /api/home payload; surfacing it here means
              a first-time visitor is told the mechanic instead of guessing it. */}
          {data.howToUse?.length > 0 && (
            <ol className="mx-auto mt-7 max-w-lg space-y-1.5 text-left md:mx-0">
              {data.howToUse.map((step, i) => (
                <li
                  key={step}
                  className="animate-fade-up flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground"
                  style={{ animationDelay: `${900 + i * 70}ms` }}
                >
                  <span className="mono mt-px flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border border-border bg-surface-2 text-[10px] tabular-nums text-primary">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
