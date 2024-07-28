import scrollLock from '../vendor/scroll-lock.min';
import { FocusLock } from '../utils/focus-lock';

const breakpoint = window.matchMedia('(min-width: 768px)');

const filters = document.querySelector('.catalog__filters');
const openBtn = document.querySelector('.catalog__filters-open-btn');

const initFilterMenu = () => {
  if (!filters || !openBtn) {
    return;
  }

  const focusLock = new FocusLock();

  const overlay = filters.querySelector('.catalog__filters-overlay');
  const wrapper = filters.querySelector('.catalog__filters-wrapper');

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
    filters.classList.add('is-opened');

    focusLock.lock('.main-nav', false);
    scrollLock.disablePageScroll(wrapper);

    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onEscPress);
  };

  const closeMenu = () => {
    filters.classList.remove('is-opened');

    focusLock.unlock(false);
    scrollLock.enablePageScroll(wrapper);

    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onEscPress);
  };

  const breakpointChecker = () => {
    if (breakpoint.matches) {
      if (filters.classList.contains('is-opened')) {
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

  openBtn.addEventListener('click', openMenu);
};

export { initFilterMenu };
