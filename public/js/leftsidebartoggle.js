$('.top-navbar').on('click', '.fa-angles-left', function() {
    $('.left-sidebar').addClass('hide');
    $('.main').css('left', '80px');
    $('.top-navbar').css('left', '80px');
    $('.student-footer').css('left', '80px');
    $('.nmims-logo').addClass('d-none');
    $('.nmims-logo-small').removeClass('d-none');
    $(this).removeClass('fa-angles-left').addClass('fa-angles-right');
    $('.left-sidebar .side-menu li img').css('margin-left','0px');
});

$('.top-navbar').on('click', '.fa-angles-right', function() {
    $('.left-sidebar').removeClass('hide');
    $('.main').css('left', '260px');
    $('.top-navbar').css('left', '260px');
    $('.student-footer').css('left', '260px');
    $('.nmims-logo').removeClass('d-none');
    $('.nmims-logo-small').addClass('d-none');
    $(this).addClass('fa-angles-left').removeClass('fa-angles-right');
    $('.left-sidebar .side-menu li img').css('margin-left','5px');
})


$('.hamburger-smalldevices').on('click', function() {
    $('.left-sidebar').toggleClass('left-sidebar-open')
})


function delay(callback, ms) {
    var timer = 0;
    return function () {
        var context = this;
        var    args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            callback.apply(context, args);
        }, ms || 0);
    };
}

$('.session-name').on('click', function () {
    let ulList = ``;
    let apiObj = {
        type: 'POST',
        url: '/admin/bidding-sessions/active',
        dataType: 'JSON'
    };

    ajaxApi(apiObj).then(result => {
        if (result.data.length > 0) {
            for (let list of result.data) {
                ulList += `${list.status == 1 ?
                    `<li class="list-group-item active" data-bidding-session-id=${list.id} data-bidding-session-name=${list.bidding_name}>${list.bidding_name}</li>` :
                    `<li class="list-group-item" data-bidding-session-id=${list.id} data-bidding-session-name=${list.bidding_name}>${list.bidding_name}</li>`}`;
            }
            $('#bidding-session-popup-modal .list-group').html(ulList);
            $('#bidding-session-popup-modal').modal('show');
        }
    }).catch(error => {});

});

$('#bidding-session-popup-modal .list-group').on('click', '.list-group-item', function () {
    let dataId = $(this).attr('data-bidding-session-id');

    $(".list-group-item").removeClass('active');
    $(`.list-group-item[data-bidding-session-id=${dataId}]`).addClass('active');
});

$('#update-status').on('click', function () {
    let biddingSessionLid = $('#bidding-session-popup-modal .list-group').find('li.active').attr('data-bidding-session-id');
    let biddingName = $('#bidding-session-popup-modal .list-group').find('li.active').attr('data-bidding-session-name');

    let apiObj = {
        type: 'POST',
        url: '/admin/bidding-sessions/update-status',
        data: {
            id: biddingSessionLid,
            bidding_name: biddingName
        },
        dataType: 'JSON'
    };

    ajaxApi(apiObj).then(result => {
        createToastMessage(result.description);
    }).catch(error => {});
});

$('body').on('click', '.update-password', function (e) {
    e.preventDefault();
    $('#update-password-modal').modal('show');
});

$('body').on('click', '#check-password-btn', function () {
    let oldPass = $('#student-old-password').val();
    let userName = $('#student-user-id').val();

    let apiObj = {
        type: 'POST',
        url: '/admin/student-data/check-old-password',
        data: {
            oldPass: oldPass,
            userName: userName
        },
        dataType: 'JSON'
    };

    ajaxApi(apiObj).then(result => {
        if (result.verifiedStatus == true) {
            $('.confirm-pass').css('display', 'block');
            $('.new-pass').css('display', 'block');
            $('#check-password-btn').css('display', 'none');
            $('#update-password-btn').css('display', 'block');
        }
    });
});

