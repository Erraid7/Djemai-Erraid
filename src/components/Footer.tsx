import { languages, profile } from "@/data/portfolio";
import { Container } from "./ui";

export function Footer() {
  return (
    <footer className="border-t border-line-soft py-10">
      <Container className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="bp-label">
          {profile.name} — © {new Date().getFullYear()}
        </p>
        <p className="bp-label">
          {languages.map((l) => l.name).join(" · ")}
        </p>
      </Container>
    </footer>
  );
}
