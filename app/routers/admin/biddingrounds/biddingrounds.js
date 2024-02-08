const router = require('express').Router();
const biddingRound = require('../../../controllers/admin/biddingrounds/biddinground');

router.get('/bidding-rounds', biddingRound.getPage);
router.post('/bidding-rounds/create', biddingRound.create);
router.post('/bidding-rounds/delete', biddingRound.delete);
router.post('/bidding-rounds/update', biddingRound.update);
router.post('/bidding-rounds/search', biddingRound.search);
router.post('/biddingRounds/round-wise-mapping', biddingRound.roundWiseMapping);

module.exports = router;
