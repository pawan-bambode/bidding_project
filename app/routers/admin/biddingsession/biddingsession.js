const router = require('express').Router();
const biddingSession = require('../../../controllers/admin/biddingsessions/biddingsession');

router.post('/bidding-sessions/create', biddingSession.create);
router.post('/bidding-sessions/delete', biddingSession.delete);
router.post('/bidding-sessions/update', biddingSession.update);
router.post('/bidding-sessions/active', biddingSession.active);
router.post('/bidding-sessions/update-status', biddingSession.updateStatus);

router.get('/dashboard/bidding-sessions', biddingSession.getPage);
router.get('/master-data/bidding-sessions', biddingSession.getPage);

module.exports = router;
