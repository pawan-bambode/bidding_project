const { Toast } = bootstrap;

function createToast(custom) {
  let {title, msg, type} = {...custom};

  const titleClass = type === 'positive' ? 'text-success' : type === 'negative' ? 'text-danger' : '';
  // const bgColor  = 
         // <i class="fas fa-check fa-lg me-2"></i>  // class="toast position-absolute end-0 top-0 m-3" position-absolute top-50 start-50 translate-middle
  const htmlMarkup =
    `<div aria-atomic="true" aria-live="assertive" class="toast m-3 bg-white" 
      role="alert" id="myAlert"  style="z-index:9999999; position:fixed; top:65px; right:0;">
        <div class="toast-header">
          <strong class="me-auto fw-bold fs-5 ${titleClass}">${title}</strong>
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
  myToast._config.delay = 2500;
  myToast.show();
}

// createToast({
//   title: "FAILED!",
//   msg: e.responseJSON.message,
//   type: "negative"
// });