$('body').on('click', '#update-password-btn', function () {
    let userName = $('#student-user-id').val();
    let newPassword = $('#student-new-password').val();
    let confirmPassword = $('#student-confirm-password').val();

    if (newPassword === confirmPassword && newPassword != '' && confirmPassword != '') {
        let apiObj = {
            type: 'POST',
            url: '/admin/student-data/update-password',
            data: {
                userName: userName,
                newPassword: newPassword
            },
            dataType: 'JSON'
        };

        ajaxApi(apiObj).then(result => {
            if (result.status == 'S') {
                alert('Password updated successfully ..!');
                $('#update-password-modal').modal('hide');
                $('#student-new-password').val('');
                $('#student-confirm-password').val('');
            } else {
                alert('Something went wrong ..');
            }
        });
    } else {
        alert('New password and confirm password not matched..');
        $('#student-new-password').val('');
        $('#student-confirm-password').val('');
    }
});

function showSuccess(errors) {
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
                    alert('Negative');
                }
            }
        }
    };
    simpleAlert.alert(obj);
}

function showError(errors) {
    let simpleAlert = new SimpleAlert();
    let obj = {
        title: errors,
        message: "",
        type: 'alert-danger',
        buttons: {
            positive: {
                text: "Yes",
                action: function () {
                    document.querySelector('.simple-alert').remove();
                }
            },
            negative: {
                text: "NO",
                action: function () {
                    alert('Negative');
                }
            }
        }
    };
    simpleAlert.alert(obj);
}

function paginationData(rowCount, totalCount) {
    let pageNos = Math.ceil(Number(totalCount) / Number(rowCount));

    $('#pagination').bootpag({
        total: pageNos,
        page: 1,
        maxVisible: 10,
        leaps: true,
        firstLastUse: true,
        first: '←',
        last: '→',
        wrapClass: 'pagination',
        activeClass: 'active',
        disabledClass: 'disabled',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first'
    }).on("page", function (event, num) {});
}

function IsNumber(inputString) {

    let isNumber = false;
    for (let i = 0; i < inputString.length; i++) {
        const charCode = inputString.charCodeAt(i);
        if (charCode >= 48 && charCode <= 57) {
            isNumber = true;
        } else {
            isNumber = false;
        }
    }
    return isNumber;
}


function withdrawBidding(arr, key, credits) {
    if (arr[key]) {
        if (arr[key].frequency > 1) {
            let totalCredits = arr[key].totalCredits;
            arr[key].frequency--;
            arr[key].totalCredits = Number(totalCredits) - Number(credits);
        } else {
            delete arr[key];
        }
    }
    return Object.values(arr);
}

function resetBiddingTrimester(classToRemove) {
    let prevSelected = $(`.${classToRemove}`);
    prevSelected.removeClass(`${classToRemove}`);
}

function selectBiddingTrimester(element, classToAdd, activeElement) {
    element.addClass(classToAdd);
    element.css(`--${activeElement}`, element.innerHeight() + 'px');
}

function arrangeTableId(tableId) {
    $(`#${tableId} tbody tr`).each((index, elem) => {
        $(elem).find('td:first-child').html(++index);
    });
}

function updateCreditsPointTargets(trimesterWiseTargetCreditPoints) {
    $('.credits-point-target').each((index, element) => {
        const elementId = $(element).data('id');
        const targetCredit = trimesterWiseTargetCreditPoints[elementId]?.max_credits;
        if (targetCredit !== undefined) {
            $(element).text(targetCredit);
        }
    });
}

function updateCurrentPointTargets(trimesterWiseTargetCreditPoints,flag) {
    $('.current-credit-points').each((index, element) => {
        const elementId = $(element).data('id');
        const targetCredit = trimesterWiseTargetCreditPoints[`${elementId}`];
        const elementValue = Number($(element).text());
        if (targetCredit != 0) {
            $(element).text(elementValue - Number(targetCredit));
        }
    });
}

