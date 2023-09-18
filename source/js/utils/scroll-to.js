import {ScrollToPlugin} from '../vendor/scroll-to-min.js';
import {gsap} from '../vendor/gsap.js';
gsap.registerPlugin(ScrollToPlugin);

const setOffset = (offset) => {
  const isNaN = Number.isNaN(+offset);

  if (isNaN) {
    const element = document.querySelector(offset);

    if (!element) {
      return 0;
    }

    return element.getBoundingClientRect().height;
  }

  return offset;
};

const scrollToHandler = (e) => {
  e.preventDefault();
  const btn = e.target.closest('[data-move-to]'); // ищем нашу кнопку через ивент
  const target = document.querySelector(btn.dataset.moveTo); // ищем цель якоря

  if (!target || !btn) {
    return;
  }

  const duration = Math.abs(btn.getBoundingClientRect().top - target.getBoundingClientRect().top) / (window.innerHeight * 1.5);
  const offsetY = btn.dataset.offset ? setOffset(btn.dataset.offset) : 0;


  gsap.to(window, {
    duration,
    scrollTo: {
      y: target,
      offsetY,
    },
    ease: 'power4.out',
  });
};

export const initScrollTo = () => {
  const scrollToButtons = document.querySelectorAll('[data-move-to]');

  scrollToButtons.forEach((btn) => {
    btn.addEventListener('click', scrollToHandler);
  });
};
