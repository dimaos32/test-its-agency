const BASE_URL = 'https://66a60b1423b29e17a1a194e8.mockapi.io/api/';

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

const createProductCardEl = ({ id, name, photo, price }) => {
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
    <button class="btn product-card__btn" aria-label="добавить в корзину"></button>
  `;

  return productCard;
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
  const productList = document.querySelector('.catalog__product-list');

  if (!productList) {
    return;
  }

  productList.innerHTML = '';
  data.forEach((product) => productList.append(createProductCardEl(product)));
};

const updateProductList = () => {
  const filteredProducts = filterAndSortProducts(products);
  renderProducts(filteredProducts);
};

const fetchProducts = () => {
  fetch(`${BASE_URL}products`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    console.log(res.error);
    return [];
  }).then((data) => {
    products = data;
    const filteredProducts = filterAndSortProducts(products);
    renderProducts(filteredProducts);
  }).catch((error) => {
    console.log(error);
  });
};

export { updateProductList, fetchProducts };
