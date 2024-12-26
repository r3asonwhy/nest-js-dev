//*===================
//*  CART            =
//*===================
//*  FUNCTIONS CALC  =
//*===================
//*  CHECKOUT STEPS  =
//*===================
//*  Toggle block    =
//*===================


jQuery(function ($) {
  ("use strict");

  //*=========
  //*  CART  =
  //*=========
  //* open - close cart top
  $(document).on("click", ".js_open_cart", function () {
    if (!document.querySelectorAll(".disable-cart-popup").length) {
      $("html").addClass("cart-opened");
      _functions.removeScroll();
    }
  });

  $(document).on("click", ".js_close_cart", function () {
    $("html").removeClass("cart-opened");
    _functions.addScroll();
  });




  //*===================
  //*  FUNCTIONS CALC  =
  //*===================
  function pluralizeNoun(n, mainPart, endingForOne, endingForTwo, endingForFive) {
    n = Math.abs(n % 100);
    const n1 = Math.floor(n / 10);
    const n2 = n % 10;

    if (!(mainPart || endingForOne || "").match(/[a-z]/i)) {
      endingForOne = endingForOne || "";
      endingForTwo = endingForTwo || "";
      endingForFive = endingForFive || "";

    } else {
      endingForOne = endingForOne != null ? endingForOne : "";
      endingForTwo = endingForTwo != null ? endingForTwo : "s";
    }

    endingForFive = endingForFive != null ? endingForFive : endingForTwo;

    if (n1 !== 1) {
      if (n2 === 1) {
        return mainPart + endingForOne;
      }

      if (n2 >= 2 && n2 <= 4) {
        return mainPart + endingForTwo;
      }
    }

    return mainPart + endingForFive;
  }

  _functions.numberWithSpaces = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  };

  _functions.addThousandsSeparator = function (number, separator = " ") {
    let numberString = number.toString();
    numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return numberString;
  };

  // calc total sum in cart
  _functions.calculateCartTotalPrice = function () {
    $(".js-cart").each(function () {
      let total = 0;
      let count = 0;
      let totalOld = 0;

      $(this).find(".js-cart-product").each(function () {
        const qty = +$(this).find(".thumb-input-number input").val();

        count += qty;

        const productTotal = +$(this).data("price") * qty;

        total += productTotal;

        const productTotalOld = (+$(this).data("price-old") || 0) * qty;

        totalOld += productTotalOld;

        $(this).find(".js-cart-product-price").text(_functions.addThousandsSeparator(productTotal));
        $(this).find(".js-cart-product-price-old").text(_functions.addThousandsSeparator(productTotalOld));
      });

      $(".js-cart-total-old").text(_functions.addThousandsSeparator(totalOld));
      $(".js-cart-total").text(_functions.addThousandsSeparator(total));
      $(".js-cart-count").text(count);

      $noun = $(".js-cart-noun");
      $noun.text(
        pluralizeNoun(
          count,
          $noun.attr("data-val"),
          $noun.attr("data-end-1"),
          $noun.attr("data-end-2"),
          $noun.attr("data-end-5")
        )
      );

      if (total === 0) {
        $(".js-cart-count, .js-cart").addClass("empty");
        $(".js-cart-submit").attr("disabled", true);

      } else {
        $(".js-cart-count, .js-cart").removeClass("empty");
        $(".js-cart-submit").removeAttr("disabled");
      }
    });
  };

  _functions.calculateCartTotalPrice();


  $(document).on("click", ".js-cart-product .thumb-input-number button", function () {
    _functions.calculateCartTotalPrice();
  });


  $(document).on("click", ".js-product .thumb-input-number button", function () {
    const pr = $(this).closest(".js-product")
    const qty = +pr.find(".thumb-input-number input").val();
    const productTotal = +pr.data("price") * qty;
    const productTotalOld = (+pr.data("price-old") || 0) * qty;

    pr.find(".js-product-price").text(_functions.addThousandsSeparator(productTotal));
    pr.find(".js-product-price-old").text(_functions.addThousandsSeparator(productTotalOld));
  });


  //remove product from card
  $(document).on("click", ".js-remove-product", function () {
    $(this).closest(".js-cart-product").slideUp(300, function () {
      $(this).remove();

      if ($(".js-cart-product").length == 0) {
        $(".cart-products").html("");
      }

      _functions.calculateCartTotalPrice();
    });
  });




  //*===================
  //*  CHECKOUT STEPS  =
  //*===================
  function checkIsActive() {
    let active = $('.step-item.is-active');

    if (active.length) {
      active.find('.step-from').slideDown();
    }

  }
  checkIsActive()


  //visible next step
  $(document).on('click', '.steps-from .js-next-step', function () {
    const item = $(this).closest('.step-item');
    const itemBlock = item.find('.step-from');

    item.removeClass('is-active').addClass('done');
    itemBlock.slideUp();

    item.next().addClass('is-active');

    checkIsActive()
  });

  //edit step
  $(document).on('click', '.steps-from .js-edit-info', function () {
    const item = $(this).closest('.step-item');

    item.removeClass('done').addClass('is-active');

    item.nextAll().removeClass('is-active').find('.step-from').slideUp();
    item.nextAll().removeClass('done')

    checkIsActive()
  });




  //*================
  //* Toggle block  =
  //*================
  $(document).on('change', '.tgl-control', function () {
    const blockNum = $(this).attr('data-block'),
      rel = $(this).attr('data-rel'),
      showBlock = $(`.tgl-block[data-block="${blockNum}"][data-rel="${rel}"]`),
      hideBlock = $(`.tgl-block[data-block="${blockNum}"]:visible`);

    if ($(this).is('input[type="checkbox"]')) {
      showBlock.slideToggle();
      return;
    }

    if (hideBlock.length) {
      hideBlock.slideUp(500, function () {
        showBlock.slideDown();
      });
    } else {
      showBlock.slideDown();
    }
  });


});