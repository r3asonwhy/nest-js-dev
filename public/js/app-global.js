//*====================================
//*  FUNCTIONS ON DOCUMENT READY      =
//*====================================
//*  FUNCTIONS CALC & RESIZE, SCROLL  =
//*====================================
//*  ANIMATION                        =
//*====================================
//*  HEADER                           =
//*====================================
//*  Mega menu                        =
//*====================================
//*  POPUPS                           =
//*====================================
//*  KEY FOCUS                        =
//*====================================
//*  TABS, ACCORDION                  =
//*====================================
//*  Comments                         =
//*====================================
//*  OTHER JS                         =
//*====================================

const _functions = {};
let winW, winH, winScr, isTouchScreen, isAndroid, isIPhone, is_Mac, is_Chrome;

// Ajax loading simulation function
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

jQuery(function ($) {
  ("use strict");

  //*================================
  //*  FUNCTIONS ON DOCUMENT READY  =
  //*================================
  (isTouchScreen = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)),
  (isAndroid = navigator.userAgent.match(/Android/i)),
  (isIPhone = navigator.userAgent.match(/iPhone/i)),
  (is_Mac = navigator.platform.toUpperCase().indexOf("MAC") >= 0),
  (is_Chrome = navigator.userAgent.indexOf("Chrome") >= 0 && navigator.userAgent.indexOf("Edge") < 0);

  if (isTouchScreen) $("html").addClass("touch-screen");
  if (isAndroid) $("html").addClass("android");
  if (isIPhone) $("html").addClass("ios");
  if (is_Mac) $("html").addClass("mac");
  if (is_Chrome) $("html").addClass("chrome");




  //*====================================
  //*  FUNCTIONS CALC & SCROLL, RESIZE  =
  //*====================================
  // Function Calculations on page
  _functions.pageCalculations = function () {
    winW = $(window).width();
    winH = $(window).height();
  };
  _functions.pageCalculations();


  /* Function on page scroll */
  $(window).on("scroll", function () {
    _functions.scrollCall();
  });


  let lastScrollTop = 0;
  _functions.scrollCall = function () {
    winScr = $(window).scrollTop();

    if (winScr > 0) {
      $("header").addClass("scrolled");
    } else {
      $("header").removeClass("scrolled");
    }


    // Scroll btn up 
    if (winScr > winH) {
      $(".js-scroll-top").addClass("is-active");
    } else {
      $(".js-scroll-top").removeClass("is-active");
    }


    if (winW > 575) {
      if (winScr > lastScrollTop && winScr > 40) {
        $("body").addClass("hide-top-header");

      } else if (winScr < document.body.scrollHeight - window.innerHeight) {
        $("body").removeClass("hide-top-header");
      }
    }


    lastScrollTop = winScr;
  };
  // setTimeout(_functions.scrollCall, 0);
  _functions.scrollCall();


  /* Function on page resize */
  _functions.resizeCall = function () {
    setTimeout(function () {
      _functions.pageCalculations();
      _functions.headerLangCut();
      _functions.headerLinksCut()
      _functions.headerContactsCut()
    }, 100);
  };


  $(window).on('resize', function () {
    _functions.resizeCall();
  });




  //*==============
  //*  ANIMATION  =
  //*==============
  const observerFunction = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("|", "animated");
        observer.unobserve(entry.target);
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: "0%",
    }
  );

  document.querySelectorAll(".section").forEach((block) => {
    observerFunction.observe(block);
  });




  //*===========
  //*  HEADER  =
  //*===========
  // Dropdown 
  $(document).on('click', '.dropdown__title', function () {
    let pr = $(this).closest('.dropdown');

    pr.toggleClass('is-active');

    if (winScr < 1200) {
      if (pr.hasClass('dropdown-toggle')) {
        pr.find('.dropdown__content').slideToggle()
      }
    }
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.dropdown').length) {
      $('.dropdown').removeClass('is-active');
    }
  });


  // Open menu 
  $(document).on("click", ".js_menu_btn", function () {
    $("header").removeClass("catalogue-opened").addClass("open-menu");

    if (window.innerWidth < 992) {
      $('.c-body').removeClass('c-lvl-2 c-lvl-3').addClass("c-lvl-1")
      $('.c-right').removeClass("active")
      $('.c-lvl-item ').removeClass("active")
      $(".c-breadcrumbs span").text($(".c-top_lvl-1 .c-lvl-title").text());
    }

    if (!$('html').hasClass("overflow-hidden")) {
      _functions.removeScroll();
    }
  });

  // Close menu 
  $(document).on("click", ".h-menu .btn-close", function () {
    $("header").removeClass("open-menu");

    if (window.innerWidth < 992) {
      $('.c-body').removeClass('c-lvl-2 c-lvl-3').addClass("c-lvl-1")
      $('.c-right').removeClass("active")
      $('.c-lvl-item ').removeClass("active")
      $(".c-breadcrumbs span").text($(".c-top_lvl-1 .c-lvl-title").text());
    }

    _functions.addScroll();
  });

  $(document).on("click", ".header-overlay", function () {
    $("header").removeClass("open-menu");
    $('html').removeClass("search-show")

    if (window.innerWidth < 992) {
      $('.c-body').removeClass('c-lvl-2 c-lvl-3').addClass("c-lvl-1")
      $('.c-right').removeClass("active")
      $('.c-lvl-item ').removeClass("active")
      $(".c-breadcrumbs span").text($(".c-top_lvl-1 .c-lvl-title").text());
    }

    _functions.addScroll();
  });

  $(document).on("mouseenter", ".header-overlay", function () {
    $("header").removeClass("catalogue-opened");

    if (!$("header").hasClass("open-menu")) {
      _functions.addScroll();
    }
  });


  // Search input
  $(document).on("input change", ".search input", function () {
    if ($(this).val().length) {
      $(this).closest(".search").addClass("value");

    } else {
      $(this).closest(".search").removeClass("value");
    }
  });

  $(document).on("click", ".search__clear", function () {
    $(this).closest(".search").removeClass("value").find("input").val("");

    $('html').removeClass("search-show");
  });

  $(document).on("focus", ".search input", function () {
    $("header").addClass("search-focus");
  });

  $(document).on("blur", ".search input", function () {
    $("header").removeClass("search-focus");
  });

  $(document).on("click", ".js_open_search", function () {
    $('html').addClass("search-show")
  });



  _functions.headerLangCut = function () {
    if (winW > 1199) {
      if ($('.h-menu__content-horizontal').children('.js_cut_lang').length) {
        $('.js_cut_lang').appendTo($('.header__top-right'));
      }

    } else {
      if ($('.header__top-right').children('.js_cut_lang').length) {
        $('.js_cut_lang').appendTo('.h-menu__content-horizontal');
      }
    }
  }
  _functions.headerLangCut()


  _functions.headerLinksCut = function () {
    if (winW > 1199) {
      if ($('.h-menu__content').children('.js_cut_links').length) {
        $('.js_cut_links').appendTo($('.header__top-nav'));
      }

    } else {
      if ($('.header__top-nav').children('.js_cut_links').length) {
        $('.h-menu__buttons').after($('html').find('.js_cut_links'));
      }
    }
  }
  _functions.headerLinksCut()


  _functions.headerContactsCut = function () {
    if (winW > 1199) {
      $('.header__top-nav').after($('html').find('.js_cut_contacts'));
    } else {
      $('.js_cut_links').after($('html').find('.js_cut_contacts'));
    }
  }
  _functions.headerContactsCut()

  _functions.getLanguageFromCookies = function () {
    const match = document.cookie.match(/lang=([^;]+)/);
    return match ? match[1] : null;
  }

  function setLanguageToCookies(lang) {
    document.cookie = `lang=${lang}; path=/;`;
  }

  function updateLanguageDisplay(lang) {
    const $langDisplay = $('#current-lang');
    if (lang === 'uk') {
        $langDisplay.text('Укр');
        $langDisplay.closest('.lang-item').find('img').attr('src', '/img/icons/flag_ua.svg');
    } else if (lang === 'en') {
        $langDisplay.text('Eng');
        $langDisplay.closest('.lang-item').find('img').attr('src', '/img/icons/flag_eng.svg');
    }
  }

  $(document).on('click', '.lang-item', function (e) {
    e.preventDefault();
    const selectedLang = $(this).data('lang');
    setLanguageToCookies(selectedLang);
    updateLanguageDisplay(selectedLang);
    location.reload();
  });

  $(document).ready(function () {
    let currentLang = _functions.getLanguageFromCookies();
    if (!currentLang) {
        currentLang = 'uk';
        setLanguageToCookies(currentLang);
    }
    updateLanguageDisplay(currentLang);
  });


  //*==============
  //*  Mega menu  =
  //*==============
  $(document).on("click", ".open-catalogue", function (e) {
    e.preventDefault();
    // loadHtmlAJAX('.catalogue', $('.catalogue').attr('data-url'));

    const $header = $("header");

    if ($header.hasClass("catalogue-opened")) {
      _functions.addScroll();
    } else {
      _functions.removeScroll();
    }
    $header.toggleClass("catalogue-opened").removeClass("open-menu");
  });

  $(document).on("click", ".catalogue .btn-close", function () {
    $("header").removeClass("catalogue-opened").removeClass("open-menu");

    if (window.innerWidth < 992) {
      $('.c-body').removeClass('c-lvl-2 c-lvl-3').addClass("c-lvl-1")
      $('.c-right').removeClass("active")
      $('.c-lvl-item ').removeClass("active")
      $(".c-breadcrumbs span").text($(".c-top_lvl-1 .c-lvl-title").text());
    }

    _functions.addScroll();
  });

  $(document).on("mouseenter", "[data-lvl-2]", function () {
    if (window.innerWidth >= 992) {
      $(this).addClass("active").siblings().removeClass("active");
      const id = $(this).attr("data-lvl-2");

      $(`[data-lvl-2-self=${id}]`).addClass("active").siblings().removeClass("active");
    }
  });

  $(document).on("click", "[data-lvl-2]", function () {
    if (window.innerWidth < 992) {
      $(this).closest(".c-mob-lvl").addClass("hide");
      const id = $(this).attr("data-lvl-2");

      $(".c-mob-lvl_2").addClass("show");
      $(`[data-lvl-2-self-desk=${id}]`).addClass("active").siblings().removeClass("active");
    }
  });

  $(document).on("click", ".c__a-1", function (e) {
    if (window.innerWidth < 992) {
      e.preventDefault();
      const id = $(this).attr("data-lvl-2");

      $(`[data-lvl-2-self=${id}]`).addClass("active").siblings().removeClass("active");
      $(".c-breadcrumbs span").text($(".c-top_lvl-1 .c-lvl-title").text());
      $(".c-body").addClass("c-lvl-2").removeClass("c-lvl-1");
    }
  });

  $(document).on("click", ".c__a-2:not(:only-child)", function (e) {
    if (window.innerWidth < 992) {
      e.preventDefault();

      $(".c-body").addClass("c-lvl-3").removeClass("c-lvl-2");
      $(".c-lvl-item-2").removeClass("active");
      $(".c-breadcrumbs span").text(
        $(".c-right.active>.c-lvl-title_mob").text()
      );
      $(this).closest(".c-lvl-item-2").addClass("active");
    }
  });

  $(document).on("click", ".c-lvl-2 .c-breadcrumbs", function () {
    $(".c-body").addClass("c-lvl-1").removeClass("c-lvl-2");
  });

  $(document).on("click", ".c-lvl-3 .c-breadcrumbs", function () {
    $(".c-breadcrumbs span").text($(".c-top_lvl-1 .c-lvl-title").text());
    $(".c-body").addClass("c-lvl-2").removeClass("c-lvl-3");
  });

  // main banner catalogue
  $(document).on("mouseenter", ".main-banner__nav .c-item", function () {
    if (window.innerWidth >= 1200) {
      // loadHtmlAJAX('.catalogue', $('.catalogue').attr('data-url'));
      _functions.removeScroll();
      $("header").addClass("catalogue-opened").removeClass("open-menu");
    }
  });




  //*===========
  //*  POPUPS  =
  //*===========
  // Function check scroll width
  _functions.scrollWidth = function () {
    let scrWidth = window.innerWidth - document.querySelector('body').offsetWidth + 'px';
    $('body, .header, .prd-panel').css({
      "paddingRight": scrWidth
    });
    $('.catalogue').css({
      "right": scrWidth
    });
  }

  // Popups Functions
  let popupTop = 0;
  let popupIsLoading = false;
  _functions.removeScroll = function () {
    _functions.scrollWidth();
    popupTop = $(window).scrollTop();

    $("html").css({
      top: -$(window).scrollTop(),
      width: "100%",
    }).addClass("overflow-hidden");
  };

  _functions.addScroll = function () {
    _functions.scrollWidth();
    $("html").removeClass("overflow-hidden");
    window.scroll(0, popupTop);
  };

  $(document).on("popupLoaded", () => {
    _functions.initSelects(".popup-wrapper");
    _functions.initMask();
  });

  

  // function loadPopup(popup, openPopUpCallback) {
  //   let xhttp = new XMLHttpRequest();
  //   xhttp.onreadystatechange = function () {
  //     if (this.readyState == 4 && this.status == 200) {
  //       document.getElementById("popups").insertAdjacentHTML("beforeend", this.responseText);

  //       $(".popup-wrapper .popup-content").each(function () {
  //         $(this).removeClass("active");
  //       });

  //       $(document).trigger("popupLoaded");

  //       setTimeout(() => {
  //         _functions.openPopup(popup, openPopUpCallback);
  //       }, 50);
  //     }
  //     popupIsLoading = false;
  //   };
  //   // popup = data-rel attribute. change url for popups on dev
  //   xhttp.open("GET", `inc/popups/_${popup}.php`, true);
  //   xhttp.send();
  // }

  function loadPopup(popup, openPopUpCallback, query = null) {
    const lang = _functions.getLanguageFromCookies();
    const url = query ? `/client/popup/${popup}?${jQuery.param(query)}` : `/client/popup/${popup}`
    console.log('URL:', url);
    $.ajax({
      url: url,
      method: "GET",
      headers: { 
        'Accept-Language': lang
      },
      success: function (response) {
        $("#popups").append(response.html);
        $(".popup-wrapper .popup-content").each(function () {
          $(this).removeClass("active");
        });
        $(document).trigger("popupLoaded");

        setTimeout(function () {
          _functions.openPopup(popup, openPopUpCallback);
        }, 100);

        popupIsLoading = false;
      },
      error: function (xhr, status, error) {
        // Handle error if needed
        console.error(error);
      }
    });
  }

  // pausing videos on popup close
  _functions.pausePopupVideo = function () {
    if (document.querySelector(".popup__video iframe"))
      document.querySelectorAll(".popup__video iframe").forEach((video) => {
        video.contentWindow.postMessage(
          '{"event":"command","func":"stopVideo","args":""}',
          "*"
        );
      });

    if (document.querySelector(".popup__video_native video"))
      document.querySelectorAll(".popup__video_native video").forEach((video) => {
        video.pause();
        video.currentTime = 0;
      });
  };

  _functions.closePopup = function () {
    $(".popup-wrapper, .popup-content").removeClass("active");
    _functions.pausePopupVideo();
    _functions.addScroll();
  };

  _functions.openPopup = function (popup, callback = function () { }, query = null) {
    $(".popup-content").removeClass("active");
    $(".popup-wrapper").addClass("active");

    if ($(`.popup-content[data-rel="${popup}"]`).length) {
      $(`.popup-content[data-rel="${popup}"]`).addClass("active");
      callback.call($(`.popup-content[data-rel="${popup}"]`));

    } else 
    if (!popupIsLoading) {
      popupIsLoading = true;
      loadPopup(popup, callback, query);

    } else {
      $(".popup-wrapper").removeClass("active");
    }

    _functions.removeScroll();
  };

  $(document).on("click", ".open-popup", function (e) {
    e.preventDefault();
    _functions.openPopup($(this).data("rel"));
  });

  $(document).on("click", ".popup-wrapper .bg-layer, .popup-wrapper .layer-close, .popup-wrapper .close-popup", function (e) {
    e.preventDefault();
    _functions.closePopup();
    return false;
  });

  //close popup with ESCAPE key
  $(document).on("keyup", function (e) {
    if (e.keyCode === 27) {
      _functions.closePopup();
    }
  });




  //*==============
  //*  KEY FOCUS  =
  //*==============
  // Detect if user is using keyboard tab-button to navigate
  // with 'keyboard-focus' class we add default css outlines
  function keyboardFocus(e) {
    if (e.keyCode !== 9) {
      return;
    }

    switch (e.target.nodeName.toLowerCase()) {
      case "input":
      case "select":
      case "textarea":
        break;
      default:
        document.documentElement.classList.add("keyboard-focus");
        document.removeEventListener("keydown", keyboardFocus, false);
    }
  }
  document.addEventListener("keydown", keyboardFocus, false);




  //*====================
  //*  TABS, ACCORDION  =
  //*====================
  // tabs
  $(document).on("click", "._tab-nav>*", function (e) {
    e.preventDefault();

    let tab = $(this).closest("._tabs").find("._tabs-wrap ._tab");
    let i = $(this).index();

    $(this).addClass("is-active").siblings().removeClass("is-active");
    tab.eq(i).siblings("._tab:visible").stop().finish().fadeOut(function () {
      tab.eq(i).fadeIn(200);
    });
  });

  // accordion
  $(document).on("click", ".accordion-title", function () {
    if ($(this).hasClass("is-active")) {
      $(this).removeClass("is-active").next().slideUp();

    } else {
      $(this).closest(".accordion-wrap").find(".accordion-title").not(this).removeClass("is-active").next().slideUp();
      $(this).addClass("is-active").next().slideDown();
    }
  });




  //*======================
  //*  Comments           =
  //*======================
  $(document).on("click", ".cmt-leave-btn", function () {
    $(this).closest('.cmt-item').find('.cmt-leave').slideToggle()
  });

  $(document).on("click", ".cmt-answer-toggle", function () {
    $(this).closest('.cmt-item').find('.cmt-answer').slideToggle()
  });

  $(document).on("click", ".cmt-answer-hide", function () {
    $(this).closest('.cmt-answer').slideUp()
  });




  //*=============
  //*  OTHER JS  =
  //*=============
  // Toggle content
  $(document).on("click", ".toggle-btn", function () {
    let th = $(this);
    let pr = th.closest('.section').find('.toggle-content');
    let inner = pr.find('>*');
    let h = inner.prop('scrollHeight');


    th.toggleClass('is-active');
    pr.toggleClass('is-active');

    if (pr.hasClass('is-active')) {
      // pr.removeClass('content-overflow');

      pr.animate({
        height: h + "px"
      }, 600);

    } else {
      pr.animate({
        height: pr.css("min-height")
      }, 600, function () {
        // pr.addClass('content-overflow')
      });
    }
  });

  // Footer tabs mob
  $(document).on("click", ".footer__nav .title", function () {
    const $navItem = $(this).closest(".footer__nav");
    const $navContent = $navItem.find("ul");

    if ($navItem.hasClass("active")) {
      $navItem.removeClass("active");
      $navContent.slideUp();

    } else {
      $navItem.addClass("active");
      $navContent.slideDown();
      $navItem.siblings().each(function () {
        $(this).removeClass("active").find("ul").slideUp();
      });
    }
  });


  // Brand form
  $(document).on("change", ".brand-item input", function () {
    let th = $(this);
    let pr = th.closest('.brands-form-section');
    let grid = pr.find('.brands-grid');
    let form = pr.find('.brands-form');
    let select = form.find('#brands')

    select[0].slim.setSelected(th.val());

    grid.fadeOut(function () {
      form.fadeIn(400);
    });

    setTimeout(() => {
      window.scrollTo({
        top: pr.offset().top - $('header').height()
      })
    }, 600);
  });


  // Click on sub-links
  $(document).on("click", ".category-swiper .btn_tab-nav", async function () {
    $(this).closest(".swiper-entry").find(".btn_tab-nav.active").removeClass("active");
    $(this).addClass("active");
  });


  // Cabinet menu
  $(document).on("click", ".cb-toggle-btn", function () {
    $("html").addClass("cabinet-is-open");

    _functions.removeScroll();
  });

  $(document).on("click", ".cb-menu-close, .cb-overlay", function () {
    $("html").removeClass("cabinet-is-open");

    _functions.addScroll();
  });


  // remove address field
  $(document).on("click", ".js_remove_address", function () {
    $(this).closest(".input-field").slideUp(300, function () {
      $(this).remove();
    });
  });


  $(document).on("click", ".js_toggle_order_btn", function () {
    $(this).toggleClass('is-active');
    $(this).closest(".order-block").find('.js_toggle_order_block').slideToggle(400);
  });


  // Color pick
  $(document).on('change', '.pic-colors input', function () {
    let th = $(this);
    let wrap = th.closest('.pic-color-block');
    let colorName = wrap.find('.pic-color-name');
    let colorImg = wrap.find('.pic-color-img-change');

    colorName.text(th.val())
    colorImg.attr('src', th.attr('data-img'))
  });

  _functions.getLocalizedMessage = async function (errorCode, lang) {
    try {
      const response = await fetch(`/client/localization/errors?errorCode=${errorCode}`, {
        method: 'GET',
        headers: {
          'Accept-Language': lang,
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      if (!result.success) {
        if (result.error && result.error.message) {
          return result.error.message;
        }
        throw new Error('Unexpected error response format');
      }
  
      if (result.success && result.data) {
        return result.data.message || 'Message not available';
      }
  
      throw new Error('Unexpected response format');
    } catch (err) {
      console.error('Failed to fetch localized message:', err.message);
      return 'An unexpected error occurred';
    }
  }

  _functions.validatePassword = async function (password, lang) {
    if (!password) {
      return await _functions.getLocalizedMessage('INVALID_PASSWORD_FORMAT', lang);
    }
  
    if (password.length < 12) {
      return await _functions.getLocalizedMessage('PASSWORD_TOO_SHORT', lang);
    }

    if (password.length > 100) {
      return await _functions.getLocalizedMessage('PASSWORD_TOO_LONG', lang);
    }
  
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(password)) {
      return await _functions.getLocalizedMessage('PASSWORD_STRENGTH_ERROR', lang);
    }
  
    return null;
  }




  //*================
  //*  Custom AJAX  =
  //*================
  // async function loadHtmlAJAX(wrapper, url) {
  //   if ($(wrapper).hasClass("ajax-done")) return

  //   try {
  //     fetch(url)
  //       .then((res) => res.text())
  //       .then((html) => {
  //         $(wrapper).html('')
  //         $(wrapper).addClass("ajax-done").append(html)
  //       })

  //   } catch (err) {
  //     console.log(err)
  //   }

  // }



});