const bidding = require('../../../models/student/bidding/bidding');
const cron = require('node-cron');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const confirmation = require('../../../models/student/confirmation/confirmation');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const addDrop = require('../../../models/student/addDrop/addDrop');
const demandEstimation = require('../../../models/student/demandEstimation/demandEstimation');
const course = require('../../../models/admin/course/course');


module.exports.respond = async (socket, io) => {

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
   
    socket.on('addDropPageLoad', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.start_date_time;
        let endTime = data.biddingTime.end_date_time;
        let roundId = data.roundId;
        let roundIId = data.roundIId;
        
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
        let roundId = data.roundId;       
        
        const startdatetimeDate = new Date(startTime);
        const currentDateTime = new Date();
        currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
        startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() +5, startdatetimeDate.getUTCMinutes()+ 30);

        const startMinute = startdatetimeDate.getUTCMinutes();
        const startHour = startdatetimeDate.getUTCHours();
        const startDate = startdatetimeDate.getUTCDate();
        const startMonth = startdatetimeDate.getUTCMonth() + 1; 

        startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
        if (!isNaN(startdatetimeDate)) { 
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
        
    // socket.on('demandEstimationPageLoad', (data) => {
      
    //     let slugName = data.slugName;
    //     let biddingId = data.biddingTime.bidding_session_lid;
    //     let startTime = data.biddingTime.startTime;
    //     let roundId = data.roundId;       
        
    //     const startdatetimeDate = new Date(startTime);
    //     const currentDateTime = new Date();
    //     currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
    //     startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() +5, startdatetimeDate.getUTCMinutes()+ 30);

    //     const startMinute = startdatetimeDate.getUTCMinutes();
    //     const startHour = startdatetimeDate.getUTCHours();
    //     const startDate = startdatetimeDate.getUTCDate();
    //     const startMonth = startdatetimeDate.getUTCMonth() + 1; 

    //     startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
        
    //     if (!isNaN(startdatetimeDate)) { 
    //         const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            
    //         cron.schedule(startCronSchedule, async () => {
    //             try {
    //                 const [roundSettingTimeResult, courseList] = await Promise.all([
    //                     roundSetting.startAndEndTime(slugName, biddingId, roundId),
    //                     demandEstimation.getAvailableCourseList(slugName, biddingId),
    //                 ]);
        
    //                 // const studentIdsToSendTo = ['1105', '1106'];
    
    //                 studentIdsToSendTo.forEach(studentId => {
    //                     const student = findStudentById(studentList, studentId);
    //                     if (student) {
    //                         io.to(student.socketId).emit('demandEsmationVisibleToStudent', {
    //                             roundDetails: roundSettingTimeResult.recordset,
    //                             courseList: courseList.recordset
    //                         });
    //                     } else {
    //                         console.error(`Student with ID ${studentId} not found.`);
    //                     }
    //                 });
    //             } catch (error) {
    //                 console.error('Error:', error);
    //                 io.emit('demandEsmationVisibleToStudent');
    //             }
    //         });
    //     }
        
    //     function findStudentById(studentList, studentId) {
    //         return studentList.find(student => student.id === studentId);
    //     }
        
    // });

    socket.on('demandEstimationPageLoad', (data) => {
        
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.startTime;
        let roundId = data.roundId;       
        
        const startdatetimeDate = new Date(startTime);
        const currentDateTime = new Date();
        currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
        startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours() +5, startdatetimeDate.getUTCMinutes()+ 30);

        const startMinute = startdatetimeDate.getUTCMinutes();
        const startHour = startdatetimeDate.getUTCHours();
        const startDate = startdatetimeDate.getUTCDate();
        const startMonth = startdatetimeDate.getUTCMonth() + 1; 

        startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
        
        if (!isNaN(startdatetimeDate)) { 
            const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
            
            cron.schedule(startCronSchedule, async () => {
                try {
                    const [roundSettingTimeResult, courseList] = await Promise.all([
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
        
    // socket.on('biddingPageLoad', (data) => {
        
    //     let slugName = data.slugName;
    //     let biddingId = data.biddingTime.bidding_session_lid;
    //     let startTime = data.biddingTime.start_date_time;
    //     let endTime = data.biddingTime.end_date_time;
    //     let roundId = data.roundId;
    //     let roundIId = data.roundIId;
    //     let studendId = data.studendId;
            
    //     const startdatetimeDate = new Date(startTime);
    //     const enddateTime = new Date(endTime);
    //     const currentDateTime = new Date();
        
    //     currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
    
    //     const startMinute = startdatetimeDate.getUTCMinutes();
    //     const startHour = startdatetimeDate.getUTCHours();
    //     const startDate = startdatetimeDate.getUTCDate();
    //     const startMonth = startdatetimeDate.getUTCMonth() + 1; 
        
    //     const endMinute = enddateTime.getUTCMinutes();
    //     const endHour = enddateTime.getUTCHours();
    //     const endDate = enddateTime.getUTCDate();
    //     const endMonth = enddateTime.getUTCMonth() + 1; 
        
    //     if (!isNaN(startdatetimeDate) && !isNaN(enddateTime)) {
    //         const startCronSchedule = `${startMinute} ${startHour} ${startDate} ${startMonth} *`;
    //         const endCronSchedule = `${endMinute} ${endHour} ${endDate} ${endMonth} *`;
          
    //         cron.schedule(startCronSchedule, async () => {

    //             try {
    //                     const [roundSettingTimeResult, listByOneDayBeforeResult] = await Promise.all([
    //                         roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
    //                         roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId)
    //                     ]);

    //                     io.emit('biddingVisibleToStudent', {
    //                         roundSetting: roundSettingTimeResult.recordset,
    //                         roundDetails: listByOneDayBeforeResult.recordset
    //                     });
    //                 } 
    //                 catch (error) {
    //                     console.error('Error:', error);
    //                     io.emit('biddingVisibleToStudent');
    //                 }
    //         });
        
    //         cron.schedule(endCronSchedule, async () => {
    //             try {
    //                     const [roundSettingTimeResult, listByOneDayBeforeResult, biddingCourses, courseList, considerationSet, confirmCourse, currentRoundStatus] = await Promise.all([
    //                         roundSetting.roundSettingTime(slugName, biddingId, roundId, roundIId),
    //                         roundSetting.listByOneDayBefore(slugName, biddingId, roundId, roundIId),
    //                         divisionBatch.biddingCourse(slugName, biddingId, studendId),
    //                         divisionBatch.courseList(slugName, biddingId),
    //                         bidding.considerationSet(slugName, biddingId, studendId, roundId, roundIId),
    //                         confirmation.getConfirmCourseList(slugName, biddingId, studendId),
    //                         bidding.currentRoundStatus(slugName, biddingId),
    //                     ]);
    //                     console.log('valuesof ')
    //                     io.emit('biddingVisibleToStudent', {
    //                         roundSetting: roundSettingTimeResult.recordset,
    //                         roundDetails: listByOneDayBeforeResult.recordset,
    //                         biddingCourses: biddingCourses.recordset,
    //                         courseList: courseList.recordset,
    //                         considerationSet: considerationSet.recordset,
    //                         confirmationCourse: confirmCourse.recordset,
    //                         currentRoundStatus: currentRoundStatus.recordset.length == 0 ? JSON.stringify({'round_status':'Round Not Found'}) : JSON.stringify(currentRoundStatus.recordset[0]),
    //                     });
    //                 } catch (error) {
    //                     console.error('Error:', error);
    //                     io.emit('biddingVisibleToStudent');
    //                 }
    //         });
    //     }
    // });

    socket.on('biddingPageLoad', (data) => {
      
        let slugName = data.slugName;
        let biddingId = data.biddingTime.bidding_session_lid;
        let startTime = data.biddingTime.start_date_time;
        let endTime = data.biddingTime.end_date_time;
        let roundId = data.roundId;
        let roundIId = data.roundIId;
        let studendId = data.studentId;
    
        const startdatetimeDate = new Date(startTime);
        const enddateTime = new Date(endTime);
        const currentDateTime = new Date();

        currentDateTime.setUTCHours(currentDateTime.getUTCHours() + 5, currentDateTime.getUTCMinutes() + 30)
        startdatetimeDate.setUTCHours(startdatetimeDate.getUTCHours(), startdatetimeDate.getUTCMinutes());
        enddateTime.setUTCHours(enddateTime.getUTCHours(), enddateTime.getUTCMinutes());

        const startMinute = startdatetimeDate.getUTCMinutes();
        const startHour = startdatetimeDate.getUTCHours();
        const startDate = startdatetimeDate.getUTCDate();
        const startMonth = startdatetimeDate.getUTCMonth() + 1; 

        startdatetimeDate.setUTCDate(startdatetimeDate.getUTCDate());
        const endMinute = enddateTime.getUTCMinutes();
        const endHour = enddateTime.getUTCHours();
        const endDate = enddateTime.getUTCDate();
        const endMonth = enddateTime.getUTCMonth() + 1; 

        if (!isNaN(startdatetimeDate) && !isNaN(enddateTime)) { 
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
            if (parsedMessage.status == 1) {
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
        
        if (!isNaN(enddateTime)) { 
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
    
    
};
