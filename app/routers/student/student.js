const router = require('express').Router();
const student = require('../../controllers/student/showtimetable/index');

router.get('/dashboard',student.getDashBoard)
router.post('/specialization/save',student.saveSpecialization)
router.get('/bidding',student.getBidding)
router.get('/confirmation',student.getConfirmation);


router.get('/multiple-hit',student.multipleHit)
router.get('/timetable',student.showtimetable);

module.exports = router;