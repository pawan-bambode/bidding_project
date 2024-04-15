const demandEstimation = require('../../../models/student/demandEstimation/demandEstimation');
const course = require('../../../models/admin/course/course');
const programSession = require('../../../models/admin/programSession/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const isJsonString = require('../../../utils/util');
const concentrationSetting = require('../../../models/admin/concentrationsettings/concentrationsettings');
const student = require('../../../models/Students');

module.exports = {
    getPage: (req, res) => {
        let demandEstimationUrl = req.route.path.split('/');
        let roundId = 1;
        let demandEstimationActive = demandEstimationUrl[demandEstimationUrl.length - 1];
        Promise.all([
            demandEstimation.getRoundDetails(res.locals.slug, res.locals.biddingId),
            demandEstimation.getAvailableCourses(res.locals.slug, res.locals.biddingId),
            demandEstimation.getAvailableCourseCount(res.locals.slug, res.locals.biddingId),
            course.acadSessions(res.locals.slug, res.locals.biddingId),
            programSession.acadSessionsWiseCredits(res.locals.slug, res.locals.biddingId),
            roundSetting.startAndEndTime(res.locals.slug, res.locals.biddingId, roundId),
            demandEstimation.getSelectedCourses(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            concentrationSetting.studentList(res.locals.slug, res.locals.biddingId, res.locals.username),
            concentrationSetting.totalCreditCount(res.locals.slug, res.locals.biddingId),
            roundSetting.demandEstimOneDayBefore(res.locals.slug, res.locals.biddingId, roundId),
            demandEstimation.completedCourses(res.locals.slug, res.locals.biddingId, res.locals.useSapId),
            demandEstimation.isStudentPartOfRound(res.locals.slug, res.locals.biddingId, res.locals.studentId,roundId),
            roundSetting.currentRoundStatus(res.locals.slug, res.locals.biddingId, roundId)
        ]).then(result => {
            
            res.render('student/demandEstimation/index', {
                active: demandEstimationActive,
                demandEstimationRounds: result[0].recordset,
                availableCourses: result[1].recordset,
                pageCount: result[2].recordset[0].count,
                acadSessions: result[3].recordset,
                targetCreditList: result[4].recordset,
                startAndEndTime: result[5].recordset[0] != undefined? result[5].recordset[0] : '',
                selectedCourses: result[6].recordset,
                concentrationSet: (result[7].recordset && result[7].recordset.length !== 0) ? result[7].recordset[0] : 0,
                totalCreditsCounts: result[8].recordset[0] != undefined ? result[8].recordset[0].totalCount :0,
                roundDetails: result[9].recordset[0] !== undefined ? result[9].recordset[0] : '',
                completedCourse: result[10].recordset !== undefined ? result[10].recordset: '',
                isStudentPartOfRound: result[11].recordset.length,
                currentRoundStatus: result[12].recordset.length == 0 ?JSON.parse(JSON.stringify({'round_status':'Round Not Found'})) : JSON.parse(JSON.stringify(result[12].recordset[0]))
            });
        });
    },

    coursesByAcad : (req, res) => {
        Promise.all([
            demandEstimation.getCourseListByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId),
            demandEstimation.getCourseCountByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId),
            demandEstimation.getAreaList(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                availableCourses: result[0].recordset,
                courseCount: result[1].recordset[0].count,
                areaList: result[2].recordset
            });
        }).catch(error => { 
            res.status(500).json(error.originalError.info.message);
        });
    },

    courseByArea : (req, res) => {
        Promise.all([
            demandEstimation.coursesByAreaForDemandEst(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaId),
            demandEstimation.coursesByAreaCount(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaId)
        ]).then(result => {
            result[0].recordset
            res.json({
                status: "200",
                message: "Sucessfull",
                availableCourses: result[0].recordset,
                courseCount: result[1].recordset[0].count,
            });
        }).catch(error => {
            res.status(500).json(error.originalError.info.message);
        });
    },

    // searchByLetter: (req, res) => {
    //     demandEstimation.searchByLetter(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry, req.body.acadSessionId, req.body.area)
    //         .then(result => {
    //             res.json({
    //                 status: '200',
    //                 message: 'Result fetched',
    //                 courseList: result[0].recordset,
    //             });
    //         }).catch(error => {
    //             res.status(500).json(error.originalError.info.message);
    //         });
    // },

    save: (req, res) => {
        let object = {
            import_selected_courses: JSON.parse(req.body.inputJSON)
        };
        demandEstimation.save(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body.studentLid, req.body.roundLid, object)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            }).catch(error => {
                
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


