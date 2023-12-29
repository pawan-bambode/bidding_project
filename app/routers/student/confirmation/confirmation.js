const router = require('express').Router();
const confirmation = require('../../../controllers/student/confirmation/confirmation');

router.get('/confirmation', confirmation.getPage);

module.exports = router;