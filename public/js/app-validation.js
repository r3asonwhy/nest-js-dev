jQuery(function ($) {
  ("use strict");

  // VALIDATION
  function removeError($input) {
    $input.closest(".input-field").removeClass("invalid");
  }

  function showError($input, message = "Помилка валідації") {
    const $inputField = $input.closest(".input-field");
    const $errorMsg = $inputField.find(".input-error");
    $errorMsg.text(message);
    $inputField.addClass("invalid");
  }

  function validateInput($input) {
    switch ($input.attr("data-validation")) {
      case "email":
        if ($input.val().length) {
          var mailRegex =
            /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
          if ($input.val().match(mailRegex)) {
            removeError($input);
            return true;
          } else {
            showError($input, "Невірний Email");
            return false;
          }
        } else {
          showError($input);
          return false;
        }
        case "password-new-repeat":
          if ($input.val().length) {
            const newPass = $(`input[data-validation="password-new"]`).val();

            if ($input.val() === newPass) {
              removeError($input);
              return true;
            } else {
              console.log(newPass, $input.val());
              showError($input, "Паролі не співпадають");
              return false;
            }
          } else {
            showError($input, "Заповніть поле");
            return false;
          }
          default:
            if (!$input.val() || !$input.val().length) {
              showError($input, "Заповніть поле");
              return false;
            } else {
              removeError($input);
              return true;
            }
    }
  }
  _functions.validateForm = function ($form) {
    return $form
      .find("[data-required], [required]")
      .toArray()
      .map((input) => validateInput($(input)))
      .reduce((acc, curr) => acc && curr, true);
  };
  $(document).on(
    "change blur",
    "form input[required], input[data-required], textarea[required], textarea[data-required]",
    function () {
      validateInput($(this));
    }
  );
});