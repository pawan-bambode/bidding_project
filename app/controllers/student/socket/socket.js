const bidding = require('../../../models/student/bidding/bidding');
const cron = require('node-cron');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const confirmation = require('../../../models/student/confirmation/confirmation');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const demandEstimation = require('../../../models/student/demandEstimation/demandEstimation');

module.exports.respond = async (socket, io) => {

    socket.on('demandEstimationPageLoad', (data) => {
        
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

    socket.on('demandEstimationLoadTime', async (data) => {

        let slug = data.slugName;
        let biddingId = data.activeBidding;
        let roundId = 1;
        let studendId = data.studentId
        let remainingTime = '';

        const intervalFunction = async () => {

            let currentDateTime = convertDateFormat();
            
            if (remainingTime === "Round Ended") {
                clearInterval(interval);
            }
            
            const detailsResult = await Promise.all([
                roundSetting.currentRoundStatus(slug, biddingId, roundId),
                demandEstimation.isStudentPartOfRound(slug, biddingId, studendId, roundId),
                roundSetting.demandEstimOneDayBefore(slug, biddingId, roundId),
                demandEstimation.getAvailableCourseList(slug, biddingId)
            ]);

            if(detailsResult[2].recordset.length > 0){
                const startTime = new Date(detailsResult[2].recordset[0].startTime).getTime();
                const endTime = new Date(detailsResult[2].recordset[0].endTime).getTime();
                remainingTime = calculateRemainingTime(startTime, endTime);
            }
        
            socket.emit('remainingTimeForDemandEstimation',  {
                remainingTime: remainingTime,
                currentRoundStatus: detailsResult[0].recordset,
                currentDateTime: currentDateTime,
                studentList: detailsResult[1].recordset.length == 0 ?0:1,
                roundDetails : detailsResult[2].recordset,
                biddingCourses: detailsResult[3].recordset
            });
        };
    
        const interval = setInterval(intervalFunction, 1000);
    });

    socket.on('biddingPageLoad', (data) => {
         
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.start_date_time;
        let endTime = data.biddingTime.end_date_time;
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

        if (!isNaN(startDatetime) && !isNaN(endDateTime)) { 

            const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
            
            cron.schedule(startCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, listByOneDayBeforeResult, biddingCourses ] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                        divisionBatch.biddingCourse(slugName, biddingId, studendId, roundId, roundIId),
                    ]);
                    
                    io.emit('activeBiddingRound', {

                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset,
                        biddingCourses: biddingCourses.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('activeBiddingRound');
                }
            });
        
            cron.schedule(endCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, listByOneDayBeforeResult, biddingCourses, courseList, considerationSet, confirmCourse, confirmationBidding] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                        divisionBatch.biddingCourse(slugName, biddingId, studendId),
                        divisionBatch.courseList(slugName, biddingId),
                        bidding.considerationSet(slugName, biddingId, studendId, roundId, roundIId),
                        confirmation.getConfirmCourseList(slugName, biddingId, studendId)
                    ]);
                
                    io.emit('activeBiddingRound', {
                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset,
                        biddingCourses: biddingCourses.recordset,
                        courseList: courseList.recordset,
                        considerationSet: considerationSet.recordset,
                        confirmationCourse: confirmCourse.recordset,
                        confirmationBidding: confirmationBidding != undefined? confirmationBidding.recordset : ''
                    
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('activeBiddingRound');
                }
            });
        }
    });

    socket.on('biddingPageLoadTime', async (data) => {

        let slug = data.slugName;
        let biddingId = data.activeBidding;
        let roundFirstId = 2;
        let roundSecondId = 4;
        let studendId = data.studentId
        let remainingTime = '';

        const intervalFunction = async () => {

            let currentDateTime = convertDateFormat();
            
            if (remainingTime === "Round Ended") {
                clearInterval(interval);
            }
            
            const detailsResult = await Promise.all([
                bidding.currentRoundStatus(slug, biddingId, roundFirstId, roundSecondId),
                bidding.isStudentPartOfRound(slug, biddingId, studendId, roundFirstId, roundSecondId),
                roundSetting.listByOneDayBefore(slug, biddingId, roundFirstId, roundSecondId),
                divisionBatch.biddingCourse(slug, biddingId, studendId, roundFirstId, roundSecondId),
            ]);

            if(detailsResult[2].recordset.length > 0){
            
                const startTime = new Date(detailsResult[2].recordset[0].startTime).getTime();
                const endTime = new Date(detailsResult[2].recordset[0].endTime).getTime();
                remainingTime = calculateRemainingTime(startTime, endTime);
            }
        
            socket.emit('remainingTime',  {
                remainingTime: remainingTime,
                currentRoundStatus: detailsResult[0].recordset,
                currentDateTime: currentDateTime,
                studentList: detailsResult[1].recordset.length == 0 ?0:1,
                roundDetails : detailsResult[2].recordset,
                biddingCourses: detailsResult[3].recordset
            });
        };
    
        const interval = setInterval(intervalFunction, 1000);
    });

    socket.on('createOrJoinRoom', async (biddingDetails) => {

        const { divisionBatchLid } = biddingDetails;
        const roomId = divisionBatchLid;
    
        socket.join(roomId);
    
        try {
            const { slugName, studentLid, round_lid, courseLid, divisionBatchLid, concentration_lid, biddingSessionId, userId } = biddingDetails;
    
            const result = await bidding.addBidding(slugName, studentLid, round_lid, courseLid, concentration_lid, divisionBatchLid, userId, biddingSessionId);
            const parsedMessage = JSON.parse(result.output.output_json);
            
            const emitData = {
                message: parsedMessage,
                userId: userId
            };
    
            if (parsedMessage.status === 1) {
                const detailsResult = await bidding.getAddBiddingDetails(slugName, biddingSessionId, divisionBatchLid, studentLid);
                emitData.biddingDetails = detailsResult.recordset;
            }
    
            io.in(roomId).emit("addBiddingResponse", emitData);
        } catch (error) {
            io.in(roomId).emit("addBiddingResponse", {
                message: JSON.parse(error.originalError.info.message),
                userId: biddingDetails.userId
            });
        }
    });

    socket.on('withdrawBidding', async biddingDetails => {
        
        try {

            const { slugName, id, studentLid, round_lid, divisionBatchLid, biddingSessionId, userId } = biddingDetails;
            const result = await bidding.withdrawBidding(slugName, id, studentLid, round_lid, divisionBatchLid, userId, biddingSessionId);
            const parsedMessage = JSON.parse(result.output.output_json);
    
            if (parsedMessage.status === 1) {

                    const detailsResult = await Promise.all([
                        bidding.getWithdrawBiddingDetails(slugName, biddingSessionId, divisionBatchLid),
                        bidding.getWithdrawBiddingCourse(slugName, biddingSessionId, divisionBatchLid, studentLid)
                    ]);
    
                    socket.emit("withdrawBiddingResponse", {
                        message: parsedMessage,
                        withdrawBiddingCourse: detailsResult[0].recordset,
                        courseList: detailsResult[1].recordset,
                        userId: userId,
                        divisionId: divisionBatchLid
                    });
    
                    socket.leave(divisionBatchLid);
                } else {
                        socket.emit("withdrawBiddingResponse", {
                            message: parsedMessage,
                            userId: userId
                        });
                }
        } catch (error) { 

            socket.emit("withdrawBiddingResponse", {
                message: JSON.parse(error.originalError.info.message),
                userId: biddingDetails.userId
            });
        }
    });
    
    socket.on('studentBidding', async biddingDetails => {

        try {

            const { slugName, studentId, roundId, divBatchId, userId, biddingSessionId, inputJson } = biddingDetails;
            const result = await bidding.studentBidByPoints(slugName, studentId, roundId, divBatchId, userId, biddingSessionId, inputJson);
            const parsedMessage = JSON.parse(result.output.output_json);
        
            if (parsedMessage.status === 1) {
                const detailsResult = await Promise.all([
                    bidding.getBiddingWinningResponse(slugName, biddingSessionId, divBatchId),
                    bidding.getMRBPointsResponse(slugName, biddingSessionId, divBatchId)
                ]);

                io.emit("studentBiddingResponse", {
                    studentBiddingResponse: parsedMessage,
                    minimumRequireBits: detailsResult[1].recordset[0],
                    divisionId: divBatchId,
                    userId: userId
                });
            } else {
                io.emit("studentBiddingResponse", {
                    studentBiddingResponse: parsedMessage,
                    userId: userId
                });
            }
        } catch (error) {
    
            io.emit("studentBiddingResponse", {
                studentBiddingResponse: JSON.parse(error.originalError.info.message),
                userId: biddingDetails.userId
            });
        }
    });

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

    socket.on('confirmationLoadTime', (data) => {
       
       let slug = data.slugName;
       let biddingId = data.activeBidding;
       let roundFirstId = 3;
       let roundSecondId = 5;
       let studendId = data.studentId
       let remainingTime = '';

       const intervalFunction = async () => {

           let currentDateTime = convertDateFormat();
           
           if (remainingTime === "Round Ended") {
               clearInterval(interval);
           }
           
           const detailsResult = await Promise.all([
               bidding.currentRoundStatus(slug, biddingId, roundFirstId, roundSecondId),
               bidding.isStudentPartOfRound(slug, biddingId, studendId, roundFirstId, roundSecondId),
               roundSetting.listByOneDayBefore(slug, biddingId, roundFirstId, roundSecondId),
               confirmation.winningCourseList(slug, biddingId, studendId, roundFirstId, roundSecondId),
               confirmation.getConfirmationForBidding(slug, biddingId, studendId),
           ]);
           
           if(detailsResult[2].recordset.length > 0){
           
               const startTime = new Date(detailsResult[2].recordset[0].startTime).getTime();
               const endTime = new Date(detailsResult[2].recordset[0].endTime).getTime();
               remainingTime = calculateRemainingTime(startTime, endTime);
           }
       
           socket.emit('confirmationRemainingTime',  {
               remainingTime: remainingTime,
               currentRoundStatus: detailsResult[0].recordset,
               currentDateTime: currentDateTime,
               studentList: detailsResult[1].recordset.length == 0 ?0:1,
               roundDetails : detailsResult[2].recordset,
               winningCourses: detailsResult[3].recordset,
               confirmCourses: detailsResult[4].recordset,
           });
       };
   
       const interval = setInterval(intervalFunction, 1000);
    })

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

    const calculateRemainingTime = (startTime, endTime) => {

        const endDateTime = new Date(endTime);
        const startDateTime = new Date(startTime);
        const currentTime = new Date();
    
        if (isNaN(endDateTime.getTime()) || isNaN(startDateTime.getTime()) || isNaN(currentTime.getTime())) {
            return 'Invalid Date Format!';
        }
    
        if (startDateTime >= endDateTime) {
            return 'Invalid Date Range!';
        }
    
        if (currentTime < startDateTime) {
            return 'Bidding Round Not Started Yet!';
        }
    
        const remainingTime = endDateTime - currentTime;
        if (remainingTime <= 0) {
            return "Round Ended";
        }
    
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    
        return `Round Ends In ${hours} h:${minutes}M:${seconds}S`;
    };
    
    function convertDateFormat() {

        const currentDate = new Date(); 
        const day = currentDate.getDate();
        const monthIndex = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const timePart = currentDate.toLocaleTimeString();
    
        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
    
        const monthName = monthNames[monthIndex];
        return `${day}-${monthName} ${year} ${timePart}`;
    }           
};
