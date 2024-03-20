if(currentRoundStatus.round_ended == 1){
        $('.round-wise-modal').addClass('d-none');
        $('.bidding-round-wise').addClass('d-none');
        $('.round-message-container').removeClass('d-none');
        $('.round-message-container p').text('This Round Has Ended!')
    }
    else if(currentRoundStatus.round_not_started_yet == 1){
       
        if((roundDetails != '')){
            console.log('inside the if block', roundDetails);
            let roundName = roundDetails.roundName.replaceAll('_', ' ');
            let roundId = roundDetails.round_lid;

            $('.round-name').html(roundName);
            $('.round-name').attr('data-round-id', roundId);

            if(isStudentPartOfRound == 1 ){
                console.log('values of isStudentPartOfRound', isStudentPartOfRound);
                let roundStartTime = roundDetails.startTime;
                let roundEndTime = roundDetails.endTime;
                $('#student-data').attr('data-isStudentPartOfRound', true);
            
                $('#start-time').html(roundStartTime);
                $('#end-time').html(roundEndTime);
            
                $('.bidding-round-wise').removeClass('d-none');
                $('.round-message-container').addClass('d-none');
                $('.round-wise-modal').addClass('d-none');
            }
            else{
                $('#student-data').attr('data-isStudentPartOfRound', false);
                $('.round-message-container p').text('You are not eligible for this round')
                $('.round-wise-modal').addClass('d-none')
                $('.bidding-round-wise').addClass('d-none');
            }
        }
        else{
            $('.round-wise-modal').addClass('d-none');
            $('.round-message-container').removeClass('d-none');
            $('.round-message-container p').text('This Round Has Not Started Yet!')
        } 
    }
    else if(currentRoundStatus.round_status == 'Round Not Found'){
        $('.round-wise-modal').addClass('d-none');
        $('.round-message-container').removeClass('d-none');
        $('.round-message-container p').text('Round Not Found!')
    }
    else if(currentRoundStatus.round_started == '1'){

        console.log('valuesof ', isStudentPartOfRound);
    
        let roundName = roundDetails.roundName.replaceAll('_', ' ');
            let roundId = roundDetails.round_lid;

            $('.round-name').html(roundName);
            $('.round-name').attr('data-round-id', roundId);

            if(isStudentPartOfRound == 1){
                let roundStartTime = roundDetails.startTime;
                let roundEndTime = roundDetails.endTime;
                $('#student-data').attr('data-isStudentPartOfRound', true);
            
                $('#start-time').html(roundStartTime);
                $('#end-time').html(roundEndTime);
            
                $('.bidding-round-wise').removeClass('d-none');
                $('.round-message-container').addClass('d-none');
                $('.round-wise-modal').removeClass('d-none');
            }
            else{
                $('#student-data').attr('data-isStudentPartOfRound', false);
                $('.round-message-container p').text('You are not eligible for this round')
                $('.round-message-container').removeClass('d-none');
                $('.round-wise-modal').addClass('d-none')
                $('.bidding-round-wise').addClass('d-none');
            }
        // $('.bidding-round-wise').removeClass('d-none');
        // $('.round-wise-modal').removeClass('d-none');
    }
    else{

        if((roundDetails != '')){
            let roundName = roundDetails.roundName.replaceAll('_', ' ');
            let roundId = roundDetails.round_lid;

            $('.round-name').html(roundName);
            $('.round-name').attr('data-round-id', roundId);

            if(isStudentPartOfRound == 1 ){
                let roundStartTime = roundDetails.startTime;
                let roundEndTime = roundDetails.endTime;
                $('#student-data').attr('data-isStudentPartOfRound', true);
            
                $('#start-time').html(roundStartTime);
                $('#end-time').html(roundEndTime);
            
                $('.bidding-round-wise').removeClass('d-none');
                $('.round-message-container').addClass('d-none');
                $('.round-wise-modal').removeClass('d-none');
            }
            else{
                $('#student-data').attr('data-isStudentPartOfRound', false);
                $('.round-message-container p').text('You are not eligible for this round')
                $('.round-message-container').removeClass('d-none');
                $('.round-wise-modal').addClass('d-none')
                $('.bidding-round-wise').addClass('d-none');
            }
        }
    }
