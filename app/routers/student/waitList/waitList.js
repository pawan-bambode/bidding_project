const router = require('express').Router();
const waitList = require('../../../controllers/student/waitList/waitList');

router.get('/wait-list', waitList.getPage);
router.post('/wait-list/add', waitList.addWaitList);
router.post('/wait-list/bid-points', waitList.addBidPoints);
router.post('/wait-list/withdraw', waitList.withdraw);


module.exports = router;