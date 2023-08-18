

$(document).ready(function () {
   $('.save_academic_year').on('click', function () {
      let product = $('#product').val();
      let customer = $('#customer').val();
      let academic_year = $("#academic_year_for_modal option:selected").val();
      let biding_cycle = $('#bidding_cycle option:selected').val();
      let ftp_folder_name = $('#ftp_folder_name').val();
      let ApiObj = {
         url: '/admin/addAcademicYear',
         type: 'POST',
         data: {
            product: product,
            customer: customer,
            academic_year: academic_year,
            biding_cycle: biding_cycle,
            ftp_folder_name: ftp_folder_name
         },
      }
      ajaxApi(ApiObj).then(result => {
         if (result.status == 200) {
            createAcademicYearModal();
            $('#set_cycle_modal').modal('hide');
           
         }
      })
   })
});
async function createAcademicYearModal() {
   let createCustomAlert = await createAcademicYearSuccessModal();
   return createCustomAlert;
}
function createAcademicYearSuccessModal() {
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

      let customAlertBody = document.createElement('div');
      customAlertBody.classList.add('custom-alert-body');
      customAlertDialogBox.appendChild(customAlertBody);

      let dialogHeading = document.createElement('h1');
      dialogHeading.classList.add('dialogHeading');
      dialogHeading.textContent = 'Academic Year'
      customAlertBody.appendChild(dialogHeading);

      let dialogMessage = document.createElement('p');
      dialogMessage.classList.add('dialogMessage');
      dialogMessage.textContent = 'data inserted successfully';
      customAlertBody.appendChild(dialogMessage);

      let okButton = document.createElement('button');
      okButton.classList.add('okButton');
      okButton.textContent = 'Ok';
      customAlertDialogBox.appendChild(okButton);

      customAlert.appendChild(customAlertDialogBox);
      document.querySelector('body').append(customAlert);

      document.querySelector('.okButton').addEventListener('click', function () {
      console.log('values of button ');
      document.querySelector('.custom-alert').remove();
         success(true);
      })
   });
}
    
   


