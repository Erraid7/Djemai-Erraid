"use client";

import { useEffect, useRef, useState } from "react";
import { FolderGit2, Sparkles, Mail, ArrowUpRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { HttpMethod } from "@/hooks/useApiClient";

type Stat = { value: string; label: string };

function CountUpStat({ stat, delay }: { stat: Stat; delay: number }) {
  const match = stat.value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(target === null ? stat.value : 0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (target === null) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      // Intentional: skip the count-up animation entirely and just show the
      // final value -- matchMedia is only available client-side, so this
      // has to be decided in an effect on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(target);
      return;
    }

    const startTimer = setTimeout(() => {
      const duration = 700;
      const start = performance.now();
      const targetValue = target;
      function tick(now: number) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * targetValue));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [target, delay]);

  return (
    <div
      ref={ref}
      className="animate-in fade-in zoom-in-95 rounded-xl border border-border bg-card px-3 py-3 duration-500 [animation-fill-mode:backwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mono text-xl font-semibold text-foreground">
        {display}
        {suffix}
      </div>
      <div className="mt-0.5 text-[13px] leading-tight text-muted-foreground">
        {stat.label}
      </div>
    </div>
  );
}

function TiltPhoto({ photoUrl, name }: { photoUrl?: string; name: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }
  function onMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative mx-auto w-full max-w-[280px] [perspective:900px] sm:max-w-[320px]"
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border-strong shadow-2xl transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <Avatar className="h-full w-full rounded-3xl">
          <AvatarImage src={photoUrl} alt={name} className="object-cover" />
          <AvatarFallback className="mono h-full w-full rounded-3xl text-4xl">
            {name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>

      <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border-strong bg-card px-3 py-1.5 shadow-lg">
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
    { label: "View projects", url: "/api/projects", method: "GET" as HttpMethod, icon: FolderGit2 },
    { label: "What I offer", url: "/api/services", method: "GET" as HttpMethod, icon: Sparkles },
    { label: "Get in touch", url: "/api/contact", method: "POST" as HttpMethod, icon: Mail },
  ];

  return (
    <div className="relative overflow-hidden px-5 py-10 sm:px-8 sm:py-14">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-drift absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="animate-drift absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-[280px_1fr] md:gap-12">
        <div className="animate-in fade-in zoom-in-95 duration-700">
          <TiltPhoto photoUrl={data.photoUrl} name={data.name} />
        </div>

        <div className="text-center md:text-left">
          <p className="mono animate-in fade-in slide-in-from-bottom-1 text-[13px] uppercase tracking-[0.2em] text-primary duration-500 [animation-fill-mode:backwards]">
            {data.role}
          </p>
          <h1 className="mt-2 animate-in fade-in slide-in-from-bottom-2 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent duration-500 [animation-delay:80ms] [animation-fill-mode:backwards] sm:text-5xl">
            {data.name}
          </h1>
          <p className="mt-2 animate-in fade-in slide-in-from-bottom-2 text-sm text-muted-foreground duration-500 [animation-delay:140ms] [animation-fill-mode:backwards]">
            {data.status}
          </p>

          <p className="mt-5 max-w-lg animate-in fade-in slide-in-from-bottom-2 text-base leading-relaxed text-foreground/85 duration-500 [animation-delay:200ms] [animation-fill-mode:backwards]">
            {data.tagline}
          </p>

          {data.stats && data.stats.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {data.stats.map((s, i) => (
                <CountUpStat key={s.label} stat={s} delay={260 + i * 90} />
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
                  className="group animate-in fade-in slide-in-from-bottom-2 inline-flex items-center gap-2 rounded-full border border-border-strong bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary [animation-fill-mode:backwards]"
                  style={{ animationDelay: `${620 + i * 80}ms` }}
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              );
            })}
          </div>

          <p className="mono mt-5 animate-in fade-in text-[12px] text-muted-foreground duration-500 [animation-delay:900ms] [animation-fill-mode:backwards]">
            every button here fires a real request -- try the sidebar too.
          </p>
        </div>
      </div>
    </div>
  );
}
