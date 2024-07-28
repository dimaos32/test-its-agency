import { updateProductList } from './products';

const SHIFT_Y = -16; // px

const breakpoint = window.matchMedia('(min-width: 1024px)');

const sortFilterBtn = document.querySelector('.catalog__sort-filter');
const sortFilterModalContent = document.querySelector('.modal--sort-filter .modal__content');

const initSortFilter = () => {
  if (!sortFilterBtn || !sortFilterModalContent) {
    return;
  }

  const sortFilterList = sortFilterModalContent.querySelector('.sort-filter__list');

  if (!sortFilterList) {
    return;
  }

  const onFilterChange = ({ target }) => {
    const currentFilterInput = target.closest('.sort-filter__input');

    if (!currentFilterInput) {
      return;
    }

    updateProductList();

    const currentFilter = currentFilterInput.closest('.sort-filter__radio');
    const currentFilterLabel = currentFilter.querySelector('.sort-filter__label');

    sortFilterBtn.textContent = currentFilterLabel.textContent;
  };

  sortFilterList.addEventListener('change', onFilterChange);
};

const setSortFilterListPosition = () => {
  if (!sortFilterBtn || !sortFilterModalContent) {
    return;
  }

  const sortFilterList = sortFilterModalContent.querySelector('.sort-filter__list');

  if (!sortFilterList) {
    return;
  }

  sortFilterModalContent.style.right = null;
  sortFilterModalContent.style.top = null;
  sortFilterModalContent.style.bottom = null;

  if (breakpoint.matches) {
    const coords = sortFilterBtn.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;

    const rightCSSProperty = viewportWidth - coords.right >= 0
      ? viewportWidth - coords.right
      : 0;

    const topCSSProperty = coords.top + SHIFT_Y >= 0 ? coords.top + SHIFT_Y : 0;

    sortFilterModalContent.style.right = `${rightCSSProperty}px`;

    if (topCSSProperty + sortFilterList.clientHeight < viewportHeight) {
      sortFilterModalContent.style.top = `${topCSSProperty}px`;
      sortFilterModalContent.style.bottom = null;
    } else {
      sortFilterModalContent.style.top = null;
      sortFilterModalContent.style.bottom = 0;
    }
  }
};

export { initSortFilter, setSortFilterListPosition };
