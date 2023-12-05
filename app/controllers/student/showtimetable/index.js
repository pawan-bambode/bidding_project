const { Result } = require('express-validator');
const student = require('../../../models/Students');
const studentUtil = require('../../../utils/timetableforstudent');
const programSession = require('../../../models/admin/programs/programsession')
const biddingRound = require('../../../models/admin/biddinground/biddinground')
const timetable = require('../../../models/admin/timetable/timetable')

module.exports = {

  getDashBoard : (req ,res) =>{
    let studentHomePageUrl = req.route.path.split('/');
    let studentHomePage = studentHomePageUrl[studentHomePageUrl.length - 1]
    Promise.all([programSession.getProgramSessionCreditsPoint(res.locals.slug,res.locals.biddingId),student.getStudentDetail(res.locals.slug,res.locals.biddingId,res.locals.username),student.getConcentrationList(res.locals.slug,res.locals.biddingId),student.getConfirmaCourseList(res.locals.slug,res.locals.biddingId,res.locals),student.getDropCourseList(res.locals.slug,res.locals.biddingId,res.locals),student.getWinningCourseList(res.locals.slug,res.locals.biddingId),student.getWaitListCouresList(res.locals.slug,res.locals.biddingId),student.getConfirmCreditsCounts(res.locals.slug,res.locals.biddingId),student.getCompleteCourese(res.locals.slug,res.locals.biddingId,res.locals.useSapId)]).then(result =>{
      console.log('result',result[8]);
      res.render('student/dashboard/index', {
        active:studentHomePage,
        currentFormStep: 0,
        maxYearlyCredits:result[0].recordset[0].max_yearly_credits,
        bidPoints:result[1].recordset,
        concentrationList :result[2].recordset,
        confirmCourseList:result[3].recordset,
        dropCourseList:result[4].recordset,
        winningCourseList:result[5].recordset,
        waitListCourseList:result[6].recordset,
        confirmCreditsCount:result[7].recordset[0].total_confirm_credits,
        completeCoureseList:result[8].recordset
    })
    })
},
getDemandEstimationHomePage :(req ,res) =>{
  let demandEstimationUrl = req.route.path.split('/');
  let demandEstimation = demandEstimationUrl[demandEstimationUrl.length - 1]
  Promise.all([biddingRound.getBiddingDemandEstimationRounds(res.locals.slug,res.locals.biddingId)]).then(result =>{
    res.render('student/demandEstimation/index',{
      active:demandEstimation,
      demandEstimationRounds:result[0].recordset

     });
  })
},
getDemandEstimation :(req , res) =>{

},
 getBidding : (req , res) =>{
  let biddingUrl = req.route.path.split('/');
  let bidding = biddingUrl[biddingUrl.length - 1]
  res.render('student/bidding/index',{
    active :bidding
  });
},

getConfirmation :(req ,res) =>{
  let confirmationUrl = req.route.path.split('/');
  let confirmation = confirmationUrl[confirmationUrl.length-1]
  res.render('student/confirmation/index',{
    active : confirmation
  })
},

multipleHit: (req, res) => {
  Promise.all([student.multipleHit()]).then(result => {
    res.json({
      status: "200",
      message: "Sucessfull",
      timetablelist: 0,
    })
  }).catch(error => {
    console.log(error)
    res.status(500).json(error.originalError.info.message)
  })
},

    showtimetable: (req, res) => {
    Promise.all([student.getSlotForShowTimetable(), student.getCountOfCourses(res.locals.slug,res.locals.biddingId), student.getTimeslot(),student.fetchAllCourseSelByStudent('15048'),student.getSlotDayId('1'),student.getSlotDayId(2),student.getSlotDayId(3),student.getSlotDayId(4),student.getSlotDayId(5),student.getSlotDayId(6),timetable.getDropdownAcadSessionList(res.locals.slug,res.locals.biddingId)]).then(result => {
      res.render('admin/students/showTimetableStudent.ejs', {
        minMaxSlotId: JSON.stringify(result[0].recordset),
        courseCounts: result[1].recordset[0].count,
        timeSlotList: JSON.stringify(result[2].recordset),
        courseSelectedByStud :JSON.stringify(result[3].recordset),
        slot_lid_monday:JSON.stringify(result[4].recordset),
        slot_lid_tuesday:JSON.stringify(result[5].recordset),
        slot_lid_wednesday:JSON.stringify(result[6].recordset),
        slot_lid_thirdsday:JSON.stringify(result[7].recordset),
        slot_lid_friday:JSON.stringify(result[8].recordset),
        slot_lid_satuday:JSON.stringify(result[9].recordset),
        numberOfCourse:7,
        dropdownAcadSessionList:result[10].recordset  
      })
    })
  },
  getByAcadSession: (req, res) => {
    Promise.all([student.getTimetableByDayId(res.locals.slug,req.body.acadSessionId,res.locals.biddingId)]).then(result => {
      res.json({
        status: "200",
        message: "Sucessfull",
        courseList: result[0].recordset,
      })
    }).catch(error => {
      console.log(error)
      res.status(500).json(error.originalError.info.message)
    })
  },
  subjectAdded: (req,res) =>{
      student.subjectAdded(req.body.input_json).then(result =>{
      res.status(200).json(JSON.parse(result.output.output_json))
    }).catch(err => {
      res.status(500).json((err.message))
  });
  },
  updateSubject :(req,res) =>{
   student.updateSubject(req.body.input_json).then(result =>{
    res.status(200).json(JSON.parse(result.output.output_json))
  }).catch(err => {
    res.status(500).json((err.message))
   });
  }
}





