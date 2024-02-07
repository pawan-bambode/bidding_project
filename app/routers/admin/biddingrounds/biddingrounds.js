const router = require('express').Router()
const biddingRounds = require('../../../controllers/admin/biddingrounds/biddinground');

router.get('/bidding-rounds',biddingRounds.getPage);
router.post('/bidding-rounds/create',biddingRounds.create);
router.post('/bidding-rounds/delete',biddingRounds.delete);
router.post('/bidding-rounds/update',biddingRounds.update);
router.post('/bidding-rounds/search',biddingRounds.search);
router.post('/biddingRounds/round-wise-mapping', biddingRounds.roundWiseMapping)

module.exports = router;