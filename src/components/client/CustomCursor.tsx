"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Elements that should visually "activate" the cursor. Add
// data-cursor="interactive" to anything else you want included (e.g. a
// custom card that isn't a real <button>).
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor="interactive"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);
  // Mirrors `visible` so the mousemove handler can check it without making
  // every single frame a React render.
  const visibleRef = useRef(false);

  useEffect(() => {
    const canHover = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!canHover || reducedMotion) return;

    // Intentional: matchMedia is only available client-side, so this has to
    // be decided in an effect on mount, not during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    }

    function onOver(e: MouseEvent) {
      if ((e.target as Element).closest?.(INTERACTIVE_SELECTOR)) {
        setHovering(true);
      }
    }
    function onOut(e: MouseEvent) {
      if ((e.target as Element).closest?.(INTERACTIVE_SELECTOR)) {
        setHovering(false);
      }
    }
    function onDown() {
      setPressed(true);
    }
    function onUp() {
      setPressed(false);
    }
    function onLeave() {
      visibleRef.current = false;
      setVisible(false);
    }

    function tick() {
      // Critically-damped-ish follow: the ring lags the dot just enough to
      // read as weight without feeling sluggish.
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      {/* Position and appearance are split across two nested elements on
          purpose: the outer one only ever gets a transform written by rAF,
          while the inner one animates scale/colour through CSS. Animating
          width/height here instead would relayout on every hover. */}
      <div
        ref={dotRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-200 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={cn(
            "h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-200 ease-(--e-out-quart)",
            pressed ? "scale-150" : hovering ? "scale-0" : "scale-100",
          )}
        />
      </div>
      <div
        ref={ringRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-200 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div
          className={cn(
            "h-7 w-7 rounded-full border transition-[transform,background-color,border-color] duration-300 ease-(--e-out-expo)",
            hovering
              ? "scale-140 border-primary bg-primary/10"
              : "scale-100 border-primary/45 bg-transparent",
            pressed && "scale-90 bg-primary/20",
          )}
        />
      </div>
    </>
  );
}
