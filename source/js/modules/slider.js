import {gsap} from '../vendor/gsap';
import {ScrollTrigger} from '../vendor/scroll-trigger';
gsap.registerPlugin(ScrollTrigger);

const calcHeight = (elements) => {
  let totalHeight = 0;
  let height = 0;

  elements.forEach((el) => {
    height = el.offsetHeight;
    totalHeight += el.offsetHeight;
  });

  return {totalHeight, height};
};

export const initSlider = () =>{
  const section = document.querySelector('.slider');
  const slides = section.querySelectorAll('.slider__slide');
  const {totalHeight, height} = calcHeight(slides);
  let scroll = 0;
  let activeSlide = 0;

  gsap.set(section, {height: totalHeight + height});

  ScrollTrigger.create({
    trigger: section,
    scrub: true,
    start: 'top bottom',
    onEnter(self) {
      if (scroll) {
        return;
      }

      scroll = self.scroll();

    },
    onUpdate(self) {
      const result = Math.floor((self.scroll() - scroll - height) / height);
      const slide = Math.min(slides.length - 1, Math.max(0, result));

      if (slide !== activeSlide) {
        slides[activeSlide].classList.remove('is-active');
        slides[slide].classList.add('is-active');
        activeSlide = slide;
      }
    },
  });


};
