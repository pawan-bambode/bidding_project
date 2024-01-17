const router = require('express').Router();
const bidding = require('../../../controllers/student/bidding/bidding')

router.get('/bidding', bidding.getPage);

module.exports = router;