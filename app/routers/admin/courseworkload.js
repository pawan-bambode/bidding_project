const router = require('express').Router();
const courseWorkload = require('../../controllers/admin/courseworkload/courseworkload')

router.get('/courseworkload',courseWorkload.getCourseworkload);
router.post('/delete-course',courseWorkload.delete);
router.post('/course/update',courseWorkload.update);
router.post('/course/search',courseWorkload.search);
router.post('/course/search-by-letter',courseWorkload.searchByLetter);
router.post('/course/showEntryCouresList',courseWorkload.showEntryCouresList);
router.post('/course/delete-all',courseWorkload.deleteAll);
router.post('/course/filter-by/programId',courseWorkload.filterByProgramId)
router.post('/course/filter-by/session-id',courseWorkload.filterBySessionId)
router.post('/course/filter-by/course-id',courseWorkload.filterByCourseId)
module.exports = router;