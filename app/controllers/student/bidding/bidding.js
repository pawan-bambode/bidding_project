const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const programSession = require('../../../models/admin/programs/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const concentrationSetting = require('../../../models/admin/concentrationsettings/concentrationsettings');
const biddingClass = require('../../../models/student/bidding/bidding');
const isJsonString = require('../../../utils/util');

module.exports = {

    getPage : (req , res) => {
        let biddingUrl = req.route.path.split('/');
        let bidding = biddingUrl[biddingUrl.length - 1]
        let slug = res.locals.slug;

        Promise.all([course.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId),
                     programSession.getCredits(res.locals.slug, res.locals.biddingId),
                     roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId,2),
                     divisionBatch.getBiddingCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId),
                     divisionBatch.getCourseNameForFilter(res.locals.slug, res.locals.biddingId),
                     concentrationSetting.getStudentConcentrationSettings(res.locals.slug, res.locals.biddingId, res.locals.username),
                     divisionBatch.getAreaList(res.locals.slug, res.locals.biddingId),
                     roundSetting.getBiddingRoundLid(res.locals.slug, res.locals.biddingId),
                     biddingClass.getConsiderationSet(res.locals.slug, res.locals.biddingId, res.locals.studentId),
                     biddingClass.getStudentBidPoints(res.locals.slug, res.locals.biddingId, res.locals.studentId),
                     biddingClass.getUpdateBidPoints(res.locals.slug, res.locals.biddingId, res.locals.studentId)
                    ]).then(result => {
                   
                res.render('student/bidding/index',{
                    active :bidding,
                    dropdownAcadSessionList: result[0].recordset,
                    creditList: result[1].recordset,
                    startAndEndTime: result[2].recordset[0] != '' ? result[2].recordset[0]: 0,
                    biddingCourseList: result[3].recordset,
                    courseList: result[4].recordset,
                    concentrationSetting: result[5].recordset[0],
                    areaList: result[6].recordset,
                    roundId: result[7].recordset != '' ? result[7].recordset[0].round_lid : 0,
                    considerationSetList: result[8].recordset,
                    studentBidsPoints: result[9].recordset[0] != null && result[9].recordset[0] !== undefined? result[9].recordset[0] : 0,
                    remaingBidPoints: result[10].recordset[0] !== null && result[10].recordset[0] !== undefined
                    ? result[10].recordset[0] : result[9].recordset[0] != null && result[9].recordset[0] !== undefined? result[9].recordset[0] : 0,

                    slug: slug
            });
        })
   
    },  

    getCourseByAcadSession : (req, res) =>{
      Promise.all([divisionBatch.getBiddingCourseByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId), divisionBatch.getCourseNameForFilter(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)]).then(result =>{
        res.json({
            status:'200',
            message:'Result fetched',
            biddingCourseList:result[0].recordset,
            courseName: result[1].recordset
        })
        })
    },

    getCourseByCourseId : (req, res) =>{
        Promise.all([divisionBatch.getBiddingCourseByCourseId(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.courseId)]).then(result =>{
            res.json({
                status:'200',
                message:'Result fetched',
                biddingCourseList:result[0].recordset
            })
            })
    },

    getCourseByArea : (req, res) =>{
        Promise.all([divisionBatch.getBiddingCourseByAreaName(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName), divisionBatch.getCourseNameAreaWiseFilter(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName)]).then(result =>{
            
            res.json({
                status:'200',
                message:'Result fetched',
                biddingCourseList:result[0].recordset,
                courseName: result[1].recordset
            })
            })
    },

    addConcentrationSet : (req, res) =>{
        biddingClass.addConcentrationSet(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body.studentLid, req.body.round_lid, req.body.courseLid, req.body.divisionBatchLid, req.body.concentration_lid).then(result =>{
                res.status(200).json(JSON.parse(result.output.output_json)); 
        }).catch(error =>{
            if(isJsonString.isJsonString(error.originalError.info.message)){
                res.status(500).json(JSON.parse(error.originalError.info.message));
            }
            else{
                res.status(500).json({
                    status:500,
                    description:error.originalError.info.message,
                    data:[]
                });
            }
        })
    },

    withdrawBidding : (req, res) =>{
        biddingClass.withdrawBidding(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body.studentLid, req.body.round_lid, req.body.id, req.body.divisionBatchLid).then(result =>{
                res.status(200).json(JSON.parse(result.output.output_json)); 
        }).catch(error =>{
            if(isJsonString.isJsonString(error.originalError.info.message)){
                res.status(500).json(JSON.parse(error.originalError.info.message));
            }
            else{
                res.status(500).json({
                    status:500,
                    description:error.originalError.info.message,
                    data:[]
                });
            }
        })
    }
    
    
}