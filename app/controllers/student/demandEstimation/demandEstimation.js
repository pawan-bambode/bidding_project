const demandEstimation = require('../../../models/student/demandEstimation/demandEstimation');
const course = require('../../../models/admin/course/course');
const programSession = require('../../../models/admin/programs/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const isJsonString = require('../../../utils/util');
const concentrationSetting = require('../../../models/admin/concentrationsettings/concentrationsettings');

module.exports = {
    getHomePage: (req, res) => {
        let demandEstimationUrl = req.route.path.split('/');
        let roundId = 1;
        let demandEstimationActive = demandEstimationUrl[demandEstimationUrl.length - 1];
        Promise.all([
            demandEstimation.getDemandEstimationRoundList(res.locals.slug, res.locals.biddingId),
            course.getAvailableCourseList(res.locals.slug, res.locals.biddingId),
            course.getAvailableCourseCount(res.locals.slug, res.locals.biddingId),
            course.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId),
            programSession.getCredits(res.locals.slug, res.locals.biddingId),
            roundSetting.getRoundLid(res.locals.slug, res.locals.biddingId),
            roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId, roundId),
            demandEstimation.getSelectedCourses(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            concentrationSetting.studentList(res.locals.slug, res.locals.biddingId, res.locals.username),
            concentrationSetting.totalCreditCount(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('student/demandEstimation/index', {
                active: demandEstimationActive,
                demandEstimationRounds: result[0].recordset,
                courseList: result[1].recordset,
                pageCount: result[2].recordset[0].count,
                dropdownAcadSessionList: result[3].recordset,
                creditList: result[4].recordset,
                roundLid: result[5].recordset[0].round_lid,
                startAndEndTime: result[6].recordset[0],
                selectCourse: result[7].recordset,
                concentrationSettings: (result[8].recordset && result[8].recordset.length !== 0) ? result[8].recordset[0] : 0,
                totalCreditsCounts: result[9].recordset[0].totalCount
            });
        });
    },

    getCoursesByAcadSession: (req, res) => {
        Promise.all([
            demandEstimation.getCourseListByAcadSession(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.acadSessionId),
            demandEstimation.getCourseCountByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId),
            demandEstimation.getAreaList(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                courseList: result[0].recordset,
                courseCount: result[1].recordset[0].count,
                areaList: result[2].recordset
            });
        }).catch(error => {
            res.status(500).json(error.originalError.info.message);
        });
    },

    getCoursesByAreaName: (req, res) => {
        Promise.all([
            demandEstimation.getCourseListByAreaName(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.acadSessionId, req.body.areaName),
            demandEstimation.getCountOfCourseListByAreaName(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                courseList: result[0].recordset,
                courseCount: result[1].recordset[0].count,
            });
        }).catch(error => {
            res.status(500).json(error.originalError.info.message);
        });
    },

    searchByLetter: (req, res) => {
        demandEstimation.searchByLetter(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry, req.body.acadSessionId, req.body.area)
            .then(result => {
                res.json({
                    status: '200',
                    message: 'Result fetched',
                    courseList: result[0].recordset,
                });
            }).catch(error => {
                res.status(500).json(error.originalError.info.message);
            });
    },

    showEntryCourseList: (req, res) => {
        demandEstimation.showEntryCouresList(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo)
            .then(result => {
                res.json({
                    status: '200',
                    message: 'Result fetched',
                    data: result[0].recordset,
                    length: result[1].recordset[0]['']
                });
            }).catch(error => {
                res.status(500).json(error.originalError.info.message);
            });
    },

    selectedCourseSave: (req, res) => {
        let object = {
            import_selected_courses: JSON.parse(req.body.inputJSON)
        };
        demandEstimation.saveSelectedCourse(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body.studentLid, req.body.roundLid, object)
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
