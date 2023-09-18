import {default as split} from '../vendor/splitting';
import {gsap} from '../vendor/gsap';
import {ScrollTrigger} from '../vendor/scroll-trigger';
gsap.registerPlugin(ScrollTrigger);


const animateWordsByLine = (splittedByLinesElements) =>{
  splittedByLinesElements.words
      .forEach((word) => {
        const span = document.createElement('span');
        span.innerHTML = word.dataset.word;
        word.append(span);

        const line = word.style.getPropertyValue('--line-index');
        const delay = 0.25 * line;


        gsap.fromTo(span,
            {y: '-100%', opacity: 0},
            {y: '0%', opacity: 1, duration: 1, delay}
        );
      });
};

const animateWords = ()=> {
  const [textSplitting] = split({
    by: 'lines',
    target: '.intro__text',
  });
  const [titleSplitting] = split({
    by: 'lines',
    target: '.intro__title',
  });

  animateWordsByLine(textSplitting);
  animateWordsByLine(titleSplitting);
};

const animateList = () => {
  gsap.fromTo('.intro__item', {opacity: 0, scale: 0}, {opacity: 1, scale: 1, duration: 0.3, stagger: 0.05});
};

const animateScroll = () => {
  const section = document.querySelector('.intro');
  const content = section.querySelector('.container');

  const timeline = gsap.to(content, {
    scale: 0.75,
    y: '-10vh',
    rotateX: 10, // создаем таймлайн. сдвигаем контент на его ширину
  });

  ScrollTrigger.create({ // привязываем анимацию к скролл тригеру
    trigger: section,
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    animation: timeline,
  });

};


export const initIntroAnimation = () =>{
  animateWords();
  animateList();
  animateScroll();
};
