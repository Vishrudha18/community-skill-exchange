import { useEffect } from "react";

const useScrollAnimation = (enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const elements = document.querySelectorAll(".fade-up");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [enabled]);
};

export default useScrollAnimation;
