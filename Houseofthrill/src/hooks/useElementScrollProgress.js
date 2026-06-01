import { useEffect, useRef, useState } from "react";

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function useElementScrollProgress(mode = "section") {
  const elementRef = useRef(null);
  const frameRef = useRef(null);
  const watchFrameRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      frameRef.current = null;

      if (!elementRef.current) {
        return;
      }

      const rect = elementRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const distance =
        mode === "sticky"
          ? Math.max(1, rect.height - viewportHeight)
          : Math.max(1, rect.height <= viewportHeight ? viewportHeight : rect.height - viewportHeight);
      const nextProgress =
        mode === "viewport"
          ? clamp((viewportHeight - rect.top) / (viewportHeight + rect.height))
          : clamp(-rect.top / distance);

      setProgress((currentProgress) => {
        if (Math.abs(currentProgress - nextProgress) < 0.001) {
          return currentProgress;
        }

        return nextProgress;
      });
    };

    const requestUpdate = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      update();
      frameRef.current = window.requestAnimationFrame(update);
    };

    const watchWhileActive = () => {
      if (!elementRef.current) {
        watchFrameRef.current = null;
        return;
      }

      const rect = elementRef.current.getBoundingClientRect();
      const isActive = rect.top < window.innerHeight && rect.bottom > 0;

      if (isActive) {
        update();
        watchFrameRef.current = window.requestAnimationFrame(watchWhileActive);
      } else {
        watchFrameRef.current = null;
      }
    };

    const requestWatch = () => {
      requestUpdate();

      if (watchFrameRef.current === null) {
        watchFrameRef.current = window.requestAnimationFrame(watchWhileActive);
      }
    };

    requestWatch();
    window.addEventListener("scroll", requestWatch, { passive: true });
    window.addEventListener("wheel", requestWatch, { passive: true });
    window.addEventListener("touchmove", requestWatch, { passive: true });
    window.addEventListener("resize", requestWatch);

    return () => {
      window.removeEventListener("scroll", requestWatch);
      window.removeEventListener("wheel", requestWatch);
      window.removeEventListener("touchmove", requestWatch);
      window.removeEventListener("resize", requestWatch);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      if (watchFrameRef.current !== null) {
        window.cancelAnimationFrame(watchFrameRef.current);
      }
    };
  }, [mode]);

  return [elementRef, progress];
}
