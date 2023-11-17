const router = require('express').Router()
const biddingRounds = require('../../../controllers/admin/biddingrounds/biddinground');

router.get('/bidding-rounds',biddingRounds.getPage);
router.post('/bidding-rounds/create',biddingRounds.create);
router.post('/bidding-rounds/delete',biddingRounds.delete)

module.exports = router;