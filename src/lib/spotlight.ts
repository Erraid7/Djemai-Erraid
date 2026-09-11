/**
 * Feeds pointer position into the `.spotlight` / `.spotlight-layer` pair in
 * globals.css.
 *
 * Writes two custom properties straight onto the element. Deliberately not
 * React state: this fires on every pointermove, and re-rendering a card list
 * at that rate is exactly what makes a hover effect feel heavy.
 */
export function spotlightMove(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
