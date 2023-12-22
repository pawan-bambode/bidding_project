const router = require('express').Router();
const course = require('../../controllers/admin/course/course')

router.get('/course',course.getCourse);
router.post('/delete-course',course.delete);
router.post('/course/update',course.update);
router.post('/course/search',course.search);
router.post('/course/search-by-letter',course.searchByLetter);
router.post('/course/showEntryCouresList',course.showEntryCouresList);
router.post('/course/delete-all',course.deleteAll);
router.post('/course/filter-by/programId',course.filterByProgramId)
router.post('/course/filter-by/session-id',course.filterBySessionId)
router.post('/course/filter-by/course-id',course.filterByCourseId)
module.exports = router;