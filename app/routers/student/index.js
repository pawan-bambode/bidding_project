const router = require('express').Router()
const showtimetableStudent = require('../../controllers/student/showtimetable/index');
router.get('/showtimetable',showtimetableStudent.showtimetable);
router.post('/subjectAdded',showtimetableStudent.subjectAdded);
router.post('/updateSubject',showtimetableStudent.updateSubject);

module.exports = router;
