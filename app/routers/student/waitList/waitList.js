const router = require('express').Router();
const waitList = require('../../../controllers/student/waitList/waitList');

router.get('/wait-list', waitList.getPage);

module.exports = router;