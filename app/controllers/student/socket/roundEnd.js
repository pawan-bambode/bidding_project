module.exports.respond = (socket, io) =>{
    
    socket.on('roundEnded', (data) => {

        let endDateTimeUser = data.startTime.endTime;
        let roundId = data.startTime.round_lid;
        let slugName = data.slugName;
        let biddingSessionId = data.startTime.bidding_session_lid;

        const endDateTime = new Date(endDateTimeUser);
        const endMinute = endDateTime.getMinutes();
        const endHour = endDateTime.getHours();
        const endDate = endDateTime.getDate();
        const endMonth = endDateTime.getMonth() + 1;
        const endYear = endDateTime.getFullYear();
        
        if (!isNaN(endDateTime)) { 
            const startCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`; 
            cronScheduled = true;
            cron.schedule(startCronSchedule, () => {
            
                    confirmation.roundEnd(slugName, roundId, biddingSessionId)
                    .then(result => {
                        socket.emit('roundEndResponse',{
                            message: JSON.parse(result.output.output_json),
                        })
                    })
                    .catch(error => {
                    });
            });
        }
    });   
}