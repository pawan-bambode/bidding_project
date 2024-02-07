const confirmation = require('../../../models/student/confirmation/confirmation');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        let confirmationUrl = req.route.path.split('/');
        let confirmationActive = confirmationUrl[confirmationUrl.length - 1];
        let roundId = req.body.roundId != undefined ? req.body.roundId : 3;

        Promise.all([
            confirmation.winningCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId, roundId),
            confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId, roundId),
            roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId, roundId)
        ]).then(result => {
            res.render('student/confirmation/index', {
                active: confirmationActive,
                winningCourseList: result[0].recordset,
                confirmCourseList: result[1].recordset,
                startAndEndTime: result[2].recordset[0]
            });
        });
    },

    getDetailsRoundWise: (req, res) => {
        let roundId = req.body.roundId != undefined ? req.body.roundId : 3;
        Promise.all([
            confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId, req.body.roundId),
            confirmation.winningCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId, roundId),
            roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId, req.body.roundId)
        ]).then(result => {
            res.json({
                status: "200",
                active: 'confirmation',
                confirmCourseList: result[0].recordset,
                winningCourseList: result[1].recordset,
                startAndEndTime: result[2].recordset[0]
            });
        }).catch(error => {
            res.status(500).json(JSON.parse(error.originalError.info.message));
        });
    },

    addConfirmCourse: (req, res) => {
        confirmation.addConfirmCourse(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.inputJson)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if (isJsonString.isJsonString(error.originalError.info.message)) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.status(500).json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    }
};
