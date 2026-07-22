import { profile } from "@/data/portfolio";
import { Container, SheetHeader } from "./ui";

export function About() {
  return (
    <section id="about" className="py-20 md:py-28">
      <Container>
        <SheetHeader
          index="01"
          total="05"
          title="About"
          descriptor="Background & context"
        />
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr]">
          <div className="bp-label space-y-2">
            <p>{profile.school}</p>
            <p>{profile.schoolYears}</p>
            <p className="pt-3 text-signal">{profile.seeking}</p>
          </div>
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-ink-muted">
            <p>
              I&apos;m a third-year Computer Science student at ESI Algiers who&apos;d
              rather ship something real than build another tutorial project.
              That&apos;s why <span className="text-ink">ESI Flow</span> exists as
              a live, multi-role SaaS instead of a demo — and why{" "}
              <span className="text-ink">Khatma</span> covers web and mobile,
              not just one.
            </p>
            <p>
              Outside of code, I lead{" "}
              <span className="text-ink">CSE, a 1,000+ member student tech
              club</span> with 10 departments — which means most weeks split
              between writing TypeScript and running budgets, sprint
              planning, and a flagship hackathon. Both sides feed each other:
              leading a club taught me how to scope and ship with a team;
              building production systems taught me how to make decisions
              that hold up under real usage.
            </p>
            <p>
              I&apos;m currently exploring how far autonomous AI agents can go in
              real engineering workflows —{" "}
              <span className="text-ink">Refactoring Swarm</span> is the
              first result — and looking for a Summer 2026 internship where I
              can bring that same production mindset from day one.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
