import { getWordForm } from './utils';

const BASE_URL = 'https://66a60b1423b29e17a1a194e8.mockapi.io/api/';
const DEFAULT_CURRENT_USER_ID = 1;

const FILTER_CB = {
  'is-new': (item) => item.isNew,
  'is-in-stock': (item) => item.qtyInStock > 0,
  'is-contract': (item) => item.isContract,
  'isExclusive': (item) => item.isExclusive,
  'isOnSale': (item) => item.isOnSale,
};

const SORT_CB = {
  'first-expensive': (prev, next) => next.price - prev.price,
  'first-inexpensive': (prev, next) => prev.price - next.price,
  'first-popular': (prev, next) => next.isViewed - prev.isViewed,
  'first-new': (prev, next) => next.createdAt - prev.createdAt,
};

let products = [];
let currentUser = DEFAULT_CURRENT_USER_ID; // Временно у нас 1 пользователь
let cart = [];

const createProductCardEl = ({ id, name, photo, price, qtyInStock }) => {
  const productCard = document.createElement('article');

  productCard.classList.add('product-card');
  productCard.dataset.id = id;

  productCard.innerHTML = `
    <a class="product-card__link">
      <div class="product-card__cover">
        <img class="product-card__cover-img" src="img/content/${photo}.jpg" alt="${name}">
      </div>
      <h3 class="product-card__title">${name}</h3>
      <p class="product-card__price">${price} ₽</p>
    </a>
    <button class="btn product-card__add-to-cart-btn" aria-label="добавить в корзину" ${qtyInStock === 0 ? 'disabled' : ''}></button>
  `;

  return productCard;
};

const createCartCardEl = ({ id, name, photo, price, qtyInStock, qty }) => {
  const cartCard = document.createElement('article');
  cartCard.classList.add('cart-card');
  cartCard.dataset.id = id;

  cartCard.innerHTML = `
    <a class="cart-card__link">
      <div class="cart-card__cover">
        <img class="cart-card__cover-img" src="img/content/${photo}.jpg" alt="${name}">
      </div>
      <div class="cart-card__text-inner">
        <h3 class="cart-card__title">${name}</h3>
        <p class="cart-card__price">${price} ₽</p>
      </div>
    </a>
    <div class="cart-card__controls">
      <button class="btn cart-card__btn cart-card__decrement-btn" aria-label="Уменьшить" ${qty === 0 ? 'disabled' : ''}></button>
      <input class="cart-card__qty" type="number" value="${qty}">
      <button class="btn cart-card__btn cart-card__increment-btn" aria-label="Увеличить" ${qty >= qtyInStock ? 'disabled' : ''}></button>
      <button class="btn btn--icon remove-btn cart-card__remove-btn" type="button" aria-label="Удалить"></button>
    </div>
  `;

  return cartCard;
};

const filterAndSortProducts = (data) => {
  const filtersEl = document.querySelector('.catalog__filters-wrapper');
  const sortTypeEls = document.querySelectorAll('.sort-filter__input');

  if (!filtersEl || !sortTypeEls) {
    return data;
  }

  const selectedFilterEls = document.querySelectorAll('.filter-checkbox__input');
  const selectedFilters = [...selectedFilterEls]
      .filter((el) => el.checked)
      .map((el) => el.value);
  const sortType = [...sortTypeEls].find((el) => el.checked).value;
  let filteredData = [...data];

  selectedFilters.forEach((filter) => {
    filteredData = filteredData.filter(FILTER_CB[filter]);
  });

  filteredData.sort(SORT_CB[sortType]);

  return filteredData;
};

const renderProducts = (data) => {
  const totalProducts = document.querySelector('.catalog__total-products');
  const productList = document.querySelector('.catalog__product-list');

  if (!productList) {
    return;
  }

  if (totalProducts) {
    totalProducts.textContent = getWordForm(data.length, 'товар');
  }

  productList.innerHTML = '';

  data.forEach((product) => {
    const listEl = document.createElement('li');
    listEl.classList.add('catalog__product-item');
    listEl.append(createProductCardEl(product));
    productList.append(listEl);
  });
};

