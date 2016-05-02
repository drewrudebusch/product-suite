$(document).ready(function() {

  $('body').on('shown.bs.modal', '#login-modal', function () {
      $('input:visible:enabled:first', this).focus();
  })

  $('#signup-form input[name="email"]').blur(function () {
      var email = $(this).val();
      var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
    if (re.test(email) || email.length === 0) {
      $('#username-error').addClass('hidden')
    } else {
      $('#username-error').removeClass('hidden')
    }
  });

  $('#signup-form input[name="password"]').blur(function () {
      var password = $(this).val();
    if (password.length > 8 || password.length === 0) {
      $('#password-error').addClass('hidden')
    } else {
      $('#password-error').removeClass('hidden')
    }
  });

  $('#upload-products').on('click', function(event) {
    $(this).addClass('hidden');
    $('#file-input').removeClass('hidden');
  })
  $('#cancel-upload').on('click', function(event) {
    $('#file-input').addClass('hidden');
    $('#upload-products').removeClass('hidden');
  })

  $('#delete-products').on('click', function(event) {
    var itemsSelected = $(':checkbox:not(#selectAll):checked')
      var itemsToDelete = [];
      for (var i = 0; i < itemsSelected.length; i++) {
        itemsToDelete.push(Number(itemsSelected[i].id));
      }
      console.log(itemsToDelete);
      $.ajax({
          url: '/delete',
          type: 'POST',
          data: {itemsToDelete},
          success: function(){
           console.log("success");
            location.reload();
          },
          error: function(){
            window.location.replace("/error")
          }
        })
        .always(function() {
          console.log("complete");
        });
  })

  $(function(){
      var checkboxes = $(':checkbox:not(#selectAll)').click(function(event){
          $('#delete-products').removeClass('disabled');
          $('#delete-products').prop("disabled", checkboxes.filter(':checked').length == 0);
      });
      
      $('#selectAll').click(function(event) {  
          $('#delete-products').removeClass('disabled'); 
          checkboxes.prop('checked', this.checked);
          $('#delete-products').prop("disabled", !this.checked)
      });
  });
});

function loadFile(event) {
    alasql.promise('SELECT * FROM FILE(?,{headers:true})',[event],function(data){
      }).then(function(data){
        console.log(data);
        $.ajax({
          url: '/upload',
          type: 'POST',
          data: {data},
          success: function(){
            console.log("success");
            location.reload();
          },
          error: function(){
            window.location.replace("/error")
          }
        })
        .always(function() {
          console.log("complete");
        });
      })
  };