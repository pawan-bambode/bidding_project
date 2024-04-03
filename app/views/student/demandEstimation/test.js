  function studentSelectCourse(studentCriteriaStatus){

        let acadSessionId = studentCriteriaStatus.creditsPerSession.acadSessionId;

        $('.student-footer .area-status .area-status-span').text(studentCriteriaStatus.areaCovered);
        
        studentCriteriaStatus.creditsPerSession.filter((selectedAcadSession) => { 
            $(`.session-credit-points[data-acad-session-id="${selectedAcadSession.acadSessionId}"]`).find('.credits-points').text(selectedAcadSession.credits); })
        
        studentCriteriaStatus.creditsPerArea.filter((selectedArea) =>{
            if(selectedArea.area === concentrationSet.primaryArea){
                $('.student-footer .pri-area-status .pri-area-span').text(selectedArea.credits);
            }
        });

        if (studentCriteriaStatus.isCriteriaMet) {
            $('.student-footer .criteria-status').text('Criteria Met');
            $('.student-footer .criteria-status').addClass('bg-success');
        }


    }