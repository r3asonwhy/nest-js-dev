//*=======================
//*  Filter sort & grid  =
//*=======================
//*  Filter thumb        =
//*=======================
//*  Filter search       =
//*=======================
//*  Filter toggle       =
//*=======================
//*  Filter menu         =
//*=======================

jQuery(function ($) {
  ("use strict");

  //*=======================
  //*  Filter sort & grid  =
  //*=======================
  // Filter sort
  $(document).on("click", ".fl-select-title", function () {
    $(this).closest('.fl-select').toggleClass('is-active');
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.fl-select').length) {
      $('.fl-select').removeClass('is-active');
    }
  });

  $(document).on("change", ".fl-select-list input", function () {
    let th = $(this);
    let pr = $(this).closest('.fl-select');
    let title = pr.find('.fl-select-title b');

    title.text(th.siblings('span').text());
    pr.removeClass('is-active')
  });




  //*=======================
  //*  Filter thumb        =
  //*=======================
  $(document).on("click", ".fl-thumb", function () {
    $(this).remove();
  });

  $(document).on("change", ".fl-menu *", function () {
    $(".fl-clear-btn").addClass("active");
  });

  _functions.updateFilterList = ($filterList) => {
    const $listItems = $filterList.find("li");
    const expanded = $filterList.hasClass("expanded");
    const listSearchVal = $filterList.prev(".fl-search").find("input").val() || "";

    let $searchResultList;

    if (listSearchVal.length) {
      $searchResultList = $listItems.filter((i, el) =>
        $(el).attr("data-name").toLowerCase().includes(listSearchVal.toLowerCase())
      );

    } else {
      $searchResultList = $listItems;
    }

    if ($searchResultList.length <= 7) {
      $filterList.addClass("full");

    } else {
      $filterList.removeClass("full");
    }

    $listItems.not($searchResultList).slideUp(200);

    $searchResultList.each(function (index) {
      // console.log(index);
      if (index < 7 || expanded) {
        $(this).slideDown(200);

      } else {
        $(this).slideUp(200);
      }
    });
  };

  _functions.updateFilters = () => {
    $(".fl-list").each(function () {
      _functions.updateFilterList($(this));
    });
  };
  _functions.updateFilters();




  //*=======================
  //*  Filter search       =
  //*=======================
  $(document).on("input change", ".fl-search input", function () {
    _functions.updateFilterList($(this).closest(".fl-search").next(".fl-list"));
  });

  $(document).on("click", ".fl-list-btn", function () {
    const $list = $(this).prev(".fl-list");

    $list.toggleClass("expanded");

    _functions.updateFilterList($list);
  });

  $(document).on("input change", ".fl-search input", function () {
    _functions.updateFilterList($(this).closest(".fl-search").next(".fl-list"));
  });




  //*=======================
  //*  Filter toggle       =
  //*=======================
  $(document).on("click", ".fl-title", function () {
    const th = $(this);
    const block = $(this).closest('.fl-block');

    th.toggleClass('is-active');
    block.find(".fl-toggle").first().slideToggle(300);
  });




  //*=======================
  //*  Filter menu         =
  //*=======================
  $(document).on("click", ".js_fl_open_btn", function () {
    $("html").addClass("filter-is-open");

    _functions.removeScroll();
  });

  $(document).on("click", ".filter-menu-close, .fl-overlay", function () {
    $("html").removeClass("filter-is-open");

    _functions.addScroll();
  });

  $(document).on("click", ".js_clear_filters", function () {
    _functions.clearAllInputs($(".fl-menu"));
    $(".fl-thumb").remove();
  });




});