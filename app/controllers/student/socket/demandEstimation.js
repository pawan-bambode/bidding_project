module.exports.respond = async (socket, io) =>{
    
    socket.on('demandEstimationPageLoad', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.startTime;
        let roundId = data.roundId;       
        
        const startdatetimeDate = new Date(startTime);
        
        const startMinute = startdatetimeDate.getMinutes();
        const startHour = startdatetimeDate.getHours();
        const startDate = startdatetimeDate.getDate();
        const startMonth = startdatetimeDate.getMonth() + 1; 

        if (!isNaN(startdatetimeDate)) { 
            const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            
            cron.schedule(startCronSchedule, async () => {
                try {
                    const[roundSettingTimeResult, courseList] = await Promise.all([
                        roundSetting.startAndEndTime(slugName, biddingId, roundId),
                        demandEstimation.getAvailableCourseList(slugName, biddingId),
                    ]);

                    io.emit('demandEsmationVisibleToStudent', {
                        roundDetails: roundSettingTimeResult.recordset,
                        courseList: courseList.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('demandEsmationVisibleToStudent');
                }
            });
        }
    });

}