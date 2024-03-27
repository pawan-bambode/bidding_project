

module.exports.respond =  async(socket, io) => {

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
    
        const startMinute = startdatetimeDate.getMinutes();
        const startHour = startdatetimeDate.getHours();
        const startDate = startdatetimeDate.getDate();
        const startMonth = startdatetimeDate.getMonth() + 1; 

        const endMinute = enddateTime.getMinutes();
        const endHour = enddateTime.getHours();
        const endDate = enddateTime.getDate();
        const endMonth = enddateTime.getMonth() + 1; 

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
}