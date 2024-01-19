const router = require('express').Router();
const bonusBidPoints = require('../../../controllers/admin/bonusBidPoints/bonusBidPoints');

router.get('/bonus-bid-points', bonusBidPoints.getPage);

module.exports = router;