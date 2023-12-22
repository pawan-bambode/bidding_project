$(document).on('click', '.fa-angles-left', function() {
    $('.left-sidebar').addClass('hide');
    $('.main').css('left', '80px');
    $('.top-navbar').css('left', '80px');
    $('.nmims-logo').addClass('d-none');
    $('.nmims-logo-small').removeClass('d-none');
    $(this).removeClass('fa-angles-left').addClass('fa-angles-right');
    $('.left-sidebar .side-menu li img').css('margin-left','0px');
});

$(document).on('click', '.fa-angles-right', function() {
    $('.left-sidebar').removeClass('hide');
    $('.main').css('left', '260px');
    $('.top-navbar').css('left', '260px');
    $('.nmims-logo').removeClass('d-none');
    $('.nmims-logo-small').addClass('d-none');
    $(this).addClass('fa-angles-left').removeClass('fa-angles-right');
    $('.left-sidebar .side-menu li img').css('margin-left','5px');
})

$('.session-name').on('click', function(){

    let ulList = ``;
    let apiObj = {
        type: 'POST',
        url: '/admin/bidding-session/get-bidding-session-list',
        dataType: 'JSON'
    }

    ajaxApi(apiObj).then(result => {
        if(result.data.length > 0){
            for(let list of result.data){
                ulList += ` ${list.status == 1 ?
                     `<li class="list-group-item active" data-bidding-session-id=${list.id} data-bidding-session-name=${list.bidding_name}  >${list.bidding_name}</li>` : `<li class="list-group-item" data-bidding-session-id=${list.id} data-bidding-session-name=${list.bidding_name}>${list.bidding_name}</li>`}` 
            }
            $('#bidding-session-popup-modal .list-group').html(ulList)
            $('#bidding-session-popup-modal').modal('show')
        }
    }).catch(error => {
        console.log('Error', error)
    })

})

$('#bidding-session-popup-modal .list-group').on('click', '.list-group-item', function(){
    let dataId = $(this).attr('data-bidding-session-id');

    $(".list-group-item").removeClass('active');
    $(`.list-group-item[data-bidding-session-id = ${dataId}]`).addClass('active');

})

$('#update-status').on('click', function(){
    let jsonArr = [];
    let biddingSessionLid = $('#bidding-session-popup-modal .list-group').find('li.active').attr('data-bidding-session-id');
    let biddingName = $('#bidding-session-popup-modal .list-group').find('li.active').attr('data-bidding-session-name');
    
    let apiObj = {
        type: 'POST',
        url: '/admin/bidding-session/update-bidding-session-status',
        data: {
            id:biddingSessionLid,
            bidding_name:biddingName
        },
        dataType: 'JSON'
    }

    ajaxApi(apiObj).then(result => {
        showSuccess(result)
    }).catch(error => {
        console.log('Error', error)
    })
})

$('body').on('click', '.update-password', function(e) {
    e.preventDefault();
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
                //$('.old-pass').css('display', 'none')
            } 
        })
    //}
})


$('body').on('click', '#update-password-btn', function() {

    let userName = $('#student-user-id').val();
    let newPassword = $('#student-new-password').val();
    let confirmPassword = $('#student-confirm-password').val();

    if(newPassword === confirmPassword && newPassword != '' && confirmPassword != '') {
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
            if (result.status == 'S') {
                alert('Password updated successfully ..!');
                $('#update-password-modal').modal('hide')
                $('#student-new-password').val('');
                $('#student-confirm-password').val('');
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

function showError(errors) {
    let simpleAlert = new SimpleAlert();
    let obj = {
        title : errors,
        message: "",
        type: 'alert-danger',
        buttons: {
            positive:{
                text: "Yes",
                action: function(){
                    document.querySelector('.simple-alert').remove();
                }
            },
            negative: {
                text: "NO",
                action: function () {
                alert('Negative')
                }
            }
        }
    }
    simpleAlert.alert(obj);
}

function IsNumber(inputString) {
    let isNumber = false;
    for (let i = 0; i < inputString.length; i++) {
    const charCode = inputString.charCodeAt(i);
    if (charCode >= 48 && charCode <= 57) {
        isNumber = true;
    }else{
        isNumber = false;
    }
    }
    return isNumber;
}


  