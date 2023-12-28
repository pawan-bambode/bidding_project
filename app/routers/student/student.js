const router = require('express').Router();
const student = require('../../controllers/student/showtimetable/index');

router.get('/dashboard', student.getDashBoard);
router.post('/specialization/save', student.saveSpecialization);
router.get('/available-course', student.availableCourse);
router.get('/bidding', student.getBidding);
router.get('/confirmation', student.getConfirmation);
router.get('/wait-list', student.getWaitList);
router.get('/add-drop', student.getAddDrop);


router.get('/multiple-hit',student.multipleHit)
router.get('/timetable',student.showtimetable);

module.exports = router;