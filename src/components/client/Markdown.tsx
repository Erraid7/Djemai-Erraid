import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A deliberately small markdown renderer for the project case studies.
 *
 * Covers what `docsMarkdown` actually uses — `##`/`###` headings, paragraphs,
 * `-`/`1.` lists, `> ` quotes, and inline **bold**, *em*, `code`, [links](…).
 * It builds React nodes directly and never sets raw HTML, so seed content can't
 * inject markup; that, plus the tiny scope, is why this isn't a dependency.
 */
export function Markdown({
  source,
  skipHeading,
  className,
}: {
  source: string;
  /** Drop a leading heading with this exact text (the page already shows it). */
  skipHeading?: string;
  className?: string;
}) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const out: ReactNode[] = [];

  blocks.forEach((raw, bi) => {
    let lines = raw.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) return;

    // A heading can sit directly on top of a paragraph with no blank line.
    const heading = lines[0]!.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      const text = heading[2]!.trim();
      lines = lines.slice(1);
      if (!(bi === 0 && skipHeading && text === skipHeading)) {
        out.push(
          heading[1] === "##" ? (
            <h2
              key={`h-${bi}`}
              className="mt-7 text-lg font-semibold tracking-tight text-foreground first:mt-0"
            >
              {inline(text, `h-${bi}`)}
            </h2>
          ) : (
            <h3
              key={`h-${bi}`}
              className="mono mt-6 text-[12px] uppercase tracking-[0.18em] text-primary/90 first:mt-0"
            >
              {inline(text, `h-${bi}`)}
            </h3>
          ),
        );
      }
      if (lines.length === 0) return;
    }

    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      out.push(
        <ul key={`ul-${bi}`} className="mt-3 space-y-1.5">
          {lines.map((l, li) => (
            <li
              key={li}
              className="relative pl-4 text-[15px] leading-relaxed text-foreground/85"
            >
              <span
                aria-hidden
                className="absolute left-0 top-[0.6rem] h-1.5 w-1.5 rounded-full bg-primary/70"
              />
              {inline(l.replace(/^\s*[-*]\s+/, ""), `ul-${bi}-${li}`)}
            </li>
          ))}
        </ul>,
      );
      return;
    }

    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      out.push(
        <ol key={`ol-${bi}`} className="mt-3 space-y-1.5">
          {lines.map((l, li) => (
            <li
              key={li}
              className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/85"
            >
              <span className="mono mt-0.5 shrink-0 text-[13px] tabular-nums text-primary">
                {li + 1}.
              </span>
              <span>{inline(l.replace(/^\s*\d+\.\s+/, ""), `ol-${bi}-${li}`)}</span>
            </li>
          ))}
        </ol>,
      );
      return;
    }

    if (lines.every((l) => l.startsWith(">"))) {
      out.push(
        <blockquote
          key={`q-${bi}`}
          className="mt-4 border-l-2 border-primary/50 bg-primary/5 py-2 pl-4 pr-3 text-[15px] italic leading-relaxed text-foreground/85"
        >
          {inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "), `q-${bi}`)}
        </blockquote>,
      );
      return;
    }

    out.push(
      <p
        key={`p-${bi}`}
        className="mt-3.5 text-[15px] leading-[1.75] text-foreground/85 first:mt-0"
      >
        {inline(lines.join(" "), `p-${bi}`)}
      </p>,
    );
  });

  return <div className={cn("min-w-0", className)}>{out}</div>;
}

// Order matters: bold before em so `**x**` isn't read as two empty ems.
const INLINE =
  /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g;

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let n = 0;

  for (const m of text.matchAll(INLINE)) {
    const start = m.index;
    if (start > last) nodes.push(text.slice(last, start));
    const tok = m[0];
    const key = `${keyPrefix}-${n++}`;

    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("`")) {
      nodes.push(
        <code
          key={key}
          className="mono rounded border border-border bg-surface-2 px-1.5 py-0.5 text-[13px] text-foreground"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("[")) {
      const link = tok.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      const href = link?.[2] ?? "";
      // Only schemes that can't execute anything.
      if (link && /^(https?:|mailto:|\/|#)/i.test(href)) {
        const external = /^https?:/i.test(href);
        nodes.push(
          <a
            key={key}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="text-primary underline decoration-primary/40 underline-offset-2 transition-colors hover:decoration-primary"
          >
            {link[1]}
          </a>,
        );
      } else {
        nodes.push(link?.[1] ?? tok);
      }
    } else {
      nodes.push(
        <em key={key} className="text-foreground">
          {tok.slice(1, -1)}
        </em>,
      );
    }
    last = start + tok.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
