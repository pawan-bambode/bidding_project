const router = require('express').Router();
const bidding = require('../../../controllers/student/bidding/bidding')

router.get('/bidding', bidding.getPage);
router.post('/bidding/course-by-acadsession', bidding.getCourseByAcadSession);

module.exports = router;