function createToastMessage(message) {
    const successAlert = `
        <div class="toast-message alert alert-success bottom-0 end-3">
            <div class="header d-flex justify-content-between align-item-center">
                <h4 class="d-flex align-item-center"><i class="fa-solid fa-circle-exclamation me-3"></i> <p class="title">${message}</p></h4>
            </i>
            </div>
            <div class="body">
                <ul>
                   
                </ul>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', successAlert);

    setTimeout(() => {
        $('.toast-message').remove();
        $('#add-bidding-session').modal('hide');
        $('#sidebar').removeClass('d-none');
        location.reload();
    }, 1000);
    
    return {
        remove: function() {
            $('.toast-message').remove();
        }
    };
}
function createToastError(message) {
   
    let errorMessage = message.replace(/^"(.*)"$/, '$1');
    const errorAlert = `
        <div class="toast-message alert alert-danger bottom-0 end-3">
            <div class="header d-flex justify-content-between align-item-center">
                <h4 class="d-flex align-item-center"><i class="fa-solid fa-circle-exclamation me-3"></i> <p class="title">${errorMessage}</p></h4>
            </i>
            </div>
            <div class="body">
                <ul>
                   
                </ul>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', errorAlert);

    setTimeout(() => {
        $('.toast-message').remove();
        $('#add-bidding-session').modal('hide');
        $('#sidebar').removeClass('d-none');
        // location.reload();
    },2500);
    
    return {
        remove: function() {
            $('.toast-message').remove();
        }
    };
}

function filterTable(tableId, id) {
    
    $('#' + tableId + ' tbody tr:visible').each(function () {
        $(this).children(':first-child').text((id++));
    });
}

function createToast(message, className, contentColorClassName) {
    const toastDiv = document.createElement('div');
    toastDiv.className = `position-fixed top-80 right-0 toast-alert ${className}`;

    toastDiv.innerHTML = `
        <div>
            <div class="d-flex p-2">
                <div class="${contentColorClassName}">${message}</div>
                <button type="button" class="btn-close toast-close-button"></button>
            </div>
        </div>`;
    document.body.appendChild(toastDiv);

    setTimeout(() => {
        toastDiv.classList.add('d-none'); 
    }, 1000);
}

function applyOddRowStyles(element, rowIndex) {
    if (rowIndex % 2 == 0) {
        element.addClass('odd-row');
        element.closest('tbody').prev('thead').find('th').addClass('odd-row');
    }
}



function formatDate(todayDateVal, flag, noOfMonthBeforeActivity) {
    const padZero = (num) => (num < 10 ? '0' + num : num);

    const fullYear = todayDateVal.getFullYear();
    const date = padZero(todayDateVal.getDate());
    const month = todayDateVal.getMonth() + 1;
    const formatMonth = padZero(month);

    const minDate = `${fullYear}-${formatMonth}-${date}`;

    const targetInput = flag ? '#add-bidding-session #end-date' : '#add-bidding-session #start-date';

    $(targetInput).attr('min', minDate);
    $('#add-bidding-session #end-date').attr('min', minDate);
    $('#add-bidding-session #start-date').attr('min', minDate);
    $('#update-modal #start-date').attr('min', minDate);
    $('#update-modal #end-date').attr('min',minDate);

}
function dateTimeLocal(){

    const padZero = (num) => (num < 10 ? '0' + num : num);
    let currentDate = new Date();
    const fullYear = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const formatMonth = padZero(month);
    const date = padZero(currentDate.getDate());
    const hours = padZero(currentDate.getHours());
    const minutes = padZero(currentDate.getMinutes());


    const minDate = `${fullYear}-${formatMonth}-${date}T${hours}:${minutes}`;
    $('#add-date-time-modal #start-date-time').attr('min', minDate);
    $('#add-date-time-modal #end-date-time').attr('min', minDate);
}

