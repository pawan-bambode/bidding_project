const router = require('express').Router();
const bonusBidPoints = require('../../../controllers/admin/bonusBidPoints/bonusBidPoints');

router.get('/bonus-bid-points', bonusBidPoints.getPage);
router.post('/bonus-points/add', bonusBidPoints.add);
router.post('/bonus-points/delete', bonusBidPoints.delete);
router.post('/bonus-points/update', bonusBidPoints.update);

module.exports = router;