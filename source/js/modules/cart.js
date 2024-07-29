import scrollLock from '../vendor/scroll-lock.min';
import { FocusLock } from '../utils/focus-lock';
import {
  addProductToCardById,
  decrementQtyInCardById,
  incrementQtyInCardById,
  changeQtyInCardById,
  clearCart
} from './data';

const cart = document.querySelector('.cart');

const onAddToCartBtnClick = ({ target }) => {
  const btn = target.closest('.product-card__add-to-cart-btn');

  if (!btn) {
    return;
  }

  const card = btn.closest('.product-card');

  if (!card) {
    return;
  }

  const productId = card.dataset.id;
  addProductToCardById(productId);
};

const initCart = () => {
  if (!cart) {
    return;
  }

  const focusLock = new FocusLock();

  const overlay = cart.querySelector('.cart__overlay');
  const wrapper = cart.querySelector('.cart__wrapper');
  const openBtn = cart.querySelector('.cart__open-btn');
  const closeBtn = cart.querySelector('.cart__close-btn');
  const clearCartBtn = cart.querySelector('.cart__clear-btn');
  const cartList = cart.querySelector('.cart__list');

  const productList = document.querySelector('.catalog__product-list');

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
    cart.classList.add('is-opened');

    focusLock.lock('.cart', false);
    scrollLock.disablePageScroll(wrapper);

    overlay.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onEscPress);
  };

  const closeMenu = () => {
    cart.classList.remove('is-opened');

    focusLock.unlock(false);
    scrollLock.enablePageScroll(wrapper);

    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onEscPress);
  };

  const onCartQtyDecrement = ({ target }) => {
    const decrementBtn = target.closest('.cart-card__decrement-btn');

    if (!decrementBtn) {
      return;
    }

    const card = decrementBtn.closest('.cart-card');

    decrementQtyInCardById(card.dataset.id);
  };

  const onCartQtyIncrement = ({ target }) => {
    const incrementBtn = target.closest('.cart-card__increment-btn');

    if (!incrementBtn) {
      return;
    }

    const card = incrementBtn.closest('.cart-card');

    incrementQtyInCardById(card.dataset.id);
  };

  const onCartQtyChange = ({ target }) => {
    const input = target.closest('.cart-card__qty');

    if (!input) {
      return;
    }

    let newQty = input.value === '' || Number(input.value) < 0
      ? 0
      : Number(input.value);

    const card = input.closest('.cart-card');

    changeQtyInCardById(card.dataset.id, newQty);
  };

  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  clearCartBtn.addEventListener('click', clearCart);
  cartList.addEventListener('click', onCartQtyDecrement);
  cartList.addEventListener('click', onCartQtyIncrement);
  cartList.addEventListener('change', onCartQtyChange);

  productList.addEventListener('click', onAddToCartBtnClick);
};

export { initCart };
