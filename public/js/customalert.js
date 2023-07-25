
async function createCustomAlert(customAlertMessage) {
    let createCustomAlert = await createCustom(customAlertMessage);
    return createCustomAlert;
}

function createCustom(customMessage) {
    return new Promise((success, fail) => {
        let customAlert = document.createElement('div');
        customAlert.classList.add('modal-backdrop', 'custom-alert');

        let customAlertDialogBox = document.createElement('div');
        customAlertDialogBox.classList.add('custom-alert-dialog-box');

        let dialogHeader = document.createElement('div');
        dialogHeader.classList.add('custom-alert-dialog-header');

        let customAlertHeaderTitle = document.createElement('div');
        customAlertHeaderTitle.classList.add('custom-alert-header-title');
        customAlertDialogBox.appendChild(customAlertHeaderTitle);

        let iconexclamation = document.createElement('i');
        iconexclamation.classList.add('fa', 'fa-exclamation-circle', 'custom_check');
        dialogHeader.appendChild(iconexclamation);
        customAlertHeaderTitle.appendChild(dialogHeader);

        let customAlertBody = document.createElement('div');
        customAlertBody.classList.add('custom-alert-body');
        customAlertDialogBox.appendChild(customAlertBody);

        let dialogHeading = document.createElement('h1');
        dialogHeading.classList.add('dialogHeading');
        dialogHeading.textContent = `${customMessage.custom_alert_title}`
        customAlertBody.appendChild(dialogHeading);

        let dialogMessage = document.createElement('p');
        dialogMessage.classList.add('dialogMessage');
        dialogMessage.textContent = `${customMessage.custom_alert_content}`;
        customAlertBody.appendChild(dialogMessage);

        let okButton = document.createElement('button');
        okButton.classList.add('okButton');
        okButton.textContent = 'Ok';
        customAlertDialogBox.appendChild(okButton);

        customAlert.appendChild(customAlertDialogBox);
        document.querySelector('body').append(customAlert);

        document.querySelector('.okButton').addEventListener('click', function () {
            document.querySelector('.custom-alert').remove();
            success(true);
        })
    });
}


function isEndtimeLessStarttime(starttime, endtime) {
    if (!starttime || !endtime)
        return false;
    return (Number.parseInt(starttime, 10) > Number.parseInt(endtime, 10));
}