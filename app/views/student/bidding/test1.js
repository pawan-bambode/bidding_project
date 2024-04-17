socket.on('studentBiddingResponse', function(biddingReponseResult) {
    console.log('biddingReponseResult------>', biddingReponseResult);
    let biddingResponseToUser = biddingReponseResult.studentBiddingResponse.description;
    const isCurrentUser = userId === biddingReponseResult.userId;
    const isSuccessResponse = biddingReponseResult.studentBiddingResponse.status === 1;
    let divisionBatchId = biddingReponseResult.divisionId;
    let targetRow = $(`#bidding-table tbody tr[data-division-batch-lid="${divisionBatchId}"]`);
    if (isSuccessResponse) {
    
        let credits = targetRow.data('credits');
    
        if (targetRow.length > 0) {
            let winningStatusElement = targetRow.find('.winning-status');
            
            winningStatusElement.html('Yes');
            winningStatusElement.removeClass('losing').addClass('winning');
            studentBiddingStatus.winningCredits += credits;
          
            targetRow.find('.student-current-bid-point').val('');
           
            let studentBidPoints = targetRow.find('.student-previous-bid-point').html();

            if(studentBidPoints > 0){
                targetRow.find('.withdraw-bidding').addClass('custom-disabled');
                targetRow.find('.withdraw-bidding').attr('title', reasonForDisable);
            }
        }

        createToast({ title: "Success", msg: biddingResponseToUser, type: "positive", showingTime: "1000"});
    } else {
        targetRow.find('.student-current-bid-point').val('');
        createToast({ title: "Fail", msg: biddingResponseToUser, type: "negative", showingTime: "1000"});
    } 
    $('#credits-winning').text(studentBiddingStatus.winningCredits);
}); 