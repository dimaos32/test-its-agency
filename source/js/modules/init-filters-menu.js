import scrollLock from '../vendor/scroll-lock.min';
import { FocusLock } from '../utils/focus-lock';
import { updateProductList } from './products';

const breakpoint = window.matchMedia('(min-width: 768px)');

const filters = document.querySelector('.catalog__filters');
const openBtn = document.querySelector('.catalog__filters-open-btn');
const filtersEl = filters.querySelector('.catalog__filters-wrapper');

const initFilterMenu = () => {
  if (!filters || !openBtn) {
    return;
  }

  const focusLock = new FocusLock();

  const overlay = filters.querySelector('.catalog__filters-overlay');
  const wrapper = filters.querySelector('.catalog__filters-wrapper');

  const onOverlayClick = () => {
    closeFiltersMenu();
  };

  const onEscPress = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();

      closeFiltersMenu();
    }
  };

  const openFiltersMenu = () => {
    filters.classList.add('is-opened');

    focusLock.lock('.main-nav', false);
    scrollLock.disablePageScroll(wrapper);

    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onEscPress);
  };

  const closeFiltersMenu = () => {
    filters.classList.remove('is-opened');

    focusLock.unlock(false);
    scrollLock.enablePageScroll(wrapper);

    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onEscPress);
  };

  const breakpointChecker = () => {
    if (breakpoint.matches) {
      if (filters.classList.contains('is-opened')) {
        closeFiltersMenu();
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

  const onFiltersChange = ({ target }) => {
    const currentFilterInput = target.closest('.filter-checkbox__input');

    if (!currentFilterInput) {
      return;
    }

    updateProductList();
  };

  breakpointChecker();
  breakpoint.addListener(breakpointChecker);

  openBtn.addEventListener('click', openFiltersMenu);
  filtersEl.addEventListener('change', onFiltersChange);
};

export { initFilterMenu };
