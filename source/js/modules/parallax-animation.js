import {gsap} from '../vendor/gsap';
import {ScrollTrigger} from '../vendor/scroll-trigger';
gsap.registerPlugin(ScrollTrigger);

const vars = {
  'transform-y': [[{opacity: 0}, {opacity: 1, duration: 0}, 0], [{y: '110%'}, {y: 0}, 0]],
  'fade-scale': [[{opacity: 0}, {opacity: 1}, 0], [{scale: 0}, {scale: 1}, 0]],
};

const addScrollTriggerAnimation = (element) => {
  const timeline = gsap.timeline({pause: true});
  const gsapVars = vars[element.dataset.animation] || vars['fade-scale'];

  gsapVars.forEach((options)=> timeline.fromTo(element.firstElementChild, ...options));


  ScrollTrigger.create({
    animation: timeline,
    scrub: 1,
    trigger: element,
    start: 'bottom bottom',
    end: '+=500',
  });
};


export const initParallaxAnimation = () =>
  document.querySelectorAll('.parallax__item')
      .forEach((el)=>addScrollTriggerAnimation(el));
