//*====================================
//*  Product                          =
//*====================================
//*  Thumb input                      =
//*====================================
//*  Comparison table                 =
//*====================================
//*  Custom AJAX                      =
//*====================================

jQuery(function ($) {
  ("use strict");

  //*============
  //*  Product  =
  //*============
  $(document).on("click", ".js-add-to-cart", async function () {
    $(this).addClass("btn-loading");

    await sleep(2000);
    $(this).removeClass("btn-loading").addClass("btn-success");
    $(".cart-informer").addClass("active");

    await sleep(3000);
    $(this).removeClass("btn-success");
    $(".cart-informer").removeClass("active");
  });

  $(document).on("click", ".product-state-btn", function () {
    $(this).toggleClass("active");
  });

  $(document).on("change", ".fl-grid-toggle-btn input", function () {
    let pr = $(this).closest('.fl-section').find(".fl-products");

    if ($(this).val() == 'grid-2') {
      pr.addClass('products-horizontal');
    } else {
      pr.removeClass('products-horizontal');
    }
  });

  $(document).on("click", ".product-card__video, .open-video", function (e) {
    e.preventDefault();
    const video = $(this).attr("href");

    _functions.openPopup("video", function () {
      $(this).find("iframe").attr("src", video);
    })
  });


  $(document).on("click", ".video-popup .btn-close, .video-popup .layer-close", function (e) {
    e.preventDefault();
    $(".video-popup").find("iframe").attr("src", "about:blank");
  });




  //*================
  //*  Thumb input  =
  //*================
  $(document).on("click", ".js-decrement", function () {
    let $this = $(this),
      $input = $this.parent().find("input"),
      hasMin = $input[0].hasAttribute("data-min"),
      value = parseInt($input.val(), 10),
      min = hasMin ? +$input.attr("data-min") : 1;

    if (value != min) {
      value = value - 1;
    } else {
      value = min;
    }

    $input.val(value);
  });

  $(document).on("click", ".js-increment", function () {
    let $this = $(this),
      $input = $this.parent().find("input"),
      value = parseInt($input.val(), 10);
    $input.val(value + 1);
  });




  //*================
  //*  Custom AJAX  =
  //*================
  $(document).on("click", ".js-load-category", async function () {
    const $block = $(this).closest(".section").find(".js-load-category-wrap");

    // ajax example 
    // add class when start ajax 
    $block.addClass("block-loading");


    // start ajax
    // Your code is here


    // remove class when end ajax 
    setTimeout(() => {
      $block.removeClass("block-loading");
    }, 1500);
  });


  $(document).on("click", ".js-load-more-products", async function () {
    const $block = $(this).closest(".section").find(".js-load-category-wrap");

    // ajax example 
    // add class when start ajax 
    $block.addClass("block-loading");
    $(this).addClass("btn-loading");


    // start ajax
    // Your code is here


    // remove class when end ajax 
    setTimeout(() => {
      $block.removeClass("block-loading");
      $(this).removeClass("btn-loading");
    }, 1500);
  });


});