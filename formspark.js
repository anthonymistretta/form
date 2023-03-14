
$('form[action^="https://submit-form.com"]').each(function (i, el) {
  // Basic Setup
  var form = $(el);
  var submitTarget = form.find("[type=submit]");
  var submitButton = form.find("a");
  var buttonClass = "button-loading";
  var requiredFields = form.find($('input,textarea,select')).filter('[required]:visible')
  // Required Attributes
  var botpoisonPublicKey = form.attr("ec-botpoison");
  // Optional Attributes
  var redirectUrl = form.attr("ec-redirect");
  var emailFrom = form.attr("ec-email-from");
  var subjectLine = form.attr("ec-email-subject");
  var inputName1 = form.attr("ec-subject-var1");
  var inputName2 = form.attr("ec-subject-var2");
  // Optional Inputs
  var inputEmailFrom = form.find("[name='_email.from']");
  var inputSubject = form.find("[name='_email.subject']");
  var inputPageUrl = form.find("[name='Page URL']");
  var inputFormName = form.find("[name='Form Name']");

  submitButton.click(function(){
    requiredFields.each(function() {
      if (this.checkValidity() == false ) {
        submitButton.removeClass(buttonClass);
        submitButton.attr("disabled", false);
        submitTarget.attr("disabled", false);
      } else {
        submitButton.addClass(buttonClass);
        inputPageUrl.val(window.location);
        inputFormName.val(form.attr("data-name")); 
        // Set subject line
        if (inputName2) {
          var subjectVar1 = form.find("[data-name='" + inputName1 + "']").val();
          var subjectVar2 = form.find("[data-name='" + inputName2 + "']").val();
          inputSubject.val(subjectLine + " " + subjectVar1 + " " + subjectVar2);
        } else if (inputName1) {
          var subjectVar1 = form.find("[data-name='" + inputName1 + "']").val();
          inputSubject.val(subjectLine + " " + subjectVar1 );
        } else {
          inputSubject.val(subjectLine);
        }
        // Set email from
        inputEmailFrom.val(emailFrom);
        setTimeout(function () {
          submitButton.attr("disabled", true);
          submitTarget.attr("disabled", true);
        }, 1000);
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
            if (redirectUrl) {
              window.location.href = redirectUrl;
              submitButton.removeClass(buttonClass);
            } else {
              parent.children(".w-form-done").css("display", "block");
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
