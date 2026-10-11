import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const hasFinePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Reveal everything that was hidden for the intro animation (also used as a fail-safe). */
export function revealAll() {
  document.documentElement.classList.remove('js-anim');
}

/** Elements with [data-magnetic] gently follow the cursor while hovered. */
export function initMagnetic(root: ParentNode = document) {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.3;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      xTo((e.clientX - rect.left - rect.width / 2) * strength);
      yTo((e.clientY - rect.top - rect.height / 2) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

export { gsap, ScrollTrigger, SplitText };
