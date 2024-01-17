const router = require('express').Router();
const confirmation = require('../../../controllers/student/confirmation/confirmation');

router.get('/confirmation', confirmation.getPage);
router.get('/confirmation/confirm-course', confirmation.save)

module.exports = router;