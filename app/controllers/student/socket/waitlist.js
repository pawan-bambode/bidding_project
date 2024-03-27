module.exports.respond = (socket, io) =>{

    socket.on('waitListPageLoaded', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.startTime;
        let roundId = data.roundId;       
        
        const startDatetime = new Date(startTime);
        
        const startMinute = startDatetime.getMinutes();
        const startHour = startDatetime.getHours();
        const startDate = startDatetime.getDate();
        const startMonth = startDatetime.getMonth() + 1; 

        if (!isNaN(startDatetime)) { 
            
            const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            
            cron.schedule(startCronSchedule, async () => {
                try {
                        const [roundSettingTimeResult, courseList] = await Promise.all([
                            roundSetting.startAndEndTime(slugName, biddingId, roundId),
                            divisionBatch.courseList(slugName, biddingId),
                        ]);

                        io.emit('waitlistVisibleToStudent', {
                            roundDetails: roundSettingTimeResult.recordset,
                            courseList: courseList.recordset
                        });
                    } catch (error) {
                        io.emit('waitlistVisibleToStudent');
                    }
            });
        }
    });
}