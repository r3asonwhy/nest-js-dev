//*===========
//*  SWIPER  =
//*===========
jQuery(function ($) {
  "use strict";
  // Options set Swiper
  _functions.getSwOptions = function (swiper) {
    let options = swiper.data("options");
    options = !options || typeof options !== "object" ? {} : options;

    const $p = swiper.closest(".swiper-entry"),
      slidesLength = swiper.closest(".swiper-entry").find(".swiper-wrapper>.swiper-slide").length;

    if (options.arrowsOut) {
      if (!options.navigation)
        options.navigation = {
          nextEl: $p.closest("section, .section").find(".swiper-button-next")[0],
          prevEl: $p.closest("section, .section").find(".swiper-button-prev")[0],
        };

      if (!options.pagination)
        options.pagination = {
          el: $p.closest("section, .section").find(".swiper-pagination")[0],
          clickable: true,
          dynamicBullets: slidesLength > 10 ? true : false,
          dynamicMainBullets: 1,
        };
    } else {
      if (!options.pagination)
        options.pagination = {
          el: $p.find(".swiper-pagination")[0],
          clickable: false,
          dynamicBullets: slidesLength > 10 ? true : false,
          dynamicMainBullets: 1,
        };

      if (!options.navigation)
        options.navigation = {
          nextEl: $p.find(".swiper-button-next")[0],
          prevEl: $p.find(".swiper-button-prev")[0],
        };
    }

    if (options.cornerIsFade) {
      options.navigation = {
        nextEl: $p.find('.corner-is-fade.right')[0],
        prevEl: $p.find('.corner-is-fade.left')[0],
        disabledClass: 'hide-fade'
      };
    }

    options.preloadImages = false;
    options.lazy = {
      loadPrevNext: true,
    };

    if (!options.centerInsufficientSlides) {
      options.centerInsufficientSlides = false;
    }

    options.observer = true;
    options.observeParents = true;
    options.watchOverflow = true;

    if (!options.speed) options.speed = 500;
    options.roundLengths = false;

    if (slidesLength <= 1) {
      options.loop = false;
    }

    return options;
  };


  // Init each Swiper
  _functions.initSwiper = function (el) {
    const swiper = new Swiper(el[0], _functions.getSwOptions(el));
  };


  _functions.initSwipers = function (selector = document) {
    $(selector).find(".swiper-entry .swiper-container").each(function () {
      let thisSlider = $(this);

      _functions.initSwiper(thisSlider);

      let $thisSwiper = $(this)[0].swiper;


      if ($thisSwiper.isLocked) {
        thisSlider.closest(".swiper-entry").addClass("swiper-controls-hide");
      } else {

        thisSlider.closest(".swiper-entry").removeClass("swiper-controls-hide");
      }
    });
  };
  _functions.initSwipers();


  // thumbs Swiper
  $('.swiper-thumbs').each(function () {
    if ($('.swiper-thumbs-top').length && $('.swiper-thumbs-bottom').length) {
      let t = $(this);
      let top = t.find('.swiper-thumbs-top>.swiper-container')[0].swiper,
        bottom = t.find('.swiper-thumbs-bottom>.swiper-container')[0].swiper;

      top.thumbs.swiper = bottom;
      top.thumbs.init();
      top.thumbs.update();

      if (top.slides.length < 2) {
        t.addClass('hide-bottom');
      }
    }
  });


  $(document).on("click", '.category-swiper .swiper-slide .btn', function () {
    const swiper = $(this).closest(".swiper-container")[0].swiper;

    swiper.slideTo(swiper.clickedIndex)
  })

  //*=====================
  //*  Comparison table  =
  //*=====================
  if ($('.comparison-section').length) {
    $('.comparison-section').each(function () {
      const section = $(this);
      const fixedTable = section.find('.comparison-fixed');
      const table = section.find('.comparison');
      const sliderTop = fixedTable.find('.swiper-container')[0].swiper;
      const sliderBottom = table.find('.swiper-container')[0].swiper;
      const caption = section.find('.comparison-caption');


      function setCaptionWidth() {
        let sl = sliderBottom.slides.length
        let slw = sliderBottom.slidesSizesGrid[0];
        let scr = $(window).width();

        if (scr >= 1200) {
          if (sl < 6) {
            caption.css({
              'width': `${slw * sl}px`,
            })
          }

        } else if (scr > 992 && scr < 1199) {
          if (sl < 5) {
            caption.css({
              'width': `${slw * sl}px`,
            })
          }

        } else if (scr > 768 && scr < 991) {
          if (sl < 4) {
            caption.css({
              'width': `${slw * sl}px`,
            })
          }
        } else if (scr > 576 && scr < 765) {
          if (sl < 3) {
            caption.css({
              'width': `${slw * sl}px`,
            })
          }

        } else {
          if (sl <= 2) {
            caption.css({
              'width': `${slw * sl}px`,
            })
          }
        }
      }

      sliderBottom.on('resize', function () {
        setCaptionWidth()
        cellsHeight()
        // console.log('resize')
      });

      function removeSlides(num) {
        $(sliderBottom.slides[num]).remove()
        $(sliderTop.slides[num]).remove()

        sliderTop.update()
        sliderBottom.update()
        setCaptionWidth()
      }

      // remove product from top
      fixedTable.find('.swiper-slide').each(function (ind, el) {
        $(el).find('.comparison-delete-btn').on('click', function () {
          removeSlides(ind)
        })
      });

      // remove product from bottom
      table.find('.comparison-delete-btn').on('click', function () {
        console.log(222)
        let index = sliderBottom.clickedIndex
        console.log(index)

        removeSlides(index)
      })


      function cellsHeight() {
        let cells = table.find('.comparison-table>*:first-child').children();
        let captions = caption.children();

        cells.each(function (i) {
          if (i == 0) return

          let h = $(this).outerHeight();

          captions.eq(i).css({
            'height': `${h}px`
          })
        });
      }


      let firstCell = table.find('.swiper-slide:first-child .comparison-cell:first-child');
      $(window).on('scroll', function () {
        if ($(window).scrollTop() >= table.offset().top + firstCell.height()) {
          $('body').addClass('show-comparison-fixed');
        } else {
          $('body').removeClass('show-comparison-fixed');
        }
      });

      $(document).on("change", '.js_show_differences', function () {
        section.addClass('block-loading');

        if ($(this).is(':checked')) {
          table.addClass('hide-difference');
        } else {
          table.removeClass('hide-difference');
        }

        setTimeout(() => {
          section.removeClass('block-loading');
        }, 1000);
      })

      function checkDifferences() {
        const captions = caption.find('.comp-caption')
        const columns = table.find('.comparison-table .swiper-slide')
        const captionRow = {};

        captions.each(function (i) {
          captionRow[`row-${i}`] = [];

          columns.each(function () {
            let cellContent = $($(this).find('.comp-info')[i]).text().trim().toLowerCase();

            captionRow[`row-${i}`].push(cellContent);
          });

          let cells = captionRow[`row-${i}`];
          const allSame = cells.every(value => value === cells[0]);

          if (allSame) {
            columns.each(function () {
              $(captions[i]).addClass('have-no-difference')

              $($(this).find('.comp-caption')[i]).addClass('have-no-difference')
              $($(this).find('.comp-info')[i]).addClass('is-same-value')
            });
          }
        });
      };
      checkDifferences()
    });
  }


});