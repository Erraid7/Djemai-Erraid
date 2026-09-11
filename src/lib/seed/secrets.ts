/**
 * Payloads for the unlisted endpoints. Kept here so the jokes and the
 * personal bits are easy to reword without touching route handlers.
 *
 * Everything here is written in first person and shown to visitors -- edit
 * freely, it's the most "you" content on the site.
 */

export const whoami = {
  you: "anonymous visitor",
  permissions: ["read"],
  note: "No auth required. Nothing here is behind a login — the login route is a joke, remember.",
  detected: {
    curiosity: "high",
    evidence: "you typed a URL that isn't in the sidebar",
  },
  hint: "There are two more unlisted routes. One is a well-known HTTP joke.",
};

export const coffee = {
  error: "I'm a teapot. I can brew you a backend, not an espresso.",
  rfc: "RFC 2324, Hyper Text Coffee Pot Control Protocol",
  accepts: ["tea", "code review", "internship offers"],
};

export const secret = {
  message: "You found the last one. Here's what isn't on the CV.",
  thingsNotOnMyCv: [
    "I rewrote ESI Flow's permission layer three times before it was right. The first two worked — they just weren't something anyone else could safely extend.",
    "Running CSE (1,000+ members, 10 departments) taught me more about shipping than any single project did. Most engineering problems turn out to be coordination problems wearing a costume.",
    "I build things I'll actually have to maintain. That's why this portfolio has real route handlers instead of a hardcoded JSON blob — it was the honest version of the idea.",
    "My favourite part of a project is the second pass, once it works and you finally get to make it good.",
  ],
  stillLookingFor: "A summer 2026 internship on a team that ships real systems.",
  nextStep: "POST /api/contact — it actually sends me an email.",
};
