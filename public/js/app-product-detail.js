//*======================
//*  Product Thumbs     =
//*======================
//*  Video slide        =
//*======================
//*  Product Toggle     =
//*======================
//*  Copy Item          =
//*======================
//*  Fixed panel        =
//*======================
//*  Custom dropdown    =
//*======================

jQuery(function ($) {
  ("use strict");

  //*======================
  //*  Product Tabs       =
  //*======================
  const observerTabs = new IntersectionObserver(function (entries) {

    const isAnyIntersecting = entries.some(entry => {
      if (entry.isIntersecting) {
        $('.prd-panel').addClass('hide-prd-in-panel');
        return true;
      }
      return false;
    });

    if (!isAnyIntersecting) {
      $('.prd-panel').removeClass('hide-prd-in-panel');
    }

  }, {
    threshold: 0,
    rootMargin: `0px`
  });

  document.querySelectorAll('.product__sticky').forEach(el => {
    observerTabs.observe(el);
  });


  $(document).on("click", "._section-tab-item", function (e) {
    e.preventDefault();

    let id = $(this).attr('href').replace('#', '');
    let tab = $(`._section-tab[id="${id}"]`);

    $('._section-tab-item').removeClass("is-active");
    $(`.scroll-links ._section-tab-item[href="#${id}"]`).addClass("is-active");

    $('.prd-panel').removeClass("is-sticky show-product show-controls");

    window.scrollTo({
      top: 0,
      behavior: "instant",
    })

    $("._section-tab:visible").removeClass("is-active");
    tab.addClass("is-active");
  });




  //*======================
  //*  Video slide        =
  //*======================
  $(document).on("click", ".video-slide .play-btn", function (e) {
    e.preventDefault();
    const video = $(this).attr("href");

    if (window.innerWidth < 992) {
      _functions.openPopup("video", function () {
        $(this).find("iframe").attr("src", video);
      })
    } else {
      $(this).closest(".video-slide").find("iframe").attr("src", video);
      $(this).closest(".video-slide").addClass("active");
    }
  });


  $(document).on("click", ".video-popup .btn-close, .video-slide .btn-close, .video-popup .layer-close, .prd-detail-thumb", function (e) {
    $(".video-slide").removeClass("active");
    $(".video-slide").find("iframe").attr("src", "about:blank");
    $(".video-popup").find("iframe").attr("src", "about:blank");
    e.preventDefault();
  });




  //*======================
  //*  Product Toggle     =
  //*======================
  $(document).on("click", ".product-detail-toggle .product-detail-caption", function () {
    $(this).toggleClass('is-active');
    $(this).closest('.product-detail-toggle').find('.product-detail-toggle-content').slideToggle(300);
  });




  //*======================
  //*  Copy Item          =
  //*======================
  $(document).on('click', '.copy-item', function () {
    let th = $(this);
    let tempTextArea = $('<textarea></textarea>');
    th.addClass('is-copied');

    $('body').append(tempTextArea);

    tempTextArea.val(th.attr('data-copy-info')).select();
    document.execCommand('copy');

    tempTextArea.remove();

    setTimeout(function () {
      th.removeClass('is-copied');
    }, 1000);
  });




  //*======================
  //*  Fixed panel        =
  //*======================
  _functions.fixedProductPanel = function () {
    if ($('.prd-panel').length) {

      const trigger = $('.prd-panel-trigger');
      const panel = $('.prd-panel');
      const productTitle = $('.hero-product-detail-title');
      const productButtons = $('.product-detail-controls');

      const whenSticky = $(window).scrollTop() >= trigger.offset().top;
      const whenScrollAfterTitle = $(window).scrollTop() >= productTitle.offset().top + productTitle.height();
      const whenScrollAfterButtons = $(window).scrollTop() >= productButtons.offset().top + productButtons.height();


      if (winW > 991) {

        whenScrollAfterButtons ? panel.addClass('show-controls') : panel.removeClass('show-controls');

        whenScrollAfterTitle ? panel.addClass('show-product') : panel.removeClass('show-product');

        whenSticky ? panel.addClass('is-sticky') : panel.removeClass('is-sticky show-product show-controls')

      }
    }
  };


  $(window).on("scroll", function () {
    _functions.fixedProductPanel();
  });




  //*======================
  //*  Custom dropdown    =
  //*======================
  $(document).on("click", ".custom-title", function () {
    $(this).closest(".custom-drop").toggleClass('is-active');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.custom-drop').length) {
      $('.custom-drop').removeClass('is-active');
    }
  });


});