function isSessionDuplicate(sessionVal) {
    let returnValue = false;

    if (sessionVal != 0) {
        if ($(`#add-bidding-session #temp-bidding-session-details .session-td .add-acad-session-in-bidding span[data-sessionLid="${sessionVal}"]`).length > 0) {
            returnValue = true;
        }
    } else {
        $(`#add-bidding-session #temp-bidding-session-details .session-td .add-acad-session-in-bidding span[data-sessionLid]`).each((index1, ele1) => {
            return $(`#add-bidding-session #academic-session option`).each((index2, ele2) => {
                if ($(ele1).attr('data-sessionLid') == $(ele2).val()) {
                    returnValue = true;
                }
            });
        });
    }

    return returnValue;
}

function setActiveMenuItem(active) {
    $('#sidebar .side-menu li.' + active).addClass('active');
}


function calculateAreaFrequency(arr) {
    
    let areaFrequency = {};
    arr.forEach((obj) => {
        let area = obj.area;
        if (areaFrequency[area]) {
            areaFrequency[area].name = area;
            areaFrequency[area].frequency++;
            areaFrequency[area].totalCredits += obj.credit;
        } else {
            areaFrequency[area] = {
                frequency: 1,
                totalCredits: obj.credit,
                name: area
            };
        }
    });
    return areaFrequency;
}

let completeAreaArray = [];

function calculateCompletedArea(arr, minCredits) {
   
    let areaFrequency = {};
    arr.forEach((obj) => {
        
        let area = obj.area;
        if (areaFrequency[area]) {
            areaFrequency[area].frequency++;
            areaFrequency[area].totalCredits += obj.credit;
        } else {
            areaFrequency[area] = {
                frequency: 1,
                totalCredits: obj.credit,
                name: area
            };
        }
    });

    let completeAreaArray = [];
    let keys = Object.keys(areaFrequency);
    keys.forEach(key => {
        if (areaFrequency[key].totalCredits >= minCredits) {
            completeAreaArray.push(areaFrequency[key]); 
        }
        
    });

    
    let maxTotalCreditsObject = completeAreaArray.reduce((maxObj, obj) => {
        return obj.totalCredits > maxObj.totalCredits ? obj : maxObj;
    }, completeAreaArray);
    
    return maxTotalCreditsObject;
}

$('#searchkeyword-button').on('click', function () {
    $('#searchkeyword').focus();
});

