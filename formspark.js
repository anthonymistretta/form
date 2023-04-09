$('form[action^="https://submit-form.com"]').each(function (i, el) {
  // -Basic Setup
  var form = $(el);
  var submitButtonTarget = form.find("[type=submit]");
  var submitButtonTrigger = form.find("a");
  submitButtonTarget.css("display", "none");
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
  function loaderShow () {
    submitButtonTrigger.addClass(buttonClass);
  }
  function loaderHide () {
    submitButtonTrigger.removeClass(buttonClass);
  }
  
  $(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
  });

  submitButtonTrigger.click(function(){
    submitButtonTarget.click();
    var counter = 0;
    requiredFields.each(function() {
      if (this.checkValidity() == false) {
        counter++;
      }
    })
    if (counter == 0) {
        loaderShow();
        inputPageUrl.val(window.location);
        inputFormName.val(form.attr("data-name"));
        inputEmailFrom.val(emailFrom);
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
        setTimeout(function () {
          submitButtonTrigger.attr("disabled", true).css('cursor', 'not-allowed');
          submitButtonTarget.attr("disabled", true).css('cursor', 'not-allowed');
        }, 100);
      }
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
              loaderHide();
            } else {
              parent.children(".w-form-done").css("display", "block");
              loaderHide();
            }
          },
          error: function () {
            var parent = $(form.parent());
            parent.find(".w-form-fail").css("display", "block");
            loaderHide();
          },
        });
      })
      .catch(function () {
        var parent = $(form.parent());
        parent.find(".w-form-fail").css("display", "block");
        loaderHide();
      });
    }); 
  });
