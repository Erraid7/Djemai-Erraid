import { skillCategories } from "@/data/portfolio";
import { Container, SheetHeader } from "./ui";

export function Skills() {
  return (
    <section id="skills" className="py-20 md:py-28">
      <Container>
        <SheetHeader
          index="03"
          total="05"
          title="Skills & tooling"
          descriptor="Grouped by system layer"
        />
        <div className="grid gap-px overflow-hidden rounded-sm border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat) => (
            <div key={cat.id} className="bg-bg p-6">
              <p className="bp-label mb-4 text-signal">{cat.label}</p>
              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item} className="text-sm text-ink-muted">
                    {item}
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
