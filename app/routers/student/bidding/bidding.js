const router = require('express').Router();
const bidding = require('../../../controllers/student/bidding/bidding')

router.get('/bidding', bidding.getPage);
router.post('/bidding/courses-by-area', bidding.coursesByArea);
router.post('/bidding/courses-by-acad', bidding.coursesByAcad)

module.exports = router;