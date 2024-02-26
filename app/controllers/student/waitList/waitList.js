const confirmation = require('../../../models/student/confirmation/confirmation');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const waitList = require('../../../models/student/waitList/waitlist');

module.exports = {
    getPage: (req, res) => {
        let waitListUrl = req.route.path.split('/');
        let wait = waitListUrl[waitListUrl.length - 1];
        let roundId = 6;
        Promise.all([
            confirmation.getConfirmationForBidding(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            roundSetting.startAndEndTime(res.locals.slug, res.locals.biddingId, roundId),
            course.acadSessionList(res.locals.slug, res.locals.biddingId),
            divisionBatch.areaList(res.locals.slug, res.locals.biddingId),
            divisionBatch.waitlistAvailableCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            waitList.getStudentDetails(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            waitList.getWaitListCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId, roundId),
            roundSetting.demandEstimOneDayBefore(res.locals.slug, res.locals.biddingId, roundId)
        ]).then(result => {
            
            res.render('student/waitlist/index', {
                active: wait,
                confirmCourseList: result[0].recordset,
                startAndEndTime: result[1].recordset[0] != undefined? result[1].recordset[0] : '',
                dropdownAcadSessionList: result[2].recordset,
                areaList: result[3].recordset,
                courseList: result[4].recordset,
                concentrationId: result[5].recordset[0].concentrationId,
                waitListCourses: result[6].recordset,
                roundDetails: result[7].recordset[0] !== undefined ? result[7].recordset[0]: '',

            });
        }).catch(error => {
            
            res.status(500).json(JSON.parse(error.originalError.info.message));
        });
    },

    addWaitList: (req, res) => {
        let studentId = req.body.studentId;
        let roundId = req.body.roundId;
        let courseId = req.body.courseId;
        let divisionId = req.body.divBatchId;
        let concentrationId = req.body.concentrationId;

        waitList.addWaitList(res.locals.slug, studentId, roundId, courseId, concentrationId, divisionId, res.locals.userId, res.locals.biddingId).then(result => {
            res.json({
                status: 200,
                addWaitListResponse: result.output.output_json
            });
        }).catch(error => {
            res.json({
                error: error.originalError.info.message,
            });
        });
    },

    addBidPoints: (req, res) => {
        let id = req.body.id;
        let studentId = req.body.studentId;
        let roundId = req.body.roundId;
        let divBatchId = req.body.divBatchId;
        let bidPoints = req.body.bidPoints;
        let previousBidPoints = req.body.previousBidPoints;

        waitList.addBidPoints(res.locals.slug, id, studentId, roundId, divBatchId, bidPoints, previousBidPoints, res.locals.userId, res.locals.biddingId).then(result => {
            res.json({
                status: 200,
                addWaitListPoints: result.output.output_json
            });
        }).catch(error => {
            res.json({
                error: error.originalError.info.message,
            });
        });
    },

    withdraw: (req, res) => {
        let id = req.body.id;
        let studentId = req.body.studentId;
        let roundId = req.body.roundId;
        let divBatchId = req.body.divBatchId;

        waitList.withdraw(res.locals.slug, id, studentId, roundId, divBatchId, res.locals.userId, res.locals.biddingId).then(result => {
            res.json({
                status: 200,
                addWaitListPoints: result.output.output_json
            });
        }).catch(error => {
            res.json({
                error: error.originalError.info.message,
            });
        });
    },
};