const renderProductsInCart = () => {
  const cartList = document.querySelector('.cart__list');
  const cartListTitle = document.querySelector('.cart__list-title');
  const totalProducts = cartListTitle.querySelector('.cart__total-products');
  const cartFooter = document.querySelector('.cart__footer');
  const totalPrice = cartFooter.querySelector('.cart__total-price output');

  totalProducts.textContent = getWordForm(cart.length, 'товар');

  if (!cartList) {
    return;
  }

  cartList.innerHTML = '';

  if (cart.length) {
    cart.forEach((product) => {
      const listEl = document.createElement('li');
      listEl.classList.add('cart__list-item');
      listEl.append(createCartCardEl(product));
      cartList.append(listEl);
    });

    if (cartListTitle) {
      cartListTitle.classList.remove('is-hidden');
    }

    if (cartFooter) {
      cartFooter.classList.remove('is-hidden');
    }

    if (totalPrice) {
      totalPrice.textContent = cart.reduce((total, product) => {
        return total + product.price * product.qty;
      }, 0);
    }
  } else {
    const listEl = document.createElement('li');
    listEl.classList.add('cart__message');
    listEl.textContent = 'Вы ничего не добавили в корзину';
    cartList.append(listEl);

    if (cartListTitle) {
      cartListTitle.classList.add('is-hidden');
    }

    if (cartFooter) {
      cartFooter.classList.add('is-hidden');
    }

    if (totalPrice) {
      totalPrice.textContent = '0';
    }
  }
};

const updateProductList = () => {
  const filteredAndSortedProducts = filterAndSortProducts(products);
  renderProducts(filteredAndSortedProducts);
};

const fetchProducts = () => {
  fetch(`${BASE_URL}products`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // eslint-disable-next-line no-console
    console.log(res.error);
    return [];
  }).then((data) => {
    products = data;
    const filteredProducts = filterAndSortProducts(products);
    renderProducts(filteredProducts);
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
};

const addProductToCardById = (id) => {
  const index = cart.findIndex((product) => product.id === id);

  if (index === -1) {
    const product = products.find((item) => item.id === id);
    const AddedProduct = {
      id,
      qty: 1,
      name: product.name,
      photo: product.photo,
      price: product.price,
      qtyInStock: product.qtyInStock,
    };

    cart.push(AddedProduct);
  } else if (cart[index].qty < cart[index].qtyInStock) {
    cart[index].qty++;
  }

  updateCart();
};

const decrementQtyInCardById = (id) => {
  const index = cart.findIndex((product) => product.id === id);

  if (index !== -1) {
    cart[index].qty--;
  }

  updateCart();
};

const incrementQtyInCardById = (id) => {
  const index = cart.findIndex((product) => product.id === id);

  if (index !== -1) {
    cart[index].qty++;
  }

  updateCart();
};

const changeQtyInCardById = (id, newQty) => {
  const index = cart.findIndex((product) => product.id === id);

  if (index !== -1) {
    cart[index].qty = newQty > cart[index].qtyInStock
      ? cart[index].qtyInStock
      : newQty;
  }

  updateCart();
};

const updateCart = () => {
  fetch(`${BASE_URL}users/${currentUser}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ cart }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // eslint-disable-next-line no-console
    console.log(res.error);
    return [];
  }).then(() => {
    renderProductsInCart();
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
};

const clearCart = () => {
  cart = [];
  updateCart();
};

const fetchСart = () => {
  fetch(`${BASE_URL}users/${currentUser}`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    // eslint-disable-next-line no-console
    console.log(res.error);
    return [];
  }).then((data) => {
    cart = data.cart;
    renderProductsInCart();
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
};

export {
  updateProductList,
  fetchProducts,
  addProductToCardById,
  decrementQtyInCardById,
  incrementQtyInCardById,
  changeQtyInCardById,
  clearCart,
  fetchСart
};
