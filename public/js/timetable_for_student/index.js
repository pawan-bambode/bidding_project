    $('#student_submit_button').on('click',function(){
       $(this).attr('disabled','disabled');
       let subjects = updateOrSaveStudentSubject('#modal_for_stud_sel_course .modal-body .selected-course tbody tr')
        let ApiObj = {
            url: '/student/subjectAdded',
            type: 'POST',
            data: {
                input_json:JSON.stringify(subjects)
            },
            dataType: 'JSON'
            }
            ajaxApi(ApiObj).then(result => {
            showSuccess(result.description)
        }).catch(error => {
            createConfirmation();
        })
    })

    $('#student_update_button').on('click',function(){
       let subjects = updateOrSaveStudentSubject('#modal_for_stud_sel_course .modal-body .selected-course tbody')
           let ApiObj = {
            url: '/student/updateSubject',
            type: 'POST',
            data: {
                input_json:JSON.stringify(subjects)
            },
            dataType: 'JSON'
            }
            ajaxApi(ApiObj).then(result => {
            showSuccess(result.description)
           }).catch(error => {
            createConfirmation(result);
           })
    })




    function ajaxApi(obj) {
        return $.ajax({
            type: obj.type,
            url: obj.url,
            data: obj.data,
            beforeSend: function () {
              //  $(".modal-loader").removeClass('d-none')
            },
            success: data => {
                return data
            },
            complete: function () {
                $(".modal-loader").addClass('d-none')
            },
            showSuccess(result) {

            },
            error: err => {
                return err
            },
            dataType: obj.dataType
        });
    }
 
    function ConfirmationCustom(message) {
    
        return new Promise((success, failed) => {
            let dialog = document.createElement('div');
            dialog.classList.add('dialog');
        
            let dialogBox = document.createElement('div');
            dialogBox.classList.add('dialogBox');
            dialog.appendChild(dialogBox);
            
            let messageBox = document.createElement('div');
            messageBox.classList.add('messageBox');
            dialogBox.appendChild(messageBox);
        
            let dialogHeading = document.createElement('h1');
            dialogHeading.classList.add('dialogHeading');
            dialogHeading.textContent = `${message.custom_heading}`
            messageBox.appendChild(dialogHeading); 
        
            let dialogMessage = document.createElement('p');
            dialogMessage.classList.add('dialogMessage');
            dialogMessage.textContent = `${message.custom_message}`;
            messageBox.appendChild(dialogMessage);
        
            let buttonContainer = document.createElement('div');
            buttonContainer.classList.add('buttonContainer');
            dialogBox.appendChild(buttonContainer);
        
            let okButton = document.createElement('button');
            okButton.classList.add('okButton');
            okButton.textContent = `${message.label_for_success}`;
            buttonContainer.appendChild(okButton);
        
            let cancelButton = document.createElement('button');
            cancelButton.classList.add('cancelButton');
            cancelButton.textContent = `${message.label_for_cancel}`;
            buttonContainer.appendChild(cancelButton);
        
            document.querySelector('body').append(dialog);
            okButton.addEventListener('click', function () {
                document.querySelector('.dialog').remove();
                success(true);
            });
        
            cancelButton.addEventListener('click',  function (){
                document.querySelector('.dialog').remove();
                success(false);
            });
        })
    }
    let customMessage = {
        custom_heading: 'Confirmation',
        custom_message: 'Do you want to Update?',
        label_for_success: 'Ok',
        label_for_cancel : 'Cancel'
    };
    async function createConfirmation() {
        let confirmValue = await ConfirmationCustom(customMessage);
        if(confirmValue){
            $('#student_submit_button').addClass('d-none');
            $('#student_update_button').removeClass('d-none');
            $('#modal_for_stud_sel_course').modal('hide');
            $('#modal_for_stud_sel_course .selected-course .table tbody').empty();
        }
    }
     
    function updateOrSaveStudentSubject(selector){
        let subjects = [];
        let subject;
        let dataStudentSelected = document.querySelectorAll(selector);
          dataStudentSelected.forEach(function(eachSubject,index){
          let program_name = eachSubject.getAttribute('data-program-name');
          let module_name  = eachSubject.getAttribute('data-module-name');
          let room         = eachSubject.getAttribute('data-room-no');
          let division     = eachSubject.getAttribute('data-division');
          let faculty_name = eachSubject.getAttribute('data-faculty-name');
          let day          = eachSubject.getAttribute('data-day');
          let start_time   = eachSubject.getAttribute('data-start-id');
          let end_time     = eachSubject.getAttribute('data-end-id');  
          let acad_session = eachSubject.getAttribute('data-acad-session');
          let lec_type     = eachSubject.getAttribute('data-lec-type');
          
           subject = {
            program_name:program_name,
            module_name:module_name,
            room:room,
            division:division,
            faculty_name:faculty_name,
            day:day,
            start_time:start_time,
            end_time:end_time,
            acad_session:acad_session,
            lec_type:lec_type
          }
          subjects.push(subject);
         });
         return subjects;
    }
   
     
