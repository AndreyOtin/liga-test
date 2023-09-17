import {ScrollLock} from './scroll-lock';
import {FocusLock} from './focus-lock';
import {gsap} from '../vendor/gsap.js';

export class Burger {
  constructor() {
    this._header = document.querySelector('[data-header]');
    this._burger = document.querySelector('[data-burger]');
    this._elementsToAnimate = this._header.querySelectorAll('.main-nav__link');
    this._scrollLock = new ScrollLock();
    this._focusLock = new FocusLock();
    this._isMenuOpen = false;

    this._onBurgerClick = this._onBurgerClick.bind(this);
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
  }

  init() {
    if (!this._burger) {
      return;
    }

    document.documentElement.style.setProperty('--header-height', this._header.getBoundingClientRect().height + 'px');
    this._burger.addEventListener('click', this._onBurgerClick);
  }

  _openMenu() {
    this._isMenuOpen = true;
    this._header.classList.add('is-open');
    this._scrollLock.disableScrolling();
    document.addEventListener('keydown', this._onDocumentKeydown);
    document.addEventListener('click', this._onDocumentClick);
    this._focusLock.lock('[data-header]');
    if (window.ls) {
      window.ls.stop();
    }


    const stagger = 0.1;
    const duration = this._elementsToAnimate.length * stagger;

    gsap.timeline()
        .to('.main-nav', {y: 0, duration: 0.5})
        .fromTo(this._elementsToAnimate, {y: '-110%'}, {y: 0, stagger, duration});
  }

  _closeMenu() {
    const time = Date.now();
    gsap.timeline()
        .to(this._elementsToAnimate, {y: '-110%', duration: 0.3})
        .to('.main-nav', {y: '-100%', duration: 0.3, ease: 'none',
          onUpdate: () => {
            const current = Date.now() - time > 550;
            if (current) {
              this._header.classList.remove('is-open');
            }

          }})
        .then(() => {
          this._isMenuOpen = false;
          this._scrollLock.enableScrolling();
          this._focusLock.unlock('[data-header]');
          document.removeEventListener('keydown', this._onDocumentKeydown);
          document.removeEventListener('click', this._onDocumentClick);
          if (window.ls) {
            window.ls.start();
          }
        });
  }

  _onBurgerClick() {
    if (this._isMenuOpen) {
      this._closeMenu();
    } else {
      this._openMenu();
    }
  }

  _onDocumentKeydown(evt) {
    if (evt.key === 'Escape') {
      this._closeMenu();
    }
  }

  _onDocumentClick(evt) {
    if (evt.target.hasAttribute('data-close-menu')) {
      this._closeMenu();
    }
  }
}
