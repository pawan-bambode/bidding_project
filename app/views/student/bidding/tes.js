 socket.on('studentBiddingResponse', function(biddingReponseResult) {
        console.log(biddingReponseResult);

        let biddingResponseToUser = biddingReponseResult.studentBiddingResponse.description;
        const isCurrentUser = userId === biddingReponseResult.userId;
        const isSuccessResponse = biddingReponseResult.studentBiddingResponse.status === 1;

        if (isSuccessResponse) {
        
            let divisionBatchId = biddingReponseResult.divisionId;
            let mrbPoint = biddingReponseResult.minimumRequireBits.Mrb;
            let bidPoints = biddingReponseResult.minimumRequireBits.MaxBidPoints
        
            let targetRow = $(`#bidding-table tbody tr[data-division-batch-lid="${divisionBatchId}"]`);
            if (targetRow.length > 0) {
            
                let winningStatusElement = targetRow.find('.winning-status');
                let mrbPointsElement = targetRow.find('.mrb-points');
                let curentStudentBitPoints = targetRow.find('.student-current-bid-point').val();
            
                curentStudentBitPoints = curentStudentBitPoints !== '' ? curentStudentBitPoints : '';
                mrbPointsElement.html(mrbPoint);
            
             
                    winningStatusElement.html('Yes');
                    winningStatusElement.removeClass('losing').addClass('winning');
                    $(`#bidding-table tbody tr[data-division-batch-lid="${divisionBatchId}"]`).find('.student-previous-bid-point').html(bidPoints);
                    let studentBidPoints = $(`#bidding-table tbody tr[data-division-batch-lid="${divisionBatchId}"]`).find('.student-previous-bid-point').html();
                
                    if(studentBidPoints > 0){
                        $('#bidding-table tbody tr[data-division-batch-lid="' + divisionBatchId + '"]').find('.withdraw-bidding').addClass('disabled');  
                    }
                
            }
        
                createToast({ title: "Success", msg: biddingResponseToUser, type: "positive", showingTime:"1000"});
        }   
        else {
                createToast({ title: "Fail", msg: biddingResponseToUser, type: "negative", showingTime:"1000"});
        } 
        let winningCredits = 0;

        $('#bidding-table tbody td.winning').each(function() {
            winningCredits += $(this).closest('tr').data('credits');
        });

        $('#credits-winning').html(winningCredits)
    });