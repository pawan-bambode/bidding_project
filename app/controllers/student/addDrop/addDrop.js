const confirmation = require('../../../models/student/confirmation/confirmation');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const addDrop = require('../../../models/student/addDrop/addDrop');
const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const waitList = require('../../../models/student/waitList/waitlist');

module.exports = {
      getPage: (req, res) => {
          let addDropUrl = req.route.path.split('/');
          let addDropActive = addDropUrl[addDropUrl.length - 1];
          
          Promise.all([
              confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId),
              addDrop.getWaitListCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              course.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId),
              divisionBatch.getAreaList(res.locals.slug, res.locals.biddingId),
              divisionBatch.getBiddingCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              waitList.getStudentDetails(res.locals.slug, res.locals.biddingId, res.locals.studentId)
          ]).then(result => {
              res.render('student/adddrop/index', {
                  active: addDropActive,
                  confirmCourseList: result[0].recordset,
                  startAndEndTime: result[1].recordset,
                  waitListCourses: result[2].recordset,
                  dropdownAcadSessionList: result[3].recordset,
                  areaList: result[4].recordset,
                  courseList: result[5].recordset,
                  concentrationId: result[6].recordset[0].concentrationId
              });
          }).catch(error => {
              res.status(500).json(JSON.parse(error.originalError.info.message));
          });
     },

    getRoundWiseDetails: (req, res) => {
        Promise.all([
            confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            confirmation.winningCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId, req.body.roundId)
        ]).then(result => {
            res.json({
                status: "200",
                active: 'add-drop',
                confirmCourseList: result[0].recordset,
                waitListCouresList: result[1].recordset,
                startAndEndTime: result[2].recordset[0]
            });
        }).catch(error => {
            res.status(500).json(JSON.parse(error.originalError.info.message));
        });
    },

    addDrop: (req, res) => {
        let studentId = req.body.studentId;
        let roundId = req.body.roundId;
        let courseId = req.body.courseId;
        let divisionId = req.body.divBatchId;
        let concentrationId = req.body.concentrationId;
      
        addDrop.addDrop(res.locals.slug, studentId, roundId, courseId, concentrationId, divisionId, res.locals.userId, res.locals.biddingId).then(result => {
            res.json({
                status: 200,
                addWaitListResponse: result.output.output_json
            });
        }).catch(error => {
            res.json({
                error: error.originalError.info.message,
            });
        });
    }
};
