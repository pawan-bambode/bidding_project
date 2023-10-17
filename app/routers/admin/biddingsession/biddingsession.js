const router = require('express').Router();
const biddingSession = require('../../../controllers/admin/biddingsessions/biddingsession');

router.get('/bidding_session',biddingSession.getBiddingSessionPage);
router.post('/bidding-session/create',biddingSession.create);
router.post('/bidding-session/delete',biddingSession.delete);
router.post('/bidding-session/update',biddingSession.update);
router.post('/bidding-session/get-bidding-session-list',biddingSession.getBiddingSessionList);
router.post('/bidding-session/update-bidding-session-status',biddingSession.updateBiddingSession);
module.exports = router;