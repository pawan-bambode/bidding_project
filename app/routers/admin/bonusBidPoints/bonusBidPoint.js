const router = require('express').Router();
const bonusBidPoints = require('../../../controllers/admin/bonusBidPoints/bonusBidPoints');

router.get('/dashboard/bonus-bid-points', bonusBidPoints.getPage);
router.get('/master-data/bonus-bid-points', bonusBidPoints.getPage);

router.post('/bonus-bid-points/add', bonusBidPoints.add);
router.post('/bonus-bid-points/delete', bonusBidPoints.delete);
router.post('/bonus-bid-points/update', bonusBidPoints.update);

module.exports = router;

