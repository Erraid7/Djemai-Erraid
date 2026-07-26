import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MousePointerClick, Send, TextCursorInput } from "lucide-react";

const stepIcons = [MousePointerClick, Send, TextCursorInput];

type Stat = { value: string; label: string };

export function HomeView({
  data,
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
}) {
  return (
    <div className="relative flex min-h-105 flex-col items-center justify-center overflow-hidden px-6 py-12 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-drift absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div
          className="animate-drift absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <Avatar className="h-24 w-24 border border-border-strong shadow-lg animate-in fade-in zoom-in-95 duration-500">
          <AvatarImage src={data.photoUrl} alt={data.name} />
          <AvatarFallback className="mono text-xl">
            {data.name
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </AvatarFallback>
        </Avatar>

        <h1 className="mt-5 animate-in fade-in slide-in-from-bottom-2 text-2xl font-semibold tracking-tight text-foreground duration-500 [animation-delay:100ms] fill-mode-[backwards] sm:text-3xl">
          {data.name}
        </h1>
        <p className="mt-1 animate-in fade-in slide-in-from-bottom-2 text-sm text-muted-foreground duration-500 [animation-delay:150ms] fill-mode-[backwards]">
          {data.status}
        </p>

        <p className="mt-6 max-w-md animate-in fade-in slide-in-from-bottom-2 text-[15px] leading-relaxed text-foreground/85 duration-500 [animation-delay:220ms] fill-mode-[backwards]">
          {data.tagline}
        </p>

        {data.stats && data.stats.length > 0 && (
          <div className="mt-7 grid w-full max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
            {data.stats.map((s, i) => (
              <div
                key={s.label}
                className="animate-in fade-in zoom-in-95 rounded-xl border border-border bg-card px-3 py-3 duration-500 fill-mode-[backwards]"
                style={{ animationDelay: `${260 + i * 70}ms` }}
              >
                <div className="text-lg font-semibold text-foreground">{s.value}</div>
                <div className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 grid w-full max-w-md gap-3 text-left">
          {data.howToUse.map((step, i) => {
            const Icon = stepIcons[i] ?? MousePointerClick;
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-ring animate-in fade-in slide-in-from-bottom-2 fill-mode-[backwards]"
                style={{ animationDelay: `${540 + i * 90}ms` }}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-foreground/85">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
