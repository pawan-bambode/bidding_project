const router = require('express').Router();
const student = require('../../controllers/student/showtimetable/index');

router.get('/dashboard', student.getPage);
router.post('/specializations/save', student.save);

router.get('/timetable',student.showtimetable);

module.exports = router;