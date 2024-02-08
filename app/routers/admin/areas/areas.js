const router = require('express').Router();
const area = require('../../../controllers/admin/area/area');

router.get('/areas', area.getPage);
router.post('/area/refresh', area.refresh);
router.post('/area/showEntryAreaList', area.showEntry);
router.post('/area/search', area.search);

module.exports = router;
