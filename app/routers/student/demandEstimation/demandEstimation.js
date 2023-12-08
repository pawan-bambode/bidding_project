const router = require('express').Router();
const demandEstimation = require('../../../controllers/student/demandEstimation/demandEstimation')

router.get('/demand-estimation',demandEstimation.getHomePage);
router.post('/demand-estimation/courses-by-acad-session-id',demandEstimation.getCoursesByAcadSession);
router.post('/demand-estimation/courses-by-area-name',demandEstimation.getCoursesByAreaName);
router.post('/demand-estimation/search-by-letter',demandEstimation.searchByLetter);
router.post('/demand-estimation/showEntryCouresList',demandEstimation.showEntryCourseList);
router.post('/demand-estimation/selected-course/save',demandEstimation.selectedCourseSave);

module.exports = router;