const bidding = require('../../../models/student/bidding/bidding');

module.exports.respond = async (socket, io) => {

    socket.on('join', function (data) {
    });

    socket.on('addBidding',async biddingDetails => {
        
        let slug = biddingDetails.slugName;
        let studentId = biddingDetails.studentLid;
        let roundId = biddingDetails.round_lid;
        let courseId = biddingDetails.courseLid;
        let divisionId = biddingDetails.divisionBatchLid;
        let concentrationId = biddingDetails.concentration_lid;
        let biddingSessionId = biddingDetails.biddingSessionId;
        let userId = biddingDetails.userId;
 
        bidding.addBidding(slug, studentId, roundId, courseId, concentrationId, divisionId, userId, biddingSessionId).then(result =>{
            const parsedMessage = JSON.parse(result.output.output_json);
            if (parsedMessage.status === 1) {
                Promise.all([bidding.getAddBiddingDetails(slug, biddingSessionId, divisionId)]).then(result =>{
                                io.emit("addBiddingResponse", {
                                    message: parsedMessage,
                                    biddingDetails: result[0].recordset,
                                    userId: userId
                                });
                             })
            } else {
                io.emit("addBiddingResponse", {
                    message: JSON.parse(error.originalError.info.message),
                    userId: userId
                });
            }
        }).catch(error =>{
            io.emit("addBiddingResponse", {
                    message: JSON.parse(error.originalError.info.message),
                    userId: userId
                });
        })
    });

    socket.on('withdrawBidding', async biddingDetails => {
        
        let slug = biddingDetails.slugName;
        let studentBiddingId = biddingDetails.id;
        let studentId = biddingDetails.studentLid;
        let roundId = biddingDetails.round_lid;
        let divisionId = biddingDetails.divisionBatchLid;
        let biddingSessionId = biddingDetails.biddingSessionId;
        let userId = biddingDetails.userId;

            bidding.withdrawBidding(slug, studentBiddingId, studentId, roundId, divisionId, userId, biddingSessionId).then(result =>{
                const parsedMessage = JSON.parse(result.output.output_json);
                if (parsedMessage.status === 1) {
                    Promise.all([bidding.getWithdrawBiddingDetails(slug, biddingSessionId, divisionId),
                                 bidding.getWithdrawBiddingCourse(slug, biddingSessionId, divisionId, studentId)]).then(result =>{
                                    io.emit("withdrawBiddingResponse", {
                                        message: parsedMessage,
                                        withdrawBiddingCourse: result[0].recordset,
                                        courseList: result[1].recordset,
                                        userId: userId,
                                        divisionId: divisionId
                                    });
                                 })
                } else {
                    io.emit("withdrawBiddingResponse", {
                        message: JSON.parse(error.originalError.info.message),
                        userId: userId
                    });
                }
            }).catch(error => {
                io.emit("withdrawBiddingResponse", {
                    message: JSON.parse(error.originalError.info.message),
                    userId: userId
                });
            })        
    });

    socket.on('studentBidding', (biddingDetails) => {
       
        let slug = biddingDetails.slugName;
        let studentId = biddingDetails.studentId;
        let roundId = biddingDetails.roundId;
        let divBatchId = biddingDetails.divBatchId;
        let userId = biddingDetails.userId;
        let biddingSessionId = biddingDetails.biddingSessionId;
        let inputJson = biddingDetails.inputJson;
        
        
        bidding.studentBidByPoints(slug, studentId, roundId, divBatchId, userId, biddingSessionId, inputJson).then(result =>{
           
            const parsedMessage = JSON.parse(result.output.output_json);
            
            if (parsedMessage.status === 1) {
                Promise.all([bidding.getBiddingWinningResponse(slug, biddingSessionId, divBatchId),
                bidding.getMRBPointsResponse(slug, biddingSessionId, divBatchId)]).then(result =>{
                                io.emit("studentBiddingResponse", {
                                    studentBiddingResponse: parsedMessage,
                                    minimumRequireBits: result[1].recordset[0],
                                    divisionId: divBatchId,
                                    userId: userId
                                });
                             })
            } else {
                io.emit("studentBiddingResponse", {
                    studentBiddingResponse: JSON.parse(error.originalError.info.message),
                    userId: userId
                });
            }
        }).catch(error =>{

            io.emit("studentBiddingResponse", {
                studentBiddingResponse: JSON.parse(error.originalError.info.message),
                userId: userId
            });
        })         
    });
};
