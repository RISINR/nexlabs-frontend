
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  // Optional: smooth mouse-wheel scrolling
  // Enable by setting `enableSmoothWheel` to true. It's opt-in because
  // synthetic wheel handling can affect accessibility and native behavior.
  function initSmoothWheel(enableSmoothWheel = true) {
    if (!enableSmoothWheel) return;
    try {
      let target = window.scrollY || document.documentElement.scrollTop;
      let current = target;
      const ease = 0.12;
      let rafId: number | null = null;

      const clamp = (v: number) => Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight));

      const canScrollElement = (el: HTMLElement, deltaY: number) => {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        const isScrollableY =
          (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
          el.scrollHeight > el.clientHeight;

        if (!isScrollableY) return false;
        if (deltaY > 0) return el.scrollTop + el.clientHeight < el.scrollHeight;
        if (deltaY < 0) return el.scrollTop > 0;
        return false;
      };

      const hasScrollableParent = (startEl: HTMLElement | null, deltaY: number) => {
        let el: HTMLElement | null = startEl;
        while (el && el !== document.body) {
          if (canScrollElement(el, deltaY)) return true;
          el = el.parentElement;
        }
        return false;
      };

      function onWheel(e: WheelEvent) {
        if (e.defaultPrevented || e.ctrlKey || e.metaKey) return;

        const eventTarget = e.target instanceof HTMLElement ? e.target : null;
        if (hasScrollableParent(eventTarget, e.deltaY)) {
          // Let native scrolling work for dropdowns, modals, and inner scroll areas.
          return;
        }

        e.preventDefault();
        target = clamp(target + e.deltaY);
        if (rafId == null) {
          rafId = requestAnimationFrame(smoothStep);
        }
      }

      function smoothStep() {
        current += (target - current) * ease;
        window.scrollTo(0, current);
        if (Math.abs(current - target) > 0.5) {
          rafId = requestAnimationFrame(smoothStep);
        } else {
          window.scrollTo(0, target);
          if (rafId) cancelAnimationFrame(rafId);
          rafId = null;
        }
      }

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('resize', () => (target = clamp(target)));
    } catch (err) {
      // if anything goes wrong, fail silently and keep native scrolling
      // console.warn('Smooth wheel init failed', err);
    }
  }

  initSmoothWheel(true);

  createRoot(document.getElementById("root")!).render(<App />);
  