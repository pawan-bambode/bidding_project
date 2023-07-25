

async function customConfirmation(customConfirmationMessage) {
    let customConfirmation = await createCustomConfirmation(customConfirmationMessage);
     return customConfirmation;
}

function createCustomConfirmation(customConfirmMessage) {
    return new Promise((complete, fail) => {
        let custom_confirmation = document.createElement('div');
        custom_confirmation.classList.add('modal-backdrop','custom_confirmation');

        let dialogBox = document.createElement('div');
        dialogBox.classList.add('custom_confirmation_dialogBox');
        custom_confirmation.appendChild(dialogBox);

        let diablogHeaderMain = document.createElement('div');
        diablogHeaderMain.classList.add('diablogHeaderMain');
        dialogBox.appendChild(diablogHeaderMain);

        let dialogHeader = document.createElement('div');
        dialogHeader.classList.add('custom_confirmation_dialogHeader');

        let iconexclamation = document.createElement('i');
        iconexclamation.classList.add('fa', 'fa-exclamation-circle', 'icon-in-circle');
        dialogHeader.appendChild(iconexclamation);
        diablogHeaderMain.appendChild(dialogHeader);

        let dialogBody = document.createElement('div');
        dialogBody.classList.add('custum_confirmatin_dialogMessage');
        dialogBox.appendChild(dialogBody);

        // let messageTitle = document.createElement('h1');
        // messageTitle.classList.add('messageTitle');
        // messageTitle.textContent = `${customConfirmMessage.custom_confirmation_heading}`;
        // dialogBody.appendChild(messageTitle);

        let messageContent = document.createElement('p');
        messageContent.classList.add('messageContent');
        messageContent.textContent = `${customConfirmMessage.custom_confirmation_message}`;
        dialogBody.appendChild(messageContent);

        let dialogButtonContainer = document.createElement('div');
        dialogButtonContainer.classList.add('costum_confirmat_btnContainer');
        dialogBox.appendChild(dialogButtonContainer);

        let dialogCancelButton = document.createElement('button');
        dialogCancelButton.classList.add('custom_confirm_cancelbtn');
        dialogCancelButton.textContent = 'Cancel';
        dialogButtonContainer.appendChild(dialogCancelButton);

        let dialogSuccessButton = document.createElement('button');
        dialogSuccessButton.classList.add('custom_confirm_successbtn');
        dialogSuccessButton.textContent = 'Ok';
        dialogButtonContainer.appendChild(dialogSuccessButton);

        document.querySelector('body').append(custom_confirmation);

        document.querySelector('.custom_confirm_cancelbtn').addEventListener('click', function () {
            complete(false);
            document.querySelector('.custom_confirmation').remove();
        })
        document.querySelector('.custom_confirm_successbtn').addEventListener('click', function () {
            complete(true);
            document.querySelector('.custom_confirmation').remove();
            
        })
    });
}