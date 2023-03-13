
$('form[action^="https://submit-form.com"]').each(function (i, el) {
  // Basic Setup
  var form = $(el);
  var submitTarget = form.find("[type=submit]");
  var submitButton = form.find("a");
  var buttonClass = "button-loading";
  var botpoisonPublicKey = form.attr("botpoison");
  var redirectUrl = form.attr("redirect");
  // Requred Inputs
  var requiredFields = form.find($('input,textarea,select')).filter('[required]:visible')
  // Inputs used in email subject line
  var inputFirstName = form.find("[name='first-name']");
  var inputLastName = form.find("[name='last-name']");
  // Optional Input Fields
  var inputSubject = form.find("[name='_email.subject']");
  var pageUrl = form.find("#page-url-input");
  var formName = form.find("#form-name-input");

  submitButton.click(function(){
    requiredFields.each(function() {
      if (this.checkValidity() == false ) {
        submitButton.removeClass(buttonClass);
        submitButton.attr("disabled", false);
        submitTarget.attr("disabled", false);
      } else {
        submitButton.addClass(buttonClass);
        var subject = "New Website Form Submission:  " + inputFirstName.val() + " " + inputLastName.val();
        inputSubject.val(subject);
        pageUrl.val(window.location);
        formName.val(form.attr("data-name")); 
        function disable() {
          submitButton.attr("disabled", true);
          submitTarget.attr("disabled", true);
        }
        setTimeout(disable, 1000);
      }
    });
  });

  form.submit(function (e) {
    e.preventDefault();
    form = $(e.target);
    var action = form.attr("action");
    var botpoison = new Botpoison({
      publicKey: botpoisonPublicKey,
    });
    botpoison
      .challenge()
      .then(function (result) {
        var data = form.serialize();
        data += "&_botpoison=" + result.solution;
        $.ajax({
          url: action,
          method: "POST",
          data: data,
          dataType: "json",
          success: function () {
            var parent = $(form.parent());
            parent.children("form").css("display", "none");
            if ( redirectUrl == undefined || redirectUrl == false ) {
              parent.children(".w-form-done").css("display", "block");
              submitButton.removeClass(buttonClass);
            } else {
              window.location.href = redirectUrl;
              submitButton.removeClass(buttonClass);
            }
          },
          error: function () {
            var parent = $(form.parent());
            parent.find(".w-form-fail").css("display", "block");
            submitButton.removeClass(buttonClass);
          },
        });
      })
      .catch(function () {
        var parent = $(form.parent());
        parent.find(".w-form-fail").css("display", "block");
        submitButton.removeClass(buttonClass);
      });
    }); 
  });