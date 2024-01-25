const router = require('express').Router();
const confirmation = require('../../../controllers/student/confirmation/confirmation');

router.get('/confirmation', confirmation.getPage);
router.post('/confirmation/round-wise', confirmation.getDetailsRoundWise)
router.post('/confirmation/add-confirmation', confirmation.addConfirmCourse)

module.exports = router;