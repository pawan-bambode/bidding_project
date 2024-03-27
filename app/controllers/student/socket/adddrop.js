const roundSetting = require('../../../models/admin/roundSettings/roundSettings');

module.exports.respond = (socket, io) =>{
    
    socket.on('addDropPageLoad', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.start_date_time;
        let endTime = data.biddingTime.end_date_time;
        let roundId = data.roundId;
        let roundIId = data.roundIId;
        
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
                    const [roundSettingTimeResult, listByOneDayBeforeResult] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId)
                    ]);
                
                    io.emit('activeAddDropRound', {
                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('activeAddDropRound');
                }
            });
        }

        if (!isNaN(endDateTime)) { 

            cron.schedule(endCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, listByOneDayBeforeResult] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                    ]);
                
                    io.emit('activeAddDropRound', {
                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('activeAddDropRound');
                }
            });
        }
    });
}