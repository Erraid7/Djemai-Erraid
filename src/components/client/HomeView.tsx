import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MousePointerClick, Send, TextCursorInput } from "lucide-react";

const stepIcons = [MousePointerClick, Send, TextCursorInput];

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
  };
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
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

      <h1 className="mt-5 animate-in fade-in slide-in-from-bottom-2 text-2xl font-semibold tracking-tight text-foreground duration-500 [animation-delay:100ms] [animation-fill-mode:backwards] sm:text-3xl">
        {data.name}
      </h1>
      <p className="mt-1 animate-in fade-in slide-in-from-bottom-2 text-sm text-muted-foreground duration-500 [animation-delay:150ms] [animation-fill-mode:backwards]">
        {data.status}
      </p>

      <p className="mt-6 max-w-md animate-in fade-in slide-in-from-bottom-2 text-[15px] leading-relaxed text-foreground/85 duration-500 [animation-delay:220ms] [animation-fill-mode:backwards]">
        {data.tagline}
      </p>

      <div className="mt-8 grid w-full max-w-md gap-3 text-left">
        {data.howToUse.map((step, i) => {
          const Icon = stepIcons[i] ?? MousePointerClick;
          return (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-fill-mode:backwards]"
              style={{ animationDelay: `${280 + i * 90}ms` }}
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
  );
}
