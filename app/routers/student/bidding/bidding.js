const router = require('express').Router();
const bidding = require('../../../controllers/student/bidding/bidding')

router.get('/bidding', bidding.getPage);
router.post('/bidding/course-by-acadsession', bidding.getCourseByAcadSession);
router.post('/bidding/course', bidding.getCourseByCourseId)
router.post('/bidding/course-by-area', bidding.getCourseByArea);

module.exports = router;