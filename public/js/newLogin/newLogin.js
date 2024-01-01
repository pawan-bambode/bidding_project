$(document).ready(function () {
    
    $('#show_password').click(function() {
        let val = $('#password').val();
        
        if(val === '' || val == undefined){
            $(this).parent().addClass('border-danger');
            $(this).prev().attr('placeholder','password not enter');   
        }
        
        const passwordField = $('#password');
        const passwordFieldType = passwordField.attr('type');

        if (passwordFieldType === 'password') {
            passwordField.attr('type', 'text');
        } else {
            passwordField.attr('type', 'password');
        }
    });
    $('.user_type').click(function(){
        $("#show_password").parent().removeClass('border-danger');
        $('#show_password').prev().css('color','none');
        
        let user_type = $(this).hasClass('student');
        if(user_type){
            $("#username").attr('placeholder','student@school.org');
            $("#password").val("student@123");
        }
        else{
          $("#username").attr('placeholder','admin@school.org');
          $("#password").val("admin@123");
        }
    })
});