const initHeroSlider = () => {
  const sliders = document.querySelectorAll('.hero__slides');

  if (!sliders.length) {
    return;
  }

  sliders.forEach((slider) => {
    const sliderInner = slider.querySelector('.hero__slides-inner');
    const prevBtn = slider.querySelector('.slider-btn--prev');
    const nextBtn = slider.querySelector('.slider-btn--next');
    const navigation = {
      prevEl: prevBtn,
      nextEl: nextBtn,
    };
    const paginationEl = slider.querySelector('.hero__slides-pagination');
    const pagination = {
      el: paginationEl,
      bulletClass: 'hero__slides-pagination-bullet',
      bulletActiveClass: 'is-active',
      clickable: true,
    };

    // eslint-disable-next-line no-undef, no-unused-vars
    const swiper = new Swiper(sliderInner, {
      slidesPerView: 1,
      effect: 'creative',
      creativeEffect: {
        prev: {
          shadow: true,
          translate: ['-20%', 0, -1],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      },
      grabCursor: true,
      mousewheel: {
        forceToAxis: true,
      },
      navigation,
      pagination,
    });
  });
};

export { initHeroSlider };
