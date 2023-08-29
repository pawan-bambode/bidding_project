    $('#student_submit_button').on('click',function(){
      $(this).attr('disabled','disabled');
      let subjects = [];
      let subject;
      let dataStudentSelected = document.querySelectorAll('.room_slot_selected');
       dataStudentSelected.forEach(function(eachSubject,index){
        let faculty_name = eachSubject.getAttribute('data-faculty-name');
        let module_name  = eachSubject.getAttribute('data-module-name');
        let program_name = eachSubject.getAttribute('data-program-name');
        let acad_session = eachSubject.getAttribute('data-acad-session');
        let lec_type     = eachSubject.getAttribute('data-lec-type');
         subject = {
          faculty_name:faculty_name,
          module_name:module_name,
          program_name:program_name,
          acad_session:acad_session,
          lec_type:lec_type
        }
        subjects.push(subject);
       });

      $.ajax({
        method:'POST',
        url: '/student/subjectAdded',
        data:  {'input_json':JSON.stringify(subjects)},
        dataType: 'JSON',
        success: function(response){
            let resultData = response.status;
            if(resultData == '200'){
                showSuccess(JSON.parse(response.description))
                $('#student_submit_button').classList.add('d-none');   
            }
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
   })
     
     
     
