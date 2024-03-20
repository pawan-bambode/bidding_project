function ajaxTable(courseList, completedAreas, concentrationSet) {
    $("#available-course-table tbody").empty();
    let courseArray = [];
    let maxCreditsOneAreas = $('#selected-course-table tbody').attr('max-credits-one-area');
    $('#selected-course-table tbody tr').each((index, element) => {
        let courseId = $(element).data('course-id');
        courseArray.push(courseId);
    });
    courseArray.forEach(item => {
        courseList = courseList.filter(course => course.id !== item);
    });
    let ajaxTable = ``;
    if (courseList.length > 0) {
        let count = 1;
        for (const course of courseList) {
            let creditsComplete = $('#selected-course-table tbody').attr(`credit-complete-${course.sap_acad_session_id}`);
            let disabledAddButton = creditsComplete === 'true' ? 'disabled' : '';
            if (course.area_name == maxCreditsOneAreas) {
                disabledAddButton = 'disabled';
            }
            ajaxTable +=
                `<tr data-course-id="${course.id}" data-area="${course.area_name}" data-course-name="${course.course_name}" data-acad-session="${course.acad_session}" data-credits="${course.credits}" data-acad-session-id="${course.sap_acad_session_id}">
                    <td>${count++}</td>
                    <td>${course.area_name}</td>
                    <td>${course.course_name}</td>
                    <td>${course.acad_session}</td>
                    <td>${course.credits}</td>
                    <td><button class="btn btn-secondary add-course ${disabledAddButton}"  data-area="${course.area_name}" >Add</button></td>
                </tr>`;
        }
    }
    $("#available-course-table tbody").html(ajaxTable);
}