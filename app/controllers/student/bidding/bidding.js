const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const programSession = require('../../../models/admin/programSession/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const concentrationSetting = require('../../../models/admin/concentrationsettings/concentrationsettings');
const biddingClass = require('../../../models/student/bidding/bidding');
const confirmation = require('../../../models/student/confirmation/confirmation');
const isJsonString = require('../../../utils/util');
const demandEstimation = require('../../../models/student/demandEstimation/demandEstimation');

module.exports = {
    
    getPage: (req, res) => {
        let biddingUrl = req.route.path.split('/');
        let bidding = biddingUrl[biddingUrl.length - 1];
        let slug = res.locals.slug;
        let round1Id = 2, round2Id = 4;
                
                return Promise.all([
                    roundSetting.listByOneDayBefore(res.locals.slug, res.locals.biddingId, round1Id, round2Id),
                    concentrationSetting.list(res.locals.slug, res.locals.biddingId),
                    programSession.acadSessionsWiseCredits(res.locals.slug, res.locals.biddingId),
                    roundSetting.startAndEndTime(res.locals.slug, res.locals.biddingId, round1Id),
                    roundSetting.roundSettingTime(res.locals.slug, res.locals.biddingId, round1Id, round2Id),  
                    divisionBatch.biddingCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId, round1Id, round2Id),
                    divisionBatch.courseList(res.locals.slug, res.locals.biddingId),
                    divisionBatch.areaList(res.locals.slug, res.locals.biddingId),
                    biddingClass.considerationSet(res.locals.slug, res.locals.biddingId, res.locals.studentId, round1Id, round2Id),
                    biddingClass.studentBidPoints(res.locals.slug, res.locals.biddingId, res.locals.studentId),
                    biddingClass.updateBidPoints(res.locals.slug, res.locals.biddingId, res.locals.studentId),
                    confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
                    biddingClass.currentRoundStatus(res.locals.slug, res.locals.biddingId),
                    biddingClass.isStudentPartOfRound(res.locals.slug, res.locals.biddingId, res.locals.studentId, round1Id, round2Id)
                    
                ])
            .then(result => {
                
                res.render('student/bidding/index', {
                    active: bidding,
                    slug: slug,
                    roundDetails: result[0].recordset[0] !== undefined ? result[0].recordset[0] : '',
                    concentrationSet: result[1].recordset[0],
                    acadSessionsWiseCredits: result[2].recordset,
                    startAndEndTime: result[3].recordset[0] !== undefined ? result[3].recordset[0] : '',
                    roundSettingTime : result[4].recordset[0] != undefined ? result[4].recordset[0] :0,
                    biddingCourseList:  result[5].recordset != undefined ? result[5].recordset : '',
                    courseList: result[6].recordset,
                    areaList: result[7].recordset,
                    considerationSetList: result[8].recordset !== undefined ? result[8].recordset:'',
                    studentBidsPoints: result[9].recordset[0] !== null && result[9].recordset[0] !== undefined ? result[9].recordset[0] : 0,
                    remaingBidPoints: result[10].recordset[0] !== null && result[10].recordset[0] !== undefined ?
                    result[10].recordset[0] : result[9].recordset[0] !== null && result[9].recordset[0] !== undefined ? result[9].recordset[0] : 0,
                    roundSettingTime : result[11].recordset[0] != undefined ? result[11].recordset[0] :0,
                    confirmationCourse: result[12].recordset[0] != undefined ? result[12].recordset: '',
                    currentRoundStatus: result[13].recordset.length == 0 ? JSON.parse(JSON.stringify({'round_status':'Round Not Found'})) : JSON.parse(JSON.stringify(result[13].recordset[0])),
                    isStudentPartOfRound: result[14] != undefined ? result[14].recordset.length >= 1 ? 1: 0:0

                });
            })
            .catch(error => {
                // Handle errors
                console.error(error);
            });
    },
    
    getCourseByAcadSession: (req, res) => {
        Promise.all([
            divisionBatch.getBiddingCourseByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId),
            divisionBatch.listByProgramId(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                biddingCourseList: result[0].recordset,
                courseName: result[1].recordset
            });
        });
    },
    

    getCourseByCourseId: (req, res) => {
        Promise.all([divisionBatch.getBiddingCourseByCourseId(res.locals.slug, res.locals.biddingId, 
                     req.body.acadSessionId, req.body.courseId)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                biddingCourseList: result[0].recordset
            });
        });
    },

    getCourseByArea: (req, res) => {
        Promise.all([
            divisionBatch.getBiddingCourseByAreaName(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName),
            divisionBatch.getCourseNameAreaWiseFilter(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                biddingCourseList: result[0].recordset,
                courseName: result[1].recordset
            });
        });
    },

    addConcentrationSet: (req, res) => {
        biddingClass.addConcentrationSet(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body.studentLid, req.body.round_lid, req.body.courseLid, req.body.divisionBatchLid, req.body.concentration_lid).then(result => {
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
    },

    withdrawBidding: (req, res) => {
        biddingClass.withdrawBidding(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body.studentLid, req.body.round_lid, req.body.id, req.body.divisionBatchLid).then(result => {
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
    },

    roundWiseDetails: (req, res) => {
        Promise.all([
            roundSetting.startAndEndTime(res.locals.slug, res.locals.biddingId, req.body.roundId)
        ])
        .then(result => {
            
            const startAndEndTime = result[0].recordset[0] || ''; 
            res.send({ startAndEndTime });
        })
        .catch(error => {
            console.error("Error in roundWiseDetails:", error);
            res.status(500).send("Internal Server Error");
        });
    },

    coursesByAcad : (req, res) => {
        Promise.all([
            biddingClass.getCourseListByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.roundId, req.body.studentId),
            demandEstimation.getAreaList(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.roundId, req.body.studentId)
            
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                courseList: result[0].recordset,
                areaList: result[1].recordset
            });
        }).catch(error => {
            res.status(500).json(error.originalError.info.message);
        });
    },

    coursesByArea : (req, res) => {
        Promise.all([
            biddingClass.coursesByArea(res.locals.slug, res.locals.biddingId, req.body.acadSessionId,req.body.roundId ,req.body.studentId ,req.body.areaName),
            demandEstimation.coursesByArea(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                courseList: result[0].recordset,
                courseListDrop: result[1].recordset,
            });
        }).catch(error => {
            res.status(500).json(error.originalError.info.message);
        });
    },
    
}