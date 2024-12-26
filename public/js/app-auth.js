/* eslint-disable */
jQuery(function ($) {
  "use strict";
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regexPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\.]).{6,}$/
  const regexPhone = /^\+?[1-9]\d{11,14}$/;

  function clearErrorMessages() {
    $('.input-error').text('');
    $('.input-field').removeClass('invalid');
  }

  function setErrorMessage(fieldClass, msg) {
    const $inputField = $(fieldClass).closest('.input-field');
    $inputField.addClass('invalid');
    $inputField.find('.input-error').text(msg).show();
  }

  function resetFormAndErrors(formSelector) {
    const $form = $(formSelector);
    $form.find('input, textarea').val('');
    $form.find('.input-error').text('').hide();
    $form.find('.input-field').removeClass('invalid');
    $form.find('input[type="checkbox"]').prop('checked', false);
  }

  function setFormBlockMessage(formSelector, message) {
    const $form = $(formSelector);
    const $messageBlock = $form.find('.form-block-message');
    $messageBlock.text(message).removeClass('d-none');
  }

  function clearFormBlockMessage(formSelector) {
    const $form = $(formSelector);
    const $messageBlock = $form.find('.form-block-message');
    $messageBlock.text('').addClass('d-none');
  }

  $(document).on('submit', '#login_popup_form', async function (e) {
    e.preventDefault();
    clearErrorMessages();
    clearFormBlockMessage('#login_popup_form');

    const form = $('#login_popup_form');
    const lang = _functions.getLanguageFromCookies() || 'uk';
    const data = {
      phone: $(form).find('.login_phone_field').val().replace(/[^\d+]/g, ''),
      password: $(form).find('.login_password_field').val().trim(),
    };

    if (!data.phone || !regexPhone.test(data.phone)) {
      const errorMessage = await _functions.getLocalizedMessage('PHONE_FORMAT_ERROR', lang);
      setErrorMessage('.login_phone_field', errorMessage);
      return;
    }

    const passwordError = await _functions.validatePassword(data.password, lang);
    if (passwordError) {
      setErrorMessage('.login_password_field', passwordError);
      return;
    }

    $.ajax({
      type: 'post',
      url: '/auth/login',
      headers: { 'Accept-Language': lang },
      data: data,
      dataType: 'JSON',
      success: function (response) {
        window.location.href = response.data.redirect;
      },
      error: function (data) {
        console.warn(data);

        if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.details) {
          data.responseJSON.error.details.forEach(detail => {
            const field = detail.property;
            const message = Object.values(detail.constraints).join('; ');
            setErrorMessage(`.login_${field}_field`, message);
          });
        } else if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          const generalMessage = data.responseJSON.error.message;
          setFormBlockMessage('#login_popup_form', generalMessage);
        }
      },
    });
  });

  $(document).on('click', '#header_logout_btn', function (e) {
    e.preventDefault();
    const lang = _functions.getLanguageFromCookies() || 'uk';

    $.ajax({
      type: 'delete',
      url: '/auth/logout',
      headers: { 'Accept-Language': lang },
      dataType: 'JSON',
      success: function (response) {
        window.location.href = response.data.redirect;
      },
      error: function (data) {
        console.warn('Logout failed:', data);

        if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          alert(data.responseJSON.error.message);
        }
      },
    });
  });

  $(document).on('submit', '#register_popup_form', async function (e) {
    e.preventDefault();
    clearErrorMessages();
    clearFormBlockMessage('#register_popup_form');

    const form = $('#register_popup_form');
    const lang = _functions.getLanguageFromCookies() || 'uk';

    const data = {
      first_name: $(form).find('.register_first_name_field').val(),
      last_name: $(form).find('.register_last_name_field').val(),
      email: $(form).find('.register_email_field').val(),
      phone: $(form).find('.register_phone_field').val().replace(/[^\d+]/g, ''),
      password: $(form).find('.register_password_field').val(),
      confirm_password: $(form).find('.register_conf_password_field').val(),
      privacy: $('input[name="privacy"]:checked').val()
    };

    if (!data.first_name) {
      const errorMessage = await _functions.getLocalizedMessage('FIRST_NAME_REQUIRED', lang);
      setErrorMessage('.register_first_name_field', errorMessage);
      return;
    }

    if (!data.last_name) {
      const errorMessage = await _functions.getLocalizedMessage('LAST_NAME_REQUIRED', lang);
      setErrorMessage('.register_last_name_field', errorMessage);
      return;
    }

    if (!regexEmail.test(data.email)) {
      const errorMessage = await _functions.getLocalizedMessage('INVALID_EMAIL_FORMAT', lang);
      setErrorMessage('.register_email_field', errorMessage);
      return;
    }

    if (!regexPhone.test(data.phone)) {
      const errorMessage = await _functions.getLocalizedMessage('INVALID_PHONE_FORMAT', lang);
      setErrorMessage('.register_phone_field', errorMessage);
      return;
    }

    const passwordError = await _functions.validatePassword(data.password, lang);
    if (passwordError) {
      setErrorMessage('.register_password_field', passwordError);
      return;
    }

    if (data.password !== data.confirm_password) {
      const errorMessage = await _functions.getLocalizedMessage('PASSWORD_MISMATCH', lang);
      setErrorMessage('.register_conf_password_field', errorMessage);
      return;
    }

    if (!data.privacy) {
      const errorMessage = await _functions.getLocalizedMessage('MUST_ACCEPT_PRIVACY_POLICY', lang);
      setErrorMessage('.register_privacy_field', errorMessage);
      let block = $('input[name="privacy"]').closest('.ch-box')
      $(block).addClass('invalid')
      $(block).addClass('custom-terms-invalid');
      return;
    }

    $.ajax({
      type: 'post',
      url: '/auth/register',
      headers: { 'Accept-Language': lang },
      data: { ...data },
      dataType: 'JSON',
      success: function () {
        resetFormAndErrors('#register_popup_form');
        _functions.closePopup();
        _functions.openPopup('reg-is-successful', () => {}, { email: data.email });
      },
      error: async function (data) {
        console.warn(data);
    
        if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.details) {
          data.responseJSON.error.details.forEach(detail => {
            const field = detail.property;
            const message = Object.values(detail.constraints).join('; ');
            setErrorMessage(`.register_${field}_field`, message);
          });
        } else if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          const generalMessage = data.responseJSON.error.message;
          const emailExistsShortError = await _functions.getLocalizedMessage('EMAIL_EXISTS_SHORT', lang);
          const phoneExistsShortError = await _functions.getLocalizedMessage('PHONE_EXISTS_SHORT', lang);

          if (generalMessage.includes(emailExistsShortError)) {
            const emailExistsError = await _functions.getLocalizedMessage('EMAIL_EXISTS', lang);
            setErrorMessage('.register_email_field', emailExistsError);
          } else if (generalMessage.includes(phoneExistsShortError)) {
            const phoneExistsError = await _functions.getLocalizedMessage('PHONE_EXISTS', lang);
            setErrorMessage('.register_phone_field', phoneExistsError);
          } else {
            setFormBlockMessage('#register_popup_form', generalMessage);
          }
        }
      }
    });
  });

  $(document).on('submit', '#verify_popup_form', async function (e) {
    e.preventDefault();
    clearErrorMessages();
    clearFormBlockMessage('#verify_popup_form');

    const lang = _functions.getLanguageFromCookies() || 'uk';
    const data = {
      phone: $('#code_popup_phone').text().trim(),
      code: $(".code-input input")
        .map(function () {
          return $(this).val();
        })
        .get()
        .join(''),
    };

    if (!regexPhone.test(data.phone) || !data.code || data.code.length !== 4) {
      const errorMessage = await _functions.getLocalizedMessage('INVALID_CODE', lang);
      setErrorMessage('.code-input', errorMessage);
      return;
    }

    $.ajax({
      type: 'get',
      url: `/auth/verify-code/${data.phone}/${data.code}`,
      headers: { 'Accept-Language': lang },
      data: data,
      dataType: 'JSON',
      success: function () {
        $(".code-input input").val('');
        _functions.closePopup()
        _functions.openPopup('pass-restore-3', () => { }, { phone: data.phone });
      },
      error: function (data) {
        console.warn(data);
        if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          const generalMessage = data.responseJSON.error.message;
          setFormBlockMessage('#verify_popup_form', generalMessage);
        }
      },
    });
  });

  $(document).on('submit', '#restore_pass_form', async function (e) {
    e.preventDefault();
    clearErrorMessages();
    clearFormBlockMessage('#restore_pass_form');

    const phone = $('.restore_pass_phone').val().replace(/[^\d+]/g, '');
    const lang = _functions.getLanguageFromCookies() || 'uk';

    if (!regexPhone.test(phone)) {
      const errorMessage = await _functions.getLocalizedMessage('INVALID_PHONE_FORMAT', lang);
      setErrorMessage('.restore_pass_phone', errorMessage);
      return;
    }

    $.ajax({
      type: 'post',
      url: '/auth/forgot-password',
      headers: { 'Accept-Language': lang },
      data: { phone },
      dataType: 'JSON',
      success: function () {
        $('.restore_pass_phone').val('');
        _functions.closePopup()
        _functions.openPopup('pass-restore-2', () => { }, { phone: phone });
      },
      error: function (data) {
        console.warn(data);

        if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.details) {
          data.responseJSON.error.details.forEach(detail => {
            const message = Object.values(detail.constraints).join('; ');
            setErrorMessage(`.restore_pass_phone`, message);
          });
        } else if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          const generalMessage = data.responseJSON.error.message;
          setFormBlockMessage('#restore_pass_form', generalMessage);
        }
      },
    });
  });

  $(document).on('click', '#resend_verify_email', async function (e) {
    e.preventDefault();
    clearErrorMessages();
    clearFormBlockMessage('#verify_email_form');

    const phone = $('#code_popup_phone').text().replace(/[^\d+]/g, '');
    const lang = _functions.getLanguageFromCookies() || 'uk';

    if (!regexPhone.test(phone)) {
      const errorMessage = await _functions.getLocalizedMessage('PHONE_FORMAT_ERROR', lang);
      setErrorMessage('.code-input', errorMessage);
      return;
    }

    $.ajax({
      type: 'get',
      url: `/auth/resend-verify-code/${phone}`,
      headers: { 'Accept-Language': lang },
      dataType: 'JSON',
      error: async function (data) {
        console.warn(data);
        if (data && data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          const generalMessage = data.responseJSON.error.message;
          setFormBlockMessage('#verify_email_form', generalMessage);
        }
      },
    });
  });

  $(document).on('submit', '#reset_password_last_form', async function (e) {
    e.preventDefault();
    clearErrorMessages();
    clearFormBlockMessage('#reset_password_last_form');

    const lang = _functions.getLanguageFromCookies() || 'uk';
    let data = {
      new_password: $('.reset_password_filed').val(),
      confirm_new_password: $('.reset_conf_password_filed').val(),
      phone: $('#code_popup_phone').text(),
    }

    const passwordError = await _functions.validatePassword(data.new_password, lang);
    if (passwordError) {
      setErrorMessage('.reset_password_filed', passwordError);
      return;
    }

    if (data.new_password !== data.confirm_new_password) {
      const errorMessage = await _functions.getLocalizedMessage('PASSWORD_MISMATCH', lang);
      setErrorMessage('.reset_conf_password_filed', errorMessage);
      return;
    }

    $.ajax({
      type: 'post',
      url: '/auth/reset-password',
      headers: { 'Accept-Language': lang },
      data: data,
      dataType: 'JSON',
      success: function () {
        resetFormAndErrors('#reset_password_last_form');
        _functions.closePopup();
        _functions.openPopup('pass-is-changed');
      },
      error: async function (data) {
        console.warn(data);

        if (data.responseJSON && data.responseJSON.error && data.responseJSON.error.message) {
          const errorMessage = await _functions.getLocalizedMessage(data.responseJSON.error.message, lang);
          setFormBlockMessage('#reset_password_last_form', errorMessage);
        }
      },
    });
  });
});