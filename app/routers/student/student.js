const router = require('express').Router();
const student = require('../../controllers/student/showtimetable/index');

router.get('/dashboard',student.getDashBoard)

router.get('/timetable',student.showtimetable);
router.post('/timetable/byDayLid',student.getByDay)

module.exports = router;