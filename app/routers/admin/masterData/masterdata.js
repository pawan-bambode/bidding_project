const router = require('express').Router();
const masterData = require('../../../controllers/admin/masterData/masterdata');

router.get('/master-data', masterData.getPage);

module.exports = router;