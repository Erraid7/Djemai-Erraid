import { experience, impactStats } from "@/data/portfolio";
import { Container, SheetHeader } from "./ui";

export function Leadership() {
  return (
    <section id="leadership" className="bg-bg-raised/30 py-20 md:py-28">
      <Container>
        <SheetHeader
          index="04"
          total="05"
          title="Leadership & impact"
          descriptor="Club Scientifique de l'ESI"
        />

        <div className="mb-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {impactStats.map((stat) => (
            <div key={stat.label} className="border-l border-line-soft pl-4">
              <div className="font-display text-3xl font-semibold text-signal md:text-4xl">
                {stat.value}
              </div>
              <div className="bp-label mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="relative space-y-10 border-l border-line-soft pl-8">
          {experience.map((entry, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[calc(2rem+4.5px)] top-1.5 h-2.5 w-2.5 rounded-full border border-signal bg-bg" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-ink md:text-xl">
                  {entry.role}
                  <span className="ml-2 font-body text-sm font-normal text-ink-muted">
                    · {entry.org}
                  </span>
                </h3>
                <span className="bp-label whitespace-nowrap">{entry.period}</span>
              </div>
              <ul className="mt-3 space-y-2">
                {entry.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-line" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
