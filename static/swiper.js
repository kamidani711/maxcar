var swiper = new Swiper(".carImagesSliderThumbs", {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 8,
    freeMode: true,
    watchSlidesProgress: true,
  });
  var swiper2 = new Swiper(".carImagesSlider", {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: swiper,
    },
    
  });