function isModalFieldEmpty(modalName) {
    let isValid = true;
    
    $(`${modalName}`).find('.empty').each(function () {
        let inputValue;
        let rowDiv = $(this).hasClass('row');
        if (rowDiv) {
            $(this).children().each(function () {
                let inputElement = $(this).find('.is-empty');
                if (inputElement.prop('nodeName') === 'INPUT') {
                    inputValue = inputElement.val();
    
                    if (inputValue == '' || inputValue == undefined) {
                        let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                        $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} is Empty!`);
                        $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                        
                        isValid = false;
                        return false;
                    } else {
                        if(!$(this).hasClass('d-none')) {
                        $(this).find('.is-empty ~ span.is-in-valid').html('');
                        $(this).find('.is-empty ~ span.is-in-valid').addClass('d-none');
                            
                        if ($(this).find('input').hasClass('is-number')) {
                            let inputValue = $(this).find('.is-number').val();
                            let isNumbers = isNumber(inputValue);
                           
                            if (isNumbers) {
                                let message = (parseFloat(inputValue) < 0);

                                if (message) {
                                    let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                                    $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} Not Allow Negative Number!`);
                                    $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                                    isValid = false;
                                    return false;
                                }
                           
                                if((parseFloat(inputValue) == 0)){
                                    let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                                    $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} Not Allow Zero!`);
                                    $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                                    isValid = false;
                                    return false;
                                }
                                    

                            }

                            if (!isNumber(inputValue)) {
                                let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                                $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} is Allow Only Number!`);
                                $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                                isValid = false;
                                return false;
                            } else {
                                $(this).find('.is-empty ~ span.is-in-valid').html('');
                                $(this).find('.is-empty ~ span.is-in-valid').addClass('d-none');
                            }
                          }  }
                    }
                } else {
                    if(inputElement.parent('div').hasClass('d-none')){
                        return true;
                      }
                      
                   }
            });
        } else {
            let inputElement = $(this).find('.is-empty');
            inputValue = inputElement.val();
            if (inputValue == '' || inputValue == undefined) {
                let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} is Empty!`);
                $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                isValid = false;
                return false;
            } else {
                $(this).find('.is-empty ~ span.is-in-valid').html('');
                $(this).find('.is-empty ~ span.is-in-valid').addClass('d-none');

                if ($(this).find('input').hasClass('is-number')) {
                    let inputValue = $(this).find('.is-number').val();
                    let isNumbers = isNumber(inputValue);

                    if (isNumbers) {
                        let message = (parseFloat(inputValue) < 0);

                        if (message) {
                            let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                            $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} Not Allow Negative Number!`);
                            $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                            isValid = false;
                            return false;
                        }
                        
                        if((parseFloat(inputValue) == 0)){
                            let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                            $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} Not Allow Zero!`);
                            $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                            isValid = false;
                            return false;
                        }
                        
                    }
                    if (!isNumber(inputValue)) {
                        let prevElement = $(this).find('.is-empty').prev().text().replace(':', '');
                        $(this).find('.is-empty ~ span.is-in-valid').html(`${prevElement} is Allow Only Number!`);
                        $(this).find('.is-empty ~ span.is-in-valid').removeClass('d-none');
                        isValid = false;
                        return false;
                    } else {
                        $(this).find('.is-empty ~ span.is-in-valid').html('');
                        $(this).find('.is-empty ~ span.is-in-valid').addClass('d-none');
                    }
                }
               
            }
        }
    });

    return isValid;
}


function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}


function validateAlphanumeric(inputStr) {
    var pattern = /^[a-zA-Z]*[a-zA-Z0-9]+[a-zA-Z]*$/;
    if (pattern.test(inputStr) && /[a-zA-Z]/.test(inputStr)) {
        return true;
    } else {
        return false;
    }
}

function calculateAcadSessionTotals(data) {
    
    const dataArray = Object.values(data);
    const acadSessionTotals = {};
    dataArray.forEach(item => {
        if (!acadSessionTotals[item.acadSession]) {
            acadSessionTotals[item.acadSession] = { frequency: 0, acadSession: item.acadSession, totalCredits: 0 };
        }
        acadSessionTotals[item.acadSession].frequency += item.frequency;
        acadSessionTotals[item.acadSession].totalCredits += item.totalCredits;
    });

    const acadSessionTotalsArray = Object.values(acadSessionTotals);

    return acadSessionTotalsArray;
}

function getHighestTotalCreditsBySession(acadSessionTotalsArray) {
    let highestCreditsBySession = {};

    acadSessionTotalsArray.forEach(obj => {
        if (!highestCreditsBySession.hasOwnProperty(obj.acadSession) || highestCreditsBySession[obj.acadSession].totalCredits < obj.totalCredits) {
            highestCreditsBySession[obj.acadSession] = obj;
        }
    });

    return Object.values(highestCreditsBySession);
}


// function updateUI(startAndEndTime, roundName) {

//     const startTime = startAndEndTime !== '' ? startAndEndTime.startTime : '';
//     const endTime = startAndEndTime !== '' ? startAndEndTime.endTime : '';
//     let timeRemaining = $('.time-remaining').text().trim();
//     let message = `${roundName} Not Created Yet`;

//     $('#start-time').html('');
//     $('#end-time').html('');

//     if (startTime === '') {
//         $('.round-not-created').html(message);
//         $('.round-not-created').removeClass('d-none');
//         $('.time-remaining').addClass('d-none');
//     } else {
//         $('#start-time').html(startTime);
//         $('#end-time').html(endTime);
//         $('.round-not-created').addClass('d-none');
//         $('.time-remaining').removeClass('d-none');
//     }
// }























    





