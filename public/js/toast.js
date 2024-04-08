const { Toast } = bootstrap;

function createToast(custom) {
  
  let {title, msg, type, showingTime} = {...custom};
  console.log('valuesof cutom', custom);

  msg = msg.replaceAll('"','');

  const titleClass = type === 'positive' ? 'text-success' : type === 'negative' ? 'text-danger' : '';
  const backgroundColor = type === 'positive' ? 'background-success' : type === 'negative' ? 'background-danger' : '';

  const htmlMarkup =
    `<div aria-atomic="true" aria-live="assertive" class="toast m-3 ${backgroundColor}" 
      role="alert" id="myAlert"  style="z-index:9999999; position:fixed; top:65px; right:0;">
        <div class="toast-header ${backgroundColor}">
          <strong class="me-auto fw-bold fs-5 ${titleClass}">${title} !</strong>
          <button aria-label="Close" class="btn-close text-dark me-1" data-bs-dismiss="toast" type="button"></button>
        </div>
        <div class="toast-body text-dark fw-bold">
            ${msg}
        </div>
    </div>`;
  
  function toast() {
    let template = document.createElement('template');
    let html = htmlMarkup.trim()
    template.innerHTML = html
    return template.content.firstChild
  }
  
  
  let toastEl = toast();
  document.body.appendChild(toastEl)
  const myToast = new Toast(toastEl);
  myToast._config.delay = showingTime;
  myToast.show();
}

