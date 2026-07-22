import { projects } from "@/data/portfolio";
import { Container, CornerFrame, SheetHeader, Tag } from "./ui";

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <section id="work" className="bg-bg-raised/30 py-20 md:py-28">
      <Container>
        <SheetHeader
          index="02"
          total="05"
          title="Selected work"
          descriptor="Production systems, not exercises"
        />

        <div className="space-y-8">
          {featured.map((project) => (
            <CornerFrame
              key={project.id}
              className="grid gap-8 border border-line-soft bg-bg p-6 md:grid-cols-[auto_1fr] md:p-10"
            >
              <div className="flex flex-row items-start gap-4 md:flex-col md:items-start md:gap-6">
                <span className="font-mono text-sm text-ink-muted">
                  {project.sheetNumber}
                </span>
                <div className="hidden h-full w-px bg-line-soft md:block" />
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold text-ink md:text-3xl">
                    {project.name}
                  </h3>
                  <span className="bp-label">{project.role}</span>
                </div>

                <p className="mt-4 max-w-2xl text-ink-muted">
                  {project.summary}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {project.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-signal" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>

                <div className="mt-6 flex gap-5">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-signal underline underline-offset-4"
                    >
                      Live site ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
                    >
                      Source ↗
                    </a>
                  )}
                </div>
              </div>
            </CornerFrame>
          ))}
        </div>

        <div className="mt-16">
          <p className="bp-label mb-6">Other builds</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {other.map((project) => (
              <CornerFrame
                key={project.id}
                className="border border-line-soft bg-bg p-6"
              >
                <div className="flex items-baseline justify-between">
                  <h4 className="font-display text-lg font-semibold text-ink">
                    {project.name}
                  </h4>
                  <span className="font-mono text-xs text-ink-muted">
                    {project.sheetNumber}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </CornerFrame>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
