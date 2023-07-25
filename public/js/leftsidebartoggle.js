// const res = require("express/lib/response");

//LEFT-SIDEBAR-TOGGLE
$('.left-sidebar-toggle').click(function () {
    console.log('leftsidebar pressed')
    // let leftbar = $('.left-sidebar');
    // leftbar.toggleClass('left-300');

    $('.left-sidebar-logo').css('display', 'none');
    $('.close-menu').css('display', 'none');
    // $('.accordion-button::after').css('width', '100px');
    // $('.main').css('width', '100px');
    // $('.top-navbar').css('width', '100px');

    


    // let main = $('.main')
    // main.toggleClass('left-0');

    // let nav = $('.top-navbar');
    // nav.toggleClass('left-0');

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