"use client";

import { ArrowUpIcon } from "lucide-react";

export default function ScrollToTopButton() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 text-white shadow-2xl shadow-violet-500/30 transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
    >
      <ArrowUpIcon className="size-5" />
    </button>
  );
}
