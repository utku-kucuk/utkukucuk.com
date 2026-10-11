/**
 * Site-wide motion: smooth scrolling, scroll-triggered reveals, counters,
 * the experience timeline, scroll progress and the custom cursor.
 * Everything is skipped when the user prefers reduced motion.
 */
import Lenis from 'lenis';

import {
  gsap,
  hasFinePointer,
  initMagnetic,
  prefersReducedMotion,
  ScrollTrigger,
  SplitText,
} from './motion';

function initSmoothScroll() {
  const lenis = new Lenis({ duration: 1.15, anchors: { offset: -72 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

function initReveals() {
  gsap.set('[data-reveal]', { opacity: 0, y: 32 });
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        overwrite: true,
      }),
  });

  document.querySelectorAll<HTMLElement>('[data-reveal-lines]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 105,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }),
    });
  });
}

function initCounters() {
  const lang = document.documentElement.lang || 'en';
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const format = new Intl.NumberFormat(lang, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format;
    const state = { value: 0 };
    el.textContent = format(0);
    gsap.to(state, {
      value: target,
      duration: 1.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = format(state.value);
      },
    });
  });
}

function initTimeline() {
  document.querySelectorAll<HTMLElement>('[data-timeline]').forEach((list) => {
    const fill = list.querySelector('[data-timeline-fill]');
    if (!fill) return;
    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 60%', scrub: true },
      },
    );
  });
}

function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>('[data-scroll-progress]');
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  });
}

function initCursor() {
  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  if (!cursor || !hasFinePointer()) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
  let shown = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        cursor.dataset.visible = '';
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => {
    shown = false;
    delete cursor.dataset.visible;
  });
  document.addEventListener('pointerover', (e) => {
    const interactive = (e.target as Element | null)?.closest('a, button, [data-cursor-hover]');
    cursor.toggleAttribute('data-hover', !!interactive);
  });
}

if (!prefersReducedMotion()) {
  initSmoothScroll();
  initReveals();
  initCounters();
  initTimeline();
  initScrollProgress();
  initCursor();
  initMagnetic();
}
