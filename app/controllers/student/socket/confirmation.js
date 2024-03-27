
module.exports.respond = async(socket, io) =>{

    socket.on('confirmationPageLoad', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.startTime;
        let endTime = data.biddingTime.endTime;
        let roundId = data.roundId;
        let roundIId = data.roundIId;
        let studendId = data.studentId;
    
        const startDatetime = new Date(startTime);
        const endDateTime = new Date(endTime);
        
        const startMinute = startDatetime.getMinutes();
        const startHour = startDatetime.getHours();
        const startDate = startDatetime.getDate();
        const startMonth = startDatetime.getMonth() + 1; 

        const endMinute = endDateTime.getMinutes();
        const endHour = endDateTime.getHours();
        const endDate = endDateTime.getDate();
        const endMonth = endDateTime.getMonth() + 1; 

        const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
        const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;

        if (!isNaN(startDatetime)) { 

            cron.schedule(startCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, listByOneDayBeforeResult, winningCourse] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                        confirmation.winningCourseList(slugName, biddingId, studendId,  roundId, roundIId)
                    ]);
                
                    io.emit('confirmationVisibleToStudent', {
                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset,
                        winningCourse: winningCourse.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('confirmationVisibleToStudent');
                }
            });
        } 

        if(!isNaN(endDateTime)){

            cron.schedule(endCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, listByOneDayBeforeResult, confirmCourse, winningCourse] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                        confirmation.getConfirmCourseList(slugName, biddingId, studendId,  roundId, roundIId),
                        confirmation.winningCourseList(slugName, biddingId, studendId,  roundId, roundIId)
                    ]);
                
                    io.emit('confirmationVisibleToStudent', {
                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset,
                        confirmationCourse: confirmCourse.recordset,
                        winningCourse: winningCourse.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('confirmationVisibleToStudent');
                }
            });
        }       
    });
}