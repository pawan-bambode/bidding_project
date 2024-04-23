function updateTableForCurrentUser(userSpecificWinningStatus) {
        
        let divisionBatchId = userSpecificWinningStatus.div_batch_lid;
        let actualAvailableSeats = userSpecificWinningStatus.available_seats;
        let minimumRequireBits = userSpecificWinningStatus.mrb;
        let totalBidders = userSpecificWinningStatus.total_bidders;
        let isWinning = userSpecificWinningStatus.is_winning;    
        
        let targetRow = $(`#bidding-table tbody tr[data-division-batch-lid="${divisionBatchId}"]`);
    
        if (targetRow.length > 0) {
        
            let availableCountElement = targetRow.find('.available-count');
            let mrbPointsElement = targetRow.find('.mrb-points');
            let winningStatusElement = targetRow.find('.winning-status');
            let totalBidder = targetRow.find('.total-bidder-counts');
        
            targetRow.attr('data-id', userSpecificWinningStatus.studentBiddingId);
            targetRow.attr('data-round-lid', userSpecificWinningStatus.round_lid);
            availableCountElement.html(actualAvailableSeats);
            totalBidder.html(totalBidders);
            mrbPointsElement.html(minimumRequireBits);
        
            if (isWinning) {  
                winningStatusElement.html('Yes');
                winningStatusElement.removeClass('losing').addClass('winning');
            
            } else {
                winningStatusElement.html('No');
                winningStatusElement.removeClass('winning').addClass('losing');
                targetRow.find('.widthdraw-bidding').removeClass('custom-disabled');
                targetRow.find('.withdraw-bidding').removeAttr('title'); 
            }
        }
    }