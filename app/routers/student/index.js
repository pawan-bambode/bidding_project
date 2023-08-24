const router = require('express').Router()
const showtimetableStudent = require('../../controllers/student/showtimetable/index');
router.get('/showtimetable',showtimetableStudent.showtimetable);

module.exports = router;
