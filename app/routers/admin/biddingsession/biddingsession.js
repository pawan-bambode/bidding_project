const router = require('express').Router();
const biddingSession = require('../../../controllers/admin/biddingsessions/biddingsession');

router.get('/bidding-session', biddingSession.getPage);
router.post('/bidding-session/create', biddingSession.create);
router.post('/bidding-session/delete', biddingSession.delete);
router.post('/bidding-session/update', biddingSession.update);
router.post('/bidding-session/active-list', biddingSession.activeList);
router.post('/bidding-session/update-status', biddingSession.updateStatus);

module.exports = router;
