import { useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RequestBar({
  method,
  url,
  loading,
  onMethodChange,
  onUrlChange,
  onSend,
}: {
  method: "GET" | "POST";
  url: string;
  loading: boolean;
  onMethodChange: (m: "GET" | "POST") => void;
  onUrlChange: (u: string) => void;
  onSend: () => void;
}) {
  // Local input state keeps typing responsive even when the parent updates url.
  const [draft, setDraft] = useState(url);
  // Intentional: resync the local draft whenever the external url changes
  // (sidebar click, modal navigation, etc.) -- this is the documented
  // "adjusting state when a prop changes" exception, not an accidental effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDraft(url), [url]);

  const methodColor =
    method === "GET"
      ? "text-[color:var(--method-get)]"
      : "text-[color:var(--method-post)]";

  return (
    <div className="flex items-stretch gap-2 border-b border-border bg-surface px-4 py-3">
      <div
        className={cn(
          "flex items-center rounded-md border border-border bg-input pl-3 pr-1",
        )}
      >
        <select
          value={method}
          onChange={(e) => onMethodChange(e.target.value as "GET" | "POST")}
          className={cn(
            "mono cursor-pointer appearance-none bg-transparent pr-2 text-xs font-bold uppercase tracking-wider outline-none",
            methodColor,
          )}
        >
          <option value="GET" className="bg-surface text-foreground">
            GET
          </option>
          <option value="POST" className="bg-surface text-foreground">
            POST
          </option>
        </select>
      </div>

      <form
        className="flex flex-1 items-stretch gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onUrlChange(draft);
          onSend();
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => onUrlChange(draft)}
          spellCheck={false}
          placeholder="/api/..."
          className={cn(
            "mono flex-1 rounded-md border border-border bg-input px-3 text-[13px] text-foreground outline-none",
            "placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30",
          )}
        />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground",
            "transition-all hover:bg-primary/90 active:scale-[0.97] disabled:opacity-70",
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </button>
      </form>
    </div>
  );
}
