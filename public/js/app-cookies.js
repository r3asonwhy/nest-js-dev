//*======================
//*  Cookies functions  =
//*======================
//*  Cookies            =
//*======================

jQuery(function ($) {
  ("use strict");

  //*======================
  //*  Cookies functions  =
  //*======================
  _functions.createCookie = function (name, value, days) {
    var expires;

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toGMTString();

    } else {
      expires = "";
    }

    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
  };

  _functions.readCookie = function (name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(";");

    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];

      while (c.charAt(0) === " ") c = c.substring(1, c.length);

      if (c.indexOf(nameEQ) === 0)
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }

    return null;
  };

  _functions.eraseCookie = function (name) {
    createCookie(name, "", -1);
  };




  //*======================
  //*  Cookies            =
  //*======================
  if (!_functions.readCookie("my_cookie") == true) {
    setTimeout(function () {
      $(".cookies-informer").addClass("active");
    }, 6000);
  }

  $(document).on("click", ".close-cookies", function () {
    $(this).parents(".cookies-informer").removeClass("active");
  });

  $(document).on("click", ".set-cookie", function () {
    _functions.createCookie("my_cookie", true, 30);
  });



});