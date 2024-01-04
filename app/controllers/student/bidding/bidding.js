const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const programSession = require('../../../models/admin/programs/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const concentrationSetting = require('../../../models/admin/concentrationsettings/concentrationsettings');

module.exports = {

    getPage : (req , res) => {
        let biddingUrl = req.route.path.split('/');
        let bidding = biddingUrl[biddingUrl.length - 1]

        Promise.all([course.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId),
                     programSession.getCredits(res.locals.slug, res.locals.biddingId),
                     roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId,2),
                     divisionBatch.getBiddingCourse(res.locals.slug, res.locals.biddingId),
                     divisionBatch.getCourseNameForFilter(res.locals.slug, res.locals.biddingId),
                     concentrationSetting.getStudentConcentrationSettings(res.locals.slug, res.locals.biddingId, res.locals.username),
                     divisionBatch.getAreaList(res.locals.slug, res.locals.biddingId)
                     ]).then(result => {
                res.render('student/bidding/index',{
                    active :bidding,
                    dropdownAcadSessionList: result[0].recordset,
                    creditList: result[1].recordset,
                    startAndEndTime: result[2].recordset[0],
                    biddingCourseList: result[3].recordset,
                    courseList: result[4].recordset,
                    concentrationSetting: result[5].recordset[0],
                    areaList: result[6].recordset
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
    }
    
}