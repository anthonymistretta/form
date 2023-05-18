$(document).ready(function() {
  // Rates
  var stripeRate = 0.034;
  var stripeCost = 0.3;
  var revolv3ApprovalRate = 0.15;
  var revolv3RevenueRate = 0.023;

  $('#calculator-form').submit(function(event) {
    // Inputs
    var revenue = $('#revenue').val();
    var transactions = $('#transactions').val();
    var approvals = $('#approvals').val();
    // Processing
    var stripeTotalCost = ((revenue * stripeRate) + (transactions * stripeCost));
    var revolv3TotalCost = ((approvals * revolv3ApprovalRate) + (revenue * revolv3RevenueRate));
    // Results
    var result =  stripeTotalCost - revolv3TotalCost;
    var savings = Math.round(100*result)/100;
    // Add values to calculator lead form to send to hubspot
    $('#savings-input').val(savings);
    $('#revenue-input').val(revenue);
    $('#transactions-input').val(transactions);
    $('#approvals-input').val(approvals);
    $('#revolv3-cost-input').val(revolv3TotalCost);
    $('#gated-modal').show();
    return false;
  });

  $('#lead-submit').click(function(){
    var email = $('#Company-Email').val();
    var domain = email.substring(email.indexOf('@') + 1);
    $('#domain-input').val(domain);
    if(isEmail(email)==false){
      return false;
    }
  });
  
  function isEmail(email) {
    var regex = /^[a-zA-Z0-9._%+-]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!live.com)(?!outlook.com)[a-zA-Z0-9_-]+.[a-zA-Z0-9-.]{2,61}$/;
    if(!regex.test(email)) {
      alert('Please enter a business email');
      return false;
    } else {
      return true;
    }
  }

  $('#calculator-lead-form').submit(function() {
    parent.children(".w-form-done").css("display", "block");
    $('#gated-modal').hide();
  });
});
