//*===================
//*  Inputs          =
//*===================
//*  Input password  =
//*===================
//*  Inputmask       =
//*===================
//*  Select          =
//*===================
//*  Upload Files    =
//*===================
//*  Calendar        =
//*===================
//*  Other Js        =
//*===================

jQuery(function ($) {
  ("use strict");

  //*==============
  //*  Inputs     =
  //*==============
  $(document).on("click", "[disabled], .disabled", function (e) {
    e.preventDefault();
  });

  $(document).on("focus", ".input-field .input, .input-button-wrap .input", function () {
    $(this).closest(".input-field").addClass("focus");
  });

  $(document).on("blur", ".input-field .input, .input-button-wrap .input", function () {
    $(this).closest(".input-field").removeClass("focus");
  });

  $(document).on("keyup", ".input-field .input", function () {
    if ($(this).val()) $(this).closest(".input-field").addClass("value");
    else $(this).closest(".input-field").removeClass("value");
  });

  $(document).on("click", ".input-clear", function () {
    if ($(".calendar").length) {
      const calendarPick = $(this).closest(".input-field").find(".calendar")[0]._picker;
      calendarPick.reset();
      $(this).closest(".input-field").removeClass("value")
      return
    }

    $(this).closest(".input-field").removeClass("value").find("input").val("").trigger("change");
    $(this).closest(".input-field").removeClass("value").find("select:not(.lightpick__select)").val("").trigger("change");
  });


  // Invalid Input //HARDCODE - REMOVE LATER
  $(document).on("blur", ".input-field .input[required]:not(.calendar)", function () {
    if ($(this).val().trim()) {
      $(this).closest(".input-field").removeClass("invalid");
    } else {
      $(this).closest(".input-field").addClass("invalid");
    }
  });

  $(document).on('focus', '.input', function () {
    const $input = $(this);
    const originalValue = $input.data('original-value');
    if (originalValue) {
      $input.val(originalValue);
      $input.data('original-value', '');
    }
  
    const $inputField = $input.closest('.input-field');
    $inputField.removeClass('invalid');
    $inputField.find('.input-error').hide();
  });


  // Check if input has value or autofill
  $(document).ready(function () {
    $(".input-field .input").each(function () {
      let th = $(this);
      if (th.val()) {
        th.closest(".input-field").addClass("value");
      }
    });

    $(".input-field .input:-webkit-autofill").each(function () {
      let th = $(this);
      th.closest(".input-field").addClass("value");
    });
  });




  //*===================
  //*  Input password  =
  //*===================
  $(document).on("click", ".input-field__pass-btn", function () {
    const $btn = $(this),
      $input = $btn.parent().find(".input");

    if (!$btn.hasClass("active")) {
      $input.attr("type", "text");
    } else {
      $input.attr("type", "password");
    }

    $btn.toggleClass("active");
  });




  //*==============
  //*  Inputmask  =
  //*==============
  _functions.initMask = function () {
    if ($('.input[type="tel"]').length) {
      $('.input[type="tel"]').inputmask({
        mask: "+999 (99) 999 99 99",
        placeholder: "_",
        showMaskOnHover: false,
        showMaskOnFocus: true,
        definitions: {
          9: {
            validator: "[0-9]",
          },
        },
      });
    }
    if ($(".group-digits-input-mask").length) {
      $(".group-digits-input-mask").inputmask({
        alias: "decimal",
        rightAlign: false,
        groupSeparator: " ",
        autoGroup: true,
        digits: 3,
        placeholder: "",
        SetMaxOnOverflow: true,
        showMaskOnHover: false,
      });
    }

    if ($(".input.code-mask").length) {
      $(".input.code-mask").inputmask({
        mask: "9 9 9 9",
        placeholder: "_",
        showMaskOnHover: false,
        showMaskOnFocus: false,
        definitions: {
          9: {
            validator: "[0-9]",
          },
        },
      });
    }
  };

  _functions.initMask();




  //*==============
  //*  Select     =
  //*==============
  _functions.initSelect = function ($select) {
    // setting options and events
    let options = $select.data("options") || {};
    let events = {};

    if (!("showSearch" in options)) {
      options.showSearch = false;
    }
    if (!("allowDeselect" in options)) {
      options.allowDeselect = true;
    }
    if (!("contentLocation" in options)) {
      options.contentLocation = $select.closest(".input-field").get(0);
    }
    if ($select.attr("data-placeholder")) {
      options.placeholderText = $select.attr("data-placeholder");
    }

    options.searchText = "Не знайдено";
    options.searchPlaceholder = "Пошук";

    if (options.addable == true) {
      events.addable = function (value) {
        return value;
      };
    }

    // init
    const select = new SlimSelect({
      select: $select.get(0),
      settings: {
        openPosition: "down",
        ...options,
      },
      events: {
        afterChange: (newVal) => {
          if ($select.val().length != 0) {
            $select.closest(".input-field").removeClass("invalid");
          } else {
            $select.next(".ss-main").find(".ss-deselect").addClass("ss-hide");
          }
          $select.trigger("change");
        },
        beforeOpen: () => {
          $select.closest(".input-field").addClass("focus");
          $(".ss-search input").trigger("blur");
        },
        afterOpen: () => {

        },
        beforeClose: () => {
          $select.closest(".input-field").removeClass("focus");
        },
        ...events,
      },
    });
  };

  _functions.initSelects = function (selector = document) {
    if ($(selector).find(".input-field select").length) {
      $(selector).find(".input-field select").each(function () {
        _functions.initSelect($(this));
      });
    }
  };
  _functions.initSelects();

  $(document).on("change", "select", function () {
    if ($(this).val().length) {
      $(this).closest(".input-field").addClass("value");
    } else {
      $(this).closest(".input-field").removeClass("value");
    }
  });




  //*==============
  //* Range input =
  //*==============
  _functions.initRangeSlider = function ($rangeWraper) {
    const $rangeInput = $rangeWraper.find(".input-range__slider-input");
    const $fromInput = $rangeWraper.find(".input-range__fields input").first();
    const $toInput = $rangeWraper.find(".input-range__fields input").last();
    let options = $rangeInput.data("options") || {};

    options.skin = "round";
    options.type = "double";
    options.hide_min_max = "true";
    options.hide_from_to = "true";

    if (parseInt($fromInput.val())) {
      options.from = parseInt($fromInput.val());
    }

    if (parseInt($toInput.val())) {
      options.to = parseInt($toInput.val());
    }

    // multiplier for additional units
    let multiplier = +$rangeWraper.find('[type="radio"]:checked').val() | 1;

    $rangeWraper.find('[type="radio"]').on("change", function () {
      multiplier = +$rangeWraper.find('[type="radio"]:checked').val();
      updateInputs(rangeInst.result);
    });

    // update inputs on range change
    function updateInputs(data) {
      const plus = data.to == options.max ? "+" : "";
      $fromInput.val(parseInt(data.from * multiplier)).trigger("input");
      $toInput.val(parseInt(data.to * multiplier)).trigger("input");
    }

    if ($fromInput.length && $toInput.length) {
      options.onChange = updateInputs;
      options.onFinish = () => {
        $fromInput.trigger("change");
        $toInput.trigger("change");
      };
    }

    $rangeInput.ionRangeSlider({
      ...options
    });

    const rangeInst = $rangeInput.data("ionRangeSlider");

    // update range on inputs change
    $fromInput.on("change", () => {
      let val = +$fromInput.val() / multiplier;
      if (val < rangeInst.result.min) {
        val = rangeInst.result.min;
      }
      if (val > rangeInst.result.max) {
        val = rangeInst.result.max;
      }
      if (val > rangeInst.result.to) {
        val = rangeInst.result.to;
      }
      rangeInst.update({
        from: val
      });
      val = val * multiplier;
      $fromInput.val(parseInt(val));
    });

    $toInput.on("change", function () {
      let val = +$(this).val().replace("+", "") / multiplier;
      if (val < rangeInst.result.min) {
        val = rangeInst.result.min;
      }
      if (val > rangeInst.result.max) {
        val = rangeInst.result.max;
      }
      if (val < rangeInst.result.from) {
        val = rangeInst.result.from;
      }

      const plus = val == rangeInst.result.max ? "+" : "";

      rangeInst.update({
        to: val
      });

      val = val * multiplier;

      $(this).val(parseInt(val));
    });
  };

  _functions.initRangeSliders = function (selector = document) {
    $(selector).find(".input-range").each(function () {
      _functions.initRangeSlider($(this));
    });
  };
  _functions.initRangeSliders();




  //*================
  //* Upload Files  =
  //*================
  const dt = new DataTransfer();

  $(document).on("change", ".upload-wrap input[type=file]", function (e) {
    const wrap = $(this).closest(".upload-wrap").find(".upload-files");
    const maxSize = 5242880;
    let files = this.files;

    if (files.length > 10) {
      alert("Only 10 files accepted.");
      e.preventDefault();
      return
    }

    for (var i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        alert("File is too big!");
        this.value = "";
        e.preventDefault();
        return
      }
    }

    for (let file of files) {
      let isDuplicate = false;

      for (let item of dt.items) {
        if (item.kind === "file" && item.getAsFile().name === file.name) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        dt.items.add(file);
      }
    }

    this.files = dt.files;
    files = dt.files;

    wrap.html("");

    for (var i = 0; i < files.length; i++) {
      let fileImg = '';

      if (files[i].type.startsWith("image/")) {
        fileImg = `<div class="uploaded-image">
                      <img src="${URL.createObjectURL(files[i])}" alt="${files[i].name}"/>
                    </div>`;
      }

      let fileItem = `<div class="uploaded-file">
        <i class="delete-file">
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 17C8.94772 17 8.5 17.4477 8.5 18C8.5 18.5523 8.94772 19 9.5 19H14.5C15.0523 19 15.5 18.5523 15.5 18C15.5 17.4477 15.0523 17 14.5 17H9.5Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.1 2C7.61291 2 7.19668 2.35095 7.11438 2.83104L6.65684 5.5H3C2.44772 5.5 2 5.94772 2 6.5C2 7.05228 2.44772 7.5 3 7.5H4.56244L5.50207 22.0644C5.53602 22.5906 5.97271 23 6.5 23H17.5C18.0273 23 18.464 22.5906 18.4979 22.0644L19.4376 7.5H21C21.5523 7.5 22 7.05228 22 6.5C22 5.94772 21.5523 5.5 21 5.5H17.3432L16.8856 2.83104C16.8033 2.35095 16.3871 2 15.9 2H8.1ZM15.314 5.5H8.68602L8.94316 4H15.0568L15.314 5.5ZM7.43756 21L6.5666 7.5H17.4334L16.5624 21H7.43756Z" fill="currentColor"/>
          </svg>
        </i>
        ${fileImg}
        <b>${files[i].name}</b>
      </div>`;

      wrap.append(fileItem);
    }
  });

  $(document).on("click", ".delete-file", function () {
    let uploadFile = $(this).closest(".uploaded-file");
    let itemName = $(this).siblings("b").text();

    for (let item of dt.items) {
      if (item.kind === "file" && item.getAsFile().name === itemName) {
        dt.items.remove(item);
      }
    }

    $(".upload-wrap input[type=file]")[0].files = dt.files;
    uploadFile.remove();
  });




  //*============
  //* Calendar  =
  //*============
  _functions.initCalendar = function (calendar) {
    const isSingle = calendar.attr("data-single");

    const options = {
      field: calendar.get(0),
      parentEl: calendar.closest(".input-field").get(0),
      lang: "ua",
      format: "DD.MM.YYYY",
      autoclose: true,
      singleDate: isSingle,
      locale: {
        buttons: {
          prev: '',
          next: '',
        },
        tooltip: {
          one: 'День',
          other: 'Днів'
        }
      },
      onOpen: function () {
        calendar.closest(".input-field").removeClass("invalid");
      },
      onSelect: function (start, end) {
        if (isSingle) return

        let str = '';
        str += start ? start.format('DD.MM.YYYY') + ' - ' : '';
        str += end ? end.format('DD.MM.YYYY') : '';

        if (str.length > 0) {
          calendar.closest(".input-field").addClass("value");
        }

        $(calendar).val(str);
      },
      onClose: function () {
        if (calendar.attr("required")) {
          calendar.closest(".input-field").addClass("invalid");

        } else {
          calendar.closest(".input-field").removeClass("invalid");
        }

        if (calendar.val().length > 0) {
          calendar.closest(".input-field").addClass("value");

        } else {
          calendar.closest(".input-field").removeClass("value");
        }
      },
    };

    const max = calendar.attr("data-max");

    if (max) {
      options.maxDate = max;
    }

    const birth = calendar.hasClass("birthday");
    if (birth) {
      options.maxDate = new Date();
    }

    const picker = new Lightpick(options);

    calendar.get(0)._picker = picker
  };


  _functions.initCalendars = function (selector = document) {
    $(selector).find(".calendar").each(function () {
      _functions.initCalendar($(this));
    });
  };
  _functions.initCalendars();




  //*============
  //* Other Js  =
  //*============
  // clear inputs
  _functions.clearAllInputs = function (wrapper) {
    wrapper.find('input[type="radio"], input[type="checkbox"]').prop("checked", false);
    wrapper.find('input[type="radio"][checked]').prop("checked", true);

    wrapper.find('input[type="radio"], input[type="checkbox"]').trigger("change");
    wrapper.find('input[type="text"], input[type="number"]').val("");
    wrapper.find("select").each(function () {
      $(this)[0].slim.setSelected();
    });

    wrapper.find(".input-range__slider-input").each(function () {
      $(this).data("ionRangeSlider").reset();
    });

    wrapper.find(".input-field.value").removeClass("value");
  };

  // CODE INPUT
  $(document).on("keydown", ".code-input input", function (e) {
    e.preventDefault();

    if (e.originalEvent.key == "Backspace") {
      $(this).val("e.key");
      $(this).prev().trigger("focus");

    } else {
      $(this).val(e.key);

      if ($(this).next().length) {
        if (isFinite(e.key)) $(this).next().trigger("focus");
      } else {
        $(this).trigger("blur");
      }
    }
  });

  $(document).on("click", ".resend-code button", function () {
    const $btn = $(this);
    const $timerWrap = $(this).find(".resend-timer-wrap");
    const $timer = $timerWrap.find(".resend-timer");

    $btn.attr("disabled", true);

    let time = 30;

    $timer.text(time);

    let interval = setInterval(() => {
      time--;
      $timer.text(time);

      if (time == 0) {
        $timerWrap.fadeOut();
        clearInterval(interval);
        $btn.removeAttr("disabled");
      }
    }, 1000);
    $timerWrap.fadeIn();
  });


});