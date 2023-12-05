const router = require('express').Router();
const student = require('../../controllers/student/showtimetable/index');

router.get('/dashboard',student.getDashBoard)
router.get('/demand-estimation',student.getDemandEstimationHomePage)
router.get('/bidding',student.getBidding)
router.get('/confirmation',student.getConfirmation);
router.get('/demand-estimation-course',student.getDemandEstimation)
router.get('/multiple-hit',student.multipleHit)

router.get('/timetable',student.showtimetable);
router.post('/timetable/by-acad-session-id',student.getByAcadSession);

module.exports = router;