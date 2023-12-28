const router = require('express').Router();
const demandEstimation = require('../../../controllers/student/')

router.get('/',demandEstimation.getHomePage);


module.exports = router;