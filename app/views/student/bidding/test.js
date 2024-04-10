$('#bidding-trimester-select-table').on('click','.add-bidding',function() {
        
    biddingRow = ``;

    let areaName = $(this).closest('tr').data('area-name');
    let courseName = $(this).closest('tr').data('course-name');
    let credits = $(this).closest('tr').data('credits');
    let available = $(this).closest('tr').data('max-seats');
    let acadSession = $(this).closest('tr').data('acad-session');
    let divisionBatchId = $(this).closest('tr').data('division-batch-lid');
    let facultyId = $(this).closest('tr').data('faculty-id');
    let facultName = $(this).closest('tr').data('faculty-name');
    let acadSessionId = $(this).closest('tr').data('acad-session-id');
    let courseTime = $(this).closest('tr').children('.course-timing').html();
    let courseId = $(this).closest('tr').data('course-id');
    let courseLid = $(this).closest('tr').data('course-lid');
    let courseNameWithDivision = $(this).closest('tr').data('course-division-name');
    let tableId = $('#bidding-table tbody tr').length;
    let studentId = $('#student-data').data('student-id');
    let id = $(this).closest('tr').data('id');

    let roundId = `<%- roundDetails.round_lid %>`;

    biddingRow = `<tr 
                    data-id= "${id}" 
                    data-round-id ="${roundId}" 
                    data-area-name ="${areaName}" 
                    data-course-name ="${courseName}" 
                    data-acad-session ="${acadSession}" 
                    data-division-batch-lid ="${divisionBatchId}" 
                    data-faculty-id =${facultyId}
                    data-credits = "${credits}" 
                    data-max-seats ="${available}"
                    data-course-time ="${courseTime}" 
                    data-acad-session-id = "${acadSessionId}" 
                    data-course-id ="${courseId}" 
                    data-course-lid="${courseLid}"
                    >
                        <td class="id-column">${++tableId}</td>
                        <td>${areaName}</td>
                        <td>${courseNameWithDivision}</td>
                        <td>${acadSession}</td>
                        <td>${facultName}</td>
                        <td>${credits}</td>
                        <td class="available-count">0</td>
                        <td class="total-bidder-counts">0</td>
                        <td class="mrb-points"></td>
                        <td class="winning-status winning">Yes</td>
                        <td class="student-previous-bid-point">0</td>
                        <td class="d-flex">
                            <input type="text" placeholder="Bids" class="p-2 student-current-bid-point" size='15' autocomplete="off">
                                <button class="btn border border-dark ms-2 add-bidding-points">
                                    <img src='/image/student/body-part-image/bidding-round-image/check-mark.png' alt='checkmark'>
                                </button> 
                        </td>
                        <td>
                            <button class="btn border border-danger withdraw-bidding mt-1">
                                <img src='/image/student/body-part-image/bidding-round-image/withdraw.png'>
                            </button>
                        </td>
                    </tr>`;
                    
        socket.emit('createOrJoinRoom',{ 
            slugName: "<%- slug %>",
            studentLid: studentId,
            round_lid: roundId,
            courseLid: courseLid,
            concentration_lid: concentrationId,
            divisionBatchLid: divisionBatchId,
            userId: userId,
            biddingSessionId: biddingSessionId
        }); 
})