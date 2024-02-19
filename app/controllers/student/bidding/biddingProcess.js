const bidding = require('../../../models/student/bidding/bidding');
const cron = require('node-cron');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');



module.exports.respond = async (socket, io) => {

    socket.on('join', function (data) {
        // Join room logic
    });
      
    socket.on('biddingPageLoaded', (data) => {
        let startDateTime = data.biddingTime.start_date_time;

        const datetime = new Date(startDateTime);
    
        const minute = datetime.getUTCMinutes();
        const hour = datetime.getUTCHours();
        const date = datetime.getUTCDate()-1;
        const month = datetime.getUTCMonth() + 1;
        const year = datetime.getUTCFullYear();

        const cronSchedule = `${minute} ${hour} ${date} ${month} *`; 
        cron.schedule(cronSchedule, () => {
            io.emit('biddingVisibleToStudent');
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
};
