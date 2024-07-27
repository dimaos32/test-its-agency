import scrollLock from '../vendor/scroll-lock.min';
import { FocusLock } from '../utils/focus-lock';

const breakpoint = window.matchMedia('(min-width: 1024px)');

const nav = document.querySelector('.main-nav');

const initMenu = () => {
  if (!nav) {
    return;
  }

  const focusLock = new FocusLock();

  const overlay = nav.querySelector('.main-nav__overlay');
  const wrapper = nav.querySelector('.main-nav__wrapper');
  const openBtn = nav.querySelector('.main-nav__open-menu-btn');
  const closeBtn = nav.querySelector('.main-nav__close-menu-btn');


  const onOverlayClick = () => {
    closeMenu();
  };

  const onEscPress = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      closeMenu();
    }
  };

  const openMenu = () => {
    nav.classList.add('is-opened');

    focusLock.lock('.main-nav', false);
    scrollLock.disablePageScroll(wrapper);

    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onEscPress);
  };

  const closeMenu = () => {
    nav.classList.remove('is-opened');

    focusLock.unlock(false);
    scrollLock.enablePageScroll(wrapper);

    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onEscPress);
  };

  const onNavClick = ({ target }) => {
    if (target.closest('a.main-nav__link')) {
      closeMenu();
    }
  };

  const breakpointChecker = () => {
    if (breakpoint.matches) {
      if (nav.classList.contains('is-opened')) {
        closeMenu();
      }
    } else {
      overlay.style.transition = 'none';
      wrapper.style.transition = 'none';

      setTimeout(() => {
        overlay.style.transition = null;
        wrapper.style.transition = null;
      }, 10);
    }
  };

  breakpointChecker();
  breakpoint.addListener(breakpointChecker);

  nav.addEventListener('click', onNavClick);
  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
};

export { initMenu };
