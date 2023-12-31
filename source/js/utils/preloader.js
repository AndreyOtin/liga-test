import {ScrollLock} from './scroll-lock';
import {gsap} from '../vendor/gsap.js';

const PreloaderSelector = {
  Container: '[data-preloader]',
  Box: '[data-box]',

};

export class Preloader {
  constructor() {
    this._container = document.body.querySelector(PreloaderSelector.Container);
    this._box = document.body.querySelector(PreloaderSelector.Box);
    this._scrollLock = window.scrollLock || new ScrollLock();
    this._pageLoaded = false;

    this.event = new Event('loaderOff');

    this.off = this._off.bind(this);
    this._removeAnimation = this._removeAnimation.bind(this);
  }

  _setAnimation() {
    this._timeLine = gsap.timeline({
      repeat: -1,
      onRepeat: this._removeAnimation,
    });

    this._timeLine.addLabel('start');
    this._timeLine
        .to(
            PreloaderSelector.Box,
            {
              scale: 1.5,
              duration: 0.5,
              ease: 'power1.inOut',
            },
            'start'
        )
        .addLabel('scaled')
        .to(
            PreloaderSelector.Box,
            {
              scale: 1,
              duration: 0.5,
              ease: 'power1.inOut',
            },
            'scaled'
        )
        .to(
            PreloaderSelector.Box,
            {
              rotate: 360,
              duration: 2,
              ease: 'power1.inOut',
            },
            'start'
        );

  }

  _removeAnimation() {
    if (!this._pageLoaded) {
      return;
    }

    this._timeLine.pause();

    this._scrollLock.enableScrolling();
    window.scroll({top: 0});

    gsap
        .to(PreloaderSelector.Container, {
          y: '-100%',
          duration: 0.3,
        })
        .then(() => this._off());

  }

  _on() {
    this._scrollLock.disableScrolling();
    this._container.classList.remove('is-hidden');

    if (this._container) {
      this._setAnimation();
      window.addEventListener('load', () => {
        this._pageLoaded = true;
      });

      return;
    }

    window.addEventListener('load', this.off);
  }

  _off() {
    window.dispatchEvent(this.event);
    this._pageLoaded = true;
    this._container.classList.add('is-hidden');
  }

  init() {
    this._on();
  }
}
