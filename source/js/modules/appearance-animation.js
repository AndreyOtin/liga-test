import {gsap} from '../vendor/gsap';
import {ScrollTrigger} from '../vendor/scroll-trigger';
gsap.registerPlugin(ScrollTrigger);

const vars = {
  'fade': [[{opacity: 0}, {opacity: 1, duration: 2}]],
  'fade-in': [[{opacity: 0}, {opacity: 1, duration: 2}, 0], [{y: '110%'}, {y: 0, duration: 1}, 0]],
  'scale': [[{opacity: 0}, {opacity: 1, duration: 2}, 0], [{scale: 0}, {scale: 1, duration: 1}, 0]],
};

const onEnter = (batch, self) => {
  batch.forEach((element, i) => {
    const timeline = gsap.timeline();
    const instance = self[i];
    const gsapVars = vars[element.dataset.animation || 'fade'];

    gsapVars.forEach((options)=> timeline.fromTo(element.firstElementChild, ...options));
    timeline.then(() => instance.kill());
  });
};


export const initApearanceAnimation = () => {
  gsap.set('.apperance__item span', {opacity: 0});
  ScrollTrigger.batch('.apperance__item', {
    onEnter,
    start: '10% 80%',
  });

};
