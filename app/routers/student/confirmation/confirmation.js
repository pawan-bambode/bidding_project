const router = require('express').Router();
const confirmation = require('../../../controllers/student/confirmation/confirmation');

router.get('/confirmation', confirmation.getPage);
router.get('/confirmation/rounds-first', confirmation.getPageRoundWise);
router.get('/confirmation/rounds-second', confirmation.getPageRoundWise)
router.post('/confirmation/add-confirmation', confirmation.addConfirmCourse)

module.exports = router;