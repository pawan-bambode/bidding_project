const student = require('../../../models/Students');
const programSession = require('../../../models/admin/programs/programsession')
const course = require('../../../models/admin/course/course');

module.exports = {

  getDashBoard : (req ,res) =>{
    
    let studentHomePageUrl = req.route.path.split('/');
    let studentHomePage = studentHomePageUrl[studentHomePageUrl.length - 1]

    Promise.all([programSession.getProgramSessionCreditsPoint(res.locals.slug,res.locals.biddingId),
      student.getStudentDetail(res.locals.slug,res.locals.biddingId,res.locals.username),
      student.getConcentrationList(res.locals.slug,res.locals.biddingId),
      student.getConfirmaCourseList(res.locals.slug,res.locals.biddingId,res.locals),
      student.getDropCourseList(res.locals.slug,res.locals.biddingId,res.locals),
      student.getWinningCourseList(res.locals.slug,res.locals.biddingId),
      student.getWaitListCouresList(res.locals.slug,res.locals.biddingId),
      student.getConfirmCreditsCounts(res.locals.slug,res.locals.biddingId),
      student.getCompleteCourese(res.locals.slug,res.locals.biddingId,res.locals.useSapId),]).then(result =>{

      res.render('student/dashboard/index', {
        active:studentHomePage,
        currentFormStep: 0,
        maxYearlyCredits:result[0].recordset[0].annually_credits_count,
        studentDetails:result[1].recordset,
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
    Promise.all([student.getSlotForShowTimetable(), student.getCountOfCourses(res.locals.slug,res.locals.biddingId),student.fetchAllCourseSelByStudent('15048'),course.getDropdownAcadSessionList(res.locals.slug,res.locals.biddingId)]).then(result => {
      res.render('admin/students/showTimetableStudent.ejs', {
        minMaxSlotId: JSON.stringify(result[0].recordset),
        courseCounts: result[1].recordset[0].count,
        courseSelectedByStud :JSON.stringify(result[2].recordset),
        dropdownAcadSessionList:result[3].recordset,
        active:'dashboard',
        breadcrumbs: req.breadcrumbs   
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
  },

    saveSpecialization : (req, res) =>{
      student.saveSpecialization(res.locals.slug, req.body.inputJSON, res.locals.biddingId, res.locals.userId).then(result =>{
        res.status(200).json(JSON.parse(result.output.output_json))
      }).catch(error =>{
        console.log('values of error',error.message);
        res.status(500).json(JSON.parse(error.originalError.info.message));
      })
    } 
}





