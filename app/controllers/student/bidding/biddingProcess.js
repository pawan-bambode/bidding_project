const bidding = require('../../../models/student/bidding/bidding');
const cron = require('node-cron');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const confirmation = require('../../../models/student/confirmation/confirmation');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const addDrop = require('../../../models/student/addDrop/addDrop');


module.exports.respond = async (socket, io) => {

    socket.on('join', function (data) {
        // Join room logic
    });
      

    socket.on('biddingPageLoaded', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.start_date_time;
        let endTime = data.biddingTime.end_date_time;
        let roundId = data.roundId;
        let roundIId = data.roundIId;
        let studendId = data.studendId;
    

const startdatetimeDate = new Date(startTime);
const enddateTime = new Date(endTime);
const currentDateTime = new Date();

currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours(), startdatetimeDate.getUTCMinutes());
enddateTime.setUTCHours(enddateTime.getUTCHours(), enddateTime.getUTCMinutes());

const startMinute = startdatetimeDate.getUTCMinutes();
const startHour = startdatetimeDate.getUTCHours();
const startDate = startdatetimeDate.getUTCDate()-1;
const startMonth = startdatetimeDate.getUTCMonth() + 1; 

startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
const endMinute = enddateTime.getUTCMinutes();
const endHour = enddateTime.getUTCHours();
const endDate = enddateTime.getUTCDate();
const endMonth = enddateTime.getUTCMonth() + 1; 

const currentDate = currentDateTime.getUTCMinutes();
    if((startdatetimeDate  != 'Invalid Date') && (endDate != 'Invalid Date')) {
    const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
    const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
   
    cron.schedule(startCronSchedule, async () => {
        try {
            const [roundSettingTimeResult, listByOneDayBeforeResult, biddingCourses, courseList] = await Promise.all([
                roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                divisionBatch.biddingCourse(slugName, biddingId, studendId),
                divisionBatch.courseList(slugName, biddingId),
            ]);

            io.emit('biddingVisibleToStudent', {
                roundSetting: roundSettingTimeResult.recordset,
                roundDetails: listByOneDayBeforeResult.recordset,
                biddingCourses: biddingCourses.recordset,
                courseList: courseList.recordset
            });
        } catch (error) {
            console.error('Error:', error);
            io.emit('biddingVisibleToStudent');
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

            io.emit('biddingVisibleToStudent', {
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
            io.emit('biddingVisibleToStudent');
        }
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
    

        const startdatetimeDate = new Date(startTime);
        const enddateTime = new Date(endTime);
        const currentDateTime = new Date();

        currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
        startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() + 5, startdatetimeDate.getUTCMinutes() + 30);
        enddateTime.setUTCHours(enddateTime.getUTCHours() + 5, enddateTime.getUTCMinutes() + 30);


        const startMinute = startdatetimeDate.getUTCMinutes();
        const startHour = startdatetimeDate.getUTCHours();
        const startDate = startdatetimeDate.getUTCDate();
        const startMonth = startdatetimeDate.getUTCMonth() + 1; 

        startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
        const endMinute = enddateTime.getUTCMinutes();
        const endHour = enddateTime.getUTCHours();
        const endDate = enddateTime.getUTCDate();
        const endMonth = enddateTime.getUTCMonth() + 1; 

        const currentDate = currentDateTime.getUTCMinutes();


            const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
        
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
            });

        
    socket.on('addBidding', async biddingDetails => {
        
        try {
            const { slugName, studentLid, round_lid, courseLid, divisionBatchLid, concentration_lid, biddingSessionId, userId } = biddingDetails;

            const result = await bidding.addBidding(slugName, studentLid, round_lid, courseLid, concentration_lid, divisionBatchLid, userId, biddingSessionId);
            
            const parsedMessage = JSON.parse(result.output.output_json);
           
            if (parsedMessage.status === 1) {
                const detailsResult = await bidding.getAddBiddingDetails(slugName, biddingSessionId, divisionBatchLid);
                io.emit("addBiddingResponse", {
                    message: parsedMessage,
                    biddingDetails: detailsResult.recordset,
                    userId: userId
                });
            } else {
                io.emit("addBiddingResponse", {
                    message: parsedMessage,
                    userId: userId
                });
            }
        } catch (error) {
           
            io.emit("addBiddingResponse", {
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

                io.emit("withdrawBiddingResponse", {
                    message: parsedMessage,
                    withdrawBiddingCourse: detailsResult[0].recordset,
                    courseList: detailsResult[1].recordset,
                    userId: userId,
                    divisionId: divisionBatchLid
                });
            } else {
                io.emit("withdrawBiddingResponse", {
                    message: parsedMessage,
                    userId: userId
                });
            }
        } catch (error) {
            
            io.emit("withdrawBiddingResponse", {
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


        
        
        module.exports.respond = async (socket, io) => {
        
            socket.on('join', function (data) {
                // Join room logic
            });
            
            socket.on('addDropPageLoad', (data) => {
                
                let slugName = data.slugName;
                let biddingId = data.biddingTime.bidding_session_lid;
                let startTime = data.biddingTime.start_date_time;
                let endTime = data.biddingTime.end_date_time;
                let roundId = data.roundId;
                let roundIId = data.roundIId;
                let studendId = data.studentId;
                let confirmationRound1Id = 3;
                let confirmationRound2Id = 5;
            
            
        
                const startdatetimeDate = new Date(startTime);
                const enddateTime = new Date(endTime);
                const currentDateTime = new Date();
        
                currentDateTime.setUTCHours(currentDateTime.getUTCHours(), currentDateTime.getUTCMinutes())
                startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() , startdatetimeDate.getUTCMinutes());
                enddateTime.setUTCHours(enddateTime.getUTCHours() , enddateTime.getUTCMinutes() );
        
        
                const startMinute = startdatetimeDate.getUTCMinutes();
                const startHour = startdatetimeDate.getUTCHours();
                const startDate = startdatetimeDate.getUTCDate();
                const startMonth = startdatetimeDate.getUTCMonth() + 1; 
        
                startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
                const endMinute = enddateTime.getUTCMinutes();
                const endHour = enddateTime.getUTCHours();
                const endDate = enddateTime.getUTCDate();
                const endMonth = enddateTime.getUTCMonth() + 1; 
        
                const currentDate = currentDateTime.getUTCMinutes();
        
                    const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
                    const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
                  
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
                    });
         
            socket.on('waitListPageLoaded', (data) => {
                
                let slugName = data.slugName;
                let biddingId = data.biddingTime.bidding_session_lid;
                let startTime = data.biddingTime.startTime;
                let endTime = data.biddingTime.endTime;
                let roundId = data.roundId;       
                let studendId = data.studentId;
                
                const startdatetimeDate = new Date(startTime);
                const currentDateTime = new Date();
                currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
                startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() +5, startdatetimeDate.getUTCMinutes()+ 30);
        
                const startMinute = startdatetimeDate.getUTCMinutes();
                const startHour = startdatetimeDate.getUTCHours();
                const startDate = startdatetimeDate.getUTCDate();
                const startMonth = startdatetimeDate.getUTCMonth() + 1; 
        
                startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
                
                if((startdatetimeDate  != 'Invalid Date')) {
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
                        console.error('Error:', error);
                        io.emit('waitlistVisibleToStudent');
                    }
                });
        
                }
            });
        
            socket.on('demandEstimationPageLoad', (data) => {
              
                let slugName = data.slugName;
                let biddingId = data.biddingTime.bidding_session_lid;
                let startTime = data.biddingTime.startTime;
                let endTime = data.biddingTime.endTime;
                let roundId = data.roundId;       
                let studendId = data.studentId;
                
                const startdatetimeDate = new Date(startTime);
                const currentDateTime = new Date();
                currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
                startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() +5, startdatetimeDate.getUTCMinutes()+ 30);
        
                const startMinute = startdatetimeDate.getUTCMinutes();
                const startHour = startdatetimeDate.getUTCHours();
                const startDate = startdatetimeDate.getUTCDate();
                const startMonth = startdatetimeDate.getUTCMonth() + 1; 
        
                startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
                
                if((startdatetimeDate  != 'Invalid Date')) {
                const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
                
                cron.schedule(startCronSchedule, async () => {
                    try {
                        const [roundSettingTimeResult, courseList] = await Promise.all([
                            roundSetting.startAndEndTime(slugName, biddingId, roundId),
                            divisionBatch.courseList(slugName, biddingId),
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
        
            socket.on('biddingPageLoad', (data) => {
               
                let slugName = data.slugName;
                let biddingId = data.biddingTime.bidding_session_lid;
                let startTime = data.biddingTime.start_date_time;
                let endTime = data.biddingTime.end_date_time;
                let roundId = data.roundId;
                let roundIId = data.roundIId;
                let studendId = data.studendId;
            
        
        const startdatetimeDate = new Date(startTime);
        const enddateTime = new Date(endTime);
        const currentDateTime = new Date();
        
        currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
        startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours(), startdatetimeDate.getUTCMinutes());
        enddateTime.setUTCHours(enddateTime.getUTCHours(), enddateTime.getUTCMinutes());
        
        const startMinute = startdatetimeDate.getUTCMinutes();
        const startHour = startdatetimeDate.getUTCHours();
        const startDate = startdatetimeDate.getUTCDate()-1;
        const startMonth = startdatetimeDate.getUTCMonth() + 1; 
        
        startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
        const endMinute = enddateTime.getUTCMinutes();
        const endHour = enddateTime.getUTCHours();
        const endDate = enddateTime.getUTCDate();
        const endMonth = enddateTime.getUTCMonth() + 1; 
        
        const currentDate = currentDateTime.getUTCMinutes();
            if((startdatetimeDate  != 'Invalid Date') && (endDate != 'Invalid Date')) {
            const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
           
            cron.schedule(startCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, listByOneDayBeforeResult, biddingCourses, courseList] = await Promise.all([
                        roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                        roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                        divisionBatch.biddingCourse(slugName, biddingId, studendId),
                        divisionBatch.courseList(slugName, biddingId),
                    ]);
        
                    io.emit('biddingVisibleToStudent', {
                        roundSetting: roundSettingTimeResult.recordset,
                        roundDetails: listByOneDayBeforeResult.recordset,
                        biddingCourses: biddingCourses.recordset,
                        courseList: courseList.recordset
                    });
                } catch (error) {
                    console.error('Error:', error);
                    io.emit('biddingVisibleToStudent');
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
        
                    io.emit('biddingVisibleToStudent', {
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
                    io.emit('biddingVisibleToStudent');
                }
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
            
        
                const startdatetimeDate = new Date(startTime);
                const enddateTime = new Date(endTime);
                const currentDateTime = new Date();
        
                currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
                startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() + 5, startdatetimeDate.getUTCMinutes() + 30);
                enddateTime.setUTCHours(enddateTime.getUTCHours() + 5, enddateTime.getUTCMinutes() + 30);
        
        
                const startMinute = startdatetimeDate.getUTCMinutes();
                const startHour = startdatetimeDate.getUTCHours();
                const startDate = startdatetimeDate.getUTCDate();
                const startMonth = startdatetimeDate.getUTCMonth() + 1; 
        
                startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
                const endMinute = enddateTime.getUTCMinutes();
                const endHour = enddateTime.getUTCHours();
                const endDate = enddateTime.getUTCDate();
                const endMonth = enddateTime.getUTCMonth() + 1; 
        
                const currentDate = currentDateTime.getUTCMinutes();
        
        
                    const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
                    const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
                    if((startdatetimeDate  != 'Invalid Date') && (endDate != 'Invalid Date')) {
                    cron.schedule(startCronSchedule, async () => {
                        try {
                            const [roundSettingTimeResult, listByOneDayBeforeResult, winningCourse] = await Promise.all([
                                roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                                roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                                confirmation.winningCourseList(slugName, biddingId, studendId,  roundId, roundIId)
                            ]);
                        
                            io.emit('activeConfirmationRound', {
                                roundSetting: roundSettingTimeResult.recordset,
                                roundDetails: listByOneDayBeforeResult.recordset,
                                winningCourse: winningCourse.recordset
                            });
                        } catch (error) {
                            console.error('Error:', error);
                            io.emit('activeConfirmationRound');
                        }
                    });
                
                    cron.schedule(endCronSchedule, async () => {
                        try {
                            const [roundSettingTimeResult, listByOneDayBeforeResult, confirmCourse, winningCourse] = await Promise.all([
                                roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
                                roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
                                confirmation.getConfirmCourseList(slugName, biddingId, studendId,  roundId, roundIId),
                                confirmation.winningCourseList(slugName, biddingId, studendId,  roundId, roundIId)
                            ]);
                        
                            io.emit('activeConfirmationRound', {
                                roundSetting: roundSettingTimeResult.recordset,
                                roundDetails: listByOneDayBeforeResult.recordset,
                                confirmationCourse: confirmCourse.recordset,
                                winningCourse: winningCourse.recordset
                            });
                        } catch (error) {
                            console.error('Error:', error);
                            io.emit('activeConfirmationRound');
                        }
                    });
                }
                    });
        
                
            socket.on('addBidding', async biddingDetails => {
                
                try {
                    const { slugName, studentLid, round_lid, courseLid, divisionBatchLid, concentration_lid, biddingSessionId, userId } = biddingDetails;
        
                    const result = await bidding.addBidding(slugName, studentLid, round_lid, courseLid, concentration_lid, divisionBatchLid, userId, biddingSessionId);
                    
                    const parsedMessage = JSON.parse(result.output.output_json);
                   
                    if (parsedMessage.status === 1) {
                        const detailsResult = await bidding.getAddBiddingDetails(slugName, biddingSessionId, divisionBatchLid);
                        io.emit("addBiddingResponse", {
                            message: parsedMessage,
                            biddingDetails: detailsResult.recordset,
                            userId: userId
                        });
                    } else {
                        io.emit("addBiddingResponse", {
                            message: parsedMessage,
                            userId: userId
                        });
                    }
                } catch (error) {
                   
                    io.emit("addBiddingResponse", {
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
        
                        io.emit("withdrawBiddingResponse", {
                            message: parsedMessage,
                            withdrawBiddingCourse: detailsResult[0].recordset,
                            courseList: detailsResult[1].recordset,
                            userId: userId,
                            divisionId: divisionBatchLid
                        });
                    } else {
                        io.emit("withdrawBiddingResponse", {
                            message: parsedMessage,
                            userId: userId
                        });
                    }
                } catch (error) {
                    
                    io.emit("withdrawBiddingResponse", {
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
        
            socket.on('roundEnded', (data) => {
                 
                let endDateTime = data.startTime.endTime;
                let roundId = data.startTime.round_lid;
                let slugName = data.slugName;
                let biddingSessionId = data.startTime.bidding_session_lid;
        
                const enddateTime = new Date(endDateTime);
                const endMinute = enddateTime.getMinutes();
                const endHour = enddateTime.getHours();
                const endDate = enddateTime.getDate();
                const endMonth = enddateTime.getMonth() + 1;
                const endYear = enddateTime.getFullYear();
                
                if(enddateTime != 'Invalid Date') {
                const startCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`; 
        
                cron.schedule(startCronSchedule, () => {
                  
                        confirmation.roundEnd(slugName, roundId, biddingSessionId)
                        .then(result => {
                        })
                        .catch(error => {
                            
                           
                        });
                });
            }
            });
        };
        
       
};
