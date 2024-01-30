class SimpleAlert {

    constructor() {
        this.closeElem = null;
        this.positiveElem = null;
        this.negativeElem = null;
    }

    alert(obj) {
        this.removeAlert();

        let alertElem = document.createElement('div');
        alertElem.setAttribute('class', `simple-alert alert ${obj.type}  bottom-0 end-3`);
        let list = ``;

        alertElem.innerHTML = `
            <div class="header d-flex justify-content-between align-item-center">
                <h4 class='d-flex align-item-center'><i class="fa-solid fa-circle-exclamation me-3"></i> <p class="title">${obj.title}</p></h4>
                <i class="fa-solid fa-xmark simple-alert-close"></i>
            </div>
            <div class="body">
                <ul>
                    ${list}
                </ul>
            </div>
            <div class="footer">
                ${obj.buttons.positive ? `<button class="positive">${obj.buttons.positive.text}</button>` : ''}
                ${obj.buttons.negative ? `<button class="negative">${obj.buttons.negative.text}</button>` : ''}
            </div>   
        `;

        let backdrop = document.createElement('div');
        backdrop.setAttribute('class', 'simple-alert-backdrop');

        document.body.appendChild(alertElem);
        document.body.appendChild(backdrop);

        this.closeElem = document.querySelector('.simple-alert .simple-alert-close');
        this.positiveElem = document.querySelector('.simple-alert .positive');
        this.negativeElem = document.querySelector('.simple-alert .negative');

        this.positiveCallbackFn = obj.buttons.positive.action;
        this.negativeCallbackFn = obj.buttons.negative.action;

        this.initEvents(obj);
    }

    removeAlert() {
        let alertElement = document.querySelector('.simple-alert');
        let backdropElement = document.querySelector('.simple-alert-backdrop');

        if (alertElement) {
            alertElement.remove();
        }

        if (backdropElement) {
            backdropElement.remove();
        }
    }

    initEvents(obj) {
        this.closeElem.addEventListener('click', () => {
            this.removeAlert();
        });

        this.positiveElem.addEventListener('click', () => {
            this.removeAlert();

            if (obj.type == 'alert-success') {
                location.reload();
            }
        });

        this.negativeElem.addEventListener('click', () => {
            this.removeAlert();
        });
    }
}
