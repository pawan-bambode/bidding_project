// const res = require("express/lib/response");



//LEFT-SIDEBAR-TOGGLE

$('.custom-element').on('click', function(){
   $(this).toggleClass('active')
})


$('.left-sidebar-toggle').click(function () {
    console.log('check on click')
    
    $('.accordion-button').toggleClass('active')
    $('.left-sidebar-logo').toggleClass('left-sidebar-logo-side')
    $('.close-menu').toggleClass('close-menu-side')
    $('.left-sidebar').toggleClass('left-sidebar-side')
    $('.top-navbar').toggleClass('top-navbar-side')
    $('.main').toggleClass('main-side')
    $('.left-sidebar-mini-logo').toggleClass('left-sidebar-mini-logo-hide')

    let btn = $('.left-sidebar-toggle');
    btn.toggleClass('left-sidebar-toggle-turn')
})

//NOTIFICATION
var notification = $(".notification-content");

var close = $(".notification-close");

function notify() {
    notification.addClass('notification-active');
    $('.notification-content').css('display', 'flex');
}

$(".notification-close").on('click', function () {
    notification.removeClass('notification-active')
    location.reload();
})

// //ALERT-MODAL
// var alertCancel = $('.alert-cancel');

// function alertMsg() {
//     $('#alertModal').css('display', 'block')
// }

// $('.alert-cancel').on('click', function () {
//     $('#alertModal').css('display', 'none');
// })


//TIMETABLE SESSION

$('.session-name').on('click', function(){

    let ulList = ``;
    let apiObj = {
        type: 'POST',
        url: '/admin/timetable-session/get-timetable-session-list',
        dataType: 'JSON'
    }

    ajaxApi(apiObj).then(result => {
        
        if(result.data.length > 0){
            for(let list of result.data){
                ulList += ` ${list.status == 1 ? `<li class="list-group-item active" data-timetable-session-id=${list.id} data-timetable-session-name=${list.timetable_name}>${list.timetable_name}</li>` : `<li class="list-group-item" data-timetable-session-id=${list.id} data-timetable-session-name=${list.timetable_name}>${list.timetable_name}</li>`}` 
            }
            $('#timetable-session-popup-modal .list-group').html(ulList)
            $('#timetable-session-popup-modal').modal('show')
        }
    }).catch(error => {
        console.log('Error', error)
    })

})

$('#timetable-session-popup-modal .list-group').on('click', '.list-group-item', function(){
    let dataId = $(this).attr('data-timetable-session-id');
    console.log('==', dataId)
    $(".list-group-item").removeClass('active');
    $(`.list-group-item[data-timetable-session-id = ${dataId}]`).addClass('active');

})

$('#update_status').on('click', function(){
    let jsonArr = [];
    let timetableLid = $('#timetable-session-popup-modal .list-group').find('li.active').attr('data-timetable-session-id');
    let timetableName = $('#timetable-session-popup-modal .list-group').find('li.active').attr('data-timetable-session-name');

    let obj = {
        timetableLid : timetableLid,
        timetableName : timetableName
    }

    jsonArr.push(obj);

    let apiObj = {
        type: 'POST',
        url: '/admin/timetable-session/update-timetable-session-status',
        data: {
            inputJSON : JSON.stringify(jsonArr)
        },
        dataType: 'JSON'
    }

    ajaxApi(apiObj).then(result => {
        console.log('==', result)
        showSuccess(result)
    }).catch(error => {
        console.log('Error', error)
    })
})

$('body').on('mouseover', '.left-sidebar-side', function(){
    $('.accordion-button').toggleClass('active')
    $('.left-sidebar-logo').toggleClass('left-sidebar-logo-side')
    $('.close-menu').toggleClass('close-menu-side')
    $('.left-sidebar').toggleClass('left-sidebar-side')
    $('.top-navbar').toggleClass('top-navbar-side')
    $('.main').toggleClass('main-side')
    $('.left-sidebar-mini-logo').toggleClass('left-sidebar-mini-logo-hide')
})

$('body').on('mouseout', '.left-sidebar', function(){
   console.log('when mouse out')
})


$('body').on('click', '.update-password', function(e) {
    e.preventDefault();

    console.log('when click ==modal')
    $('#update-password-modal').modal('show')
});


$('body').on('click', '#check-password-btn', function() {

    let oldPass = $('#student-old-password').val();
    let userName = $('#student-user-id').val();
    
    //if(oldPass.length >= 8) {
        let apiObj = {
            type: 'POST',
            url: '/admin/check-old-password',
            data: {
                oldPass: oldPass,
                userName: userName
            },
            dataType: 'JSON'
        }

        ajaxApi(apiObj).then(result => {
            if (result.verifiedStatus == true) {
                $('.confirm-pass').css('display', 'block');
                $('.new-pass').css('display', 'block');
                $('#check-password-btn').css('display', 'none');
                $('#update-password-btn').css('display', 'block');

            }
        })
    //}
})


$('body').on('click', '#update-password-btn', function() {

    let userName = $('#student-user-id').val();
    let newPassword = $('#student-new-password').val();
    let confirmPassword = $('#student-confirm-password').val();

    if(newPassword === confirmPassword ) {
        let apiObj = {
            type: 'POST',
            url: '/admin/update-student-password',
            data: {
                userName: userName,
                newPassword : newPassword
            },
            dataType: 'JSON'
        }
    
        ajaxApi(apiObj).then(result => {
            if (result.status == 'S'){
                alert('Password updated successfully ..!');
                $('#update-password-modal').modal('hide')
            } else {
                alert('Something went wrong ..')
            }
        })
    } else {
        alert('New password and confirm password not matched..');
        $('#student-new-password').val('');
        $('#student-confirm-password').val('');
    }

})


function showSuccess(errors) {
    console.log(errors);
    let simpleAlert = new SimpleAlert();
    let obj = {
        title: errors.description,
        message: "",
        type: 'alert-success',
        buttons: {
            positive: {
                text: "Okay",
                action: function () {
                    document.querySelector('.simple-alert').remove();
                }
            },
            negative: {
                text: "Cancel",
                action: function () {
                    alert('Negative')
                }
            }
        }
    }
    simpleAlert.alert(obj);
}


$(document).ready(function(){
    $('.toggle-plus-minus').on('click',function(){
       let parent = $(this).closest('.plus-button');
        $(this).find('i').toggleClass('fa-plus fa-minus');

        if($(this).find('i').hasClass('fa-minus')){
            parent.find('.sub-menu').removeClass('d-none');
        }
        else{
            parent.find('.sub-menu').addClass('d-none');
        }
       });

     $('.sub-menu-list').on('click',function(){
        $('.sub-menu').find('.right-arrow').addClass('d-none');
        $(this).find('.right-arrow').removeClass('d-none');
        
     })  
  })
  