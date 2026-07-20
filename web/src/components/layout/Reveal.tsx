"use client";

// Scroll reveal (spec 001 §4 / 002 §4). "use client": owns an
// IntersectionObserver that fades content up on first intersection, once
// (prototype: threshold 0.12, unobserve after reveal). Visibility itself is
// pure CSS (.rv/.in in globals.css); reduced motion renders the final state.
import { useEffect, useRef } from "react";

type RevealProps = {
  className?: string;
  children: React.ReactNode;
};

export function Reveal({ className, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className ? `rv ${className}` : "rv"}>
      {children}
    </div>
  );
}
