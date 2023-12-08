
const demandEstimation = require('../../../models/student/demandEstimation/demandEstimation')
const course = require('../../../models/admin/courseworkload/courseworkload')
const programSession = require('../../../models/admin/programs/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');

module.exports = {
    getHomePage : (req ,res) => {
      let demandEstimationUrl = req.route.path.split('/');
      let demandEstimationActive = demandEstimationUrl[demandEstimationUrl.length - 1]
      Promise.all([demandEstimation.getDemandEstimationRoundList(res.locals.slug,res.locals.biddingId),course.getAvailableCourseList(res.locals.slug,res.locals.biddingId),course.getAvailableCourseCount(res.locals.slug,res.locals.biddingId),course.getDropdownAcadSessionList(res.locals.slug,res.locals.biddingId),programSession.getCredits(res.locals.slug,res.locals.biddingId),programSession.getProgramSessionCreditsPoint(res.locals.slug,res.locals.biddingId),roundSetting.getRoundLid(res.locals.slug,res.locals.biddingId),roundSetting.getStartEndTime(res.locals.slug,res.locals.biddingId),demandEstimation.getSelectedCourses(res.locals.slug,res.locals.biddingId,res.locals.studentId)]).then(result =>{
    
        res.render('student/demandEstimation/index',{
          active:demandEstimationActive,
          demandEstimationRounds:result[0].recordset,
          courseList: result[1].recordset,
          pageCount : result[2].recordset[0].count,
          dropdownAcadSessionList:result[3].recordset,
          creditList:result[4].recordset,
          yearlyCredit:result[5].recordset[0],
          roundLid:result[6].recordset[0].round_lid,
          startTime:result[7].recordset[0].startTime,
          endTime:result[7].recordset[0].endTime,
          selectCourse:result[8].recordset 
        });
      })
   },

  getCoursesByAcadSession : (req, res) => {
        Promise.all([demandEstimation.getCourseListByAcadSession(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.acadSessionId),demandEstimation.getCourseCountByAcadSession(res.locals.slug,res.locals.biddingId,req.body.acadSessionId),demandEstimation.getAreaList(res.locals.slug,res.locals.biddingId ,req.body.acadSessionId)]).then(result => {
            res.json({
              status: "200",
              message: "Sucessfull",
              courseList: result[0].recordset,
              courseCount:result[1].recordset[0].count,
              areaList:result[2].recordset
            })
        }).catch(error => {
          console.log(error)
          res.status(500).json(error.originalError.info.message)
        })
     },

  getCoursesByAreaName :(req , res) => {
    Promise.all([demandEstimation.getCourseListByAreaName(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.acadSessionId,req.body.areaName),demandEstimation.getCountOfCourseListByAreaName(res.locals.slug,res.locals.biddingId,req.body.acadSessionId,req.body.areaName)]).then(result => {
      res.json({
        status: "200",
        message: "Sucessfull",
        courseList: result[0].recordset,
        courseCount:result[1].recordset[0].count,
      })
    }).catch(error => {
      console.log(error)
      res.status(500).json(error.originalError.info.message)
    })
  },

  searchByLetter :(req,res) =>{
   Promise.all([demandEstimation.searchByLetter(res.locals.slug,res.locals.biddingId,req.body.searchLetter,req.body.pageNo,req.body.showEntry,req.body.acadSessionId,req.body.area)]).then(result =>{
        res.json({
            status:'200',
            message:'Result fetched',
            courseList:result[0].recordset,
           
        })
    }).catch(error =>{
        throw error
    })
 },

 
 showEntryCourseList :(req,res) =>{
  Promise.all([demandEstimation.showEntryCouresList(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo),demandEstimation.getCounts(res.locals.slug,res.locals.biddingId)]).then(result =>{
        res.json({
            status:'200',
            message:'Result fetched',
            data:result[0].recordset,
            length:result[1].recordset[0]['']
        })
    }).catch(error =>{
        throw error
    })
 },

 selectedCourseSave : (req, res) =>{
    let object = {
        import_selected_course: JSON.parse(req.body.inputJSON)
    };
   console.log('values of req.body',JSON.stringify(object));
 }
}