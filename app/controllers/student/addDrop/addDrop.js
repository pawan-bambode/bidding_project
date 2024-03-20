const confirmation = require('../../../models/student/confirmation/confirmation');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');
const addDrop = require('../../../models/student/addDrop/addDrop');
const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const waitList = require('../../../models/student/waitList/waitlist');
const e = require('express');

module.exports = {
      getPage: (req, res) => {
          let addDropUrl = req.route.path.split('/');
          let addDropActive = addDropUrl[addDropUrl.length - 1];
          let round1Id = 7 , round2Id = 8;
          Promise.all([
              confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              roundSetting.startAndEndTime(res.locals.slug, res.locals.biddingId),
              addDrop.getWaitListCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              course.acadSessionList(res.locals.slug, res.locals.biddingId),
              divisionBatch.areaList(res.locals.slug, res.locals.biddingId),
              divisionBatch.addDropCourse(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              waitList.getStudentDetails(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              roundSetting.listByOneDayBefore(res.locals.slug, res.locals.biddingId, round1Id, round2Id),
              roundSetting.roundSettingTime(res.locals.slug, res.locals.biddingId, round1Id, round2Id),
              confirmation.getConfirmationForBidding(res.locals.slug, res.locals.biddingId, res.locals.studentId),
              addDrop.waitListRanked(res.locals.slug, res.locals.biddingId, res.locals.studentId)
          ]).then(result => {
              res.render('student/adddrop/index', {
                  active: addDropActive,
                  confirmCourseList: result[0].recordset,
                  startAndEndTime: result[1].recordset[0] != undefined? result[1].recordset[0] : '',
                  waitListCourses: result[2].recordset,
                  dropdownAcadSessionList: result[3].recordset,
                  areaList: result[4].recordset,
                  courseList: result[5].recordset != undefined ? result[5].recordset:'',
                  concentrationId: result[6].recordset[0].concentrationId,
                  roundDetails: result[7].recordset[0] !== undefined ? result[7].recordset[0]: '',
                  roundSettingTime : result[8].recordset[0] != undefined ? result[8].recordset[0] :0,
                  confirmation: result[9].recordset != undefined ? result[9].recordset: 0,
                  waitListRanked: result[10].recordset != undefined ? result[10].recordset: 0
              });
          }).catch(error => {
              res.status(500).json(JSON.parse(error.originalError.info.message));
          });
     },

    getRoundWiseDetails: (req, res) => {
        Promise.all([
            confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            confirmation.winningCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            roundSetting.startAndEndTime(res.locals.slug, res.locals.biddingId, req.body.roundId)
        ]).then(result => {
            res.json({
                status: "200",
                active: 'add-drop',
                confirmCourseList: result[0].recordset,
                waitListCouresList: result[1].recordset,
                startAndEndTime: result[2].recordset[0] != undefined? result[1].recordset[0] : '',
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
        let bidPoints = req.body.bidPoints;
        addDrop.addDrop(res.locals.slug, studentId, roundId, courseId, concentrationId, divisionId,bidPoints, res.locals.userId, res.locals.biddingId).then(result => {
            res.json({
                status: 200,
                addWaitListResponse: result.output.output_json
            });
        }).catch(error => {
            res.json({
                error: error.originalError.info.message,
            });
        });
    },

    drop: (req, res) =>{
      
        let id = req.body.id;
        let studentId = req.body.studentId;
        let divisionId = req.body.divisionBatchId;
        let roundId = req.body.roundId;
        addDrop.drop(res.locals.slug, res.locals.biddingId, id, studentId, divisionId, roundId, res.locals.userId).then(result => {
            res.json({
                status: 200,
                addWaitListResponse: result.output.output_json
            });
        }).catch(error => {
            res.json({
                error: error.originalError.info.message,
            });
        });
    },

    swap : (req, res) => {
        
        let id = req.body.id;
        let studentId = req.body.studentId;
        let courseId = req.body.courseLidToAdd;
        let concentrationId = req.body.concentrationId;
        let divBatchLidToDrop = req.body.divBatchLidToDrop;
        let divBatchLidToAdd = req.body.divBatchLidToAdd;
        let bidPoints = req.body.bidPoint;
        let roundId = req.body.roundId;
    
        addDrop.swap(res.locals.slug, id, studentId, courseId, concentrationId, divBatchLidToDrop, divBatchLidToAdd, bidPoints, roundId, res.locals.userId, res.locals.biddingId).then(result => {
                res.json({
                    swap: result.output.output_json
                });
            }).catch(error => {
                res.json({
                    swap: error.originalError.info.message
                });
            });
        }
};
