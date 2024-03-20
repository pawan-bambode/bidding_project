const router = require('express').Router();
const area = require('../../../controllers/admin/area/area');

router.get('/dashboard/areas', area.getPage);
router.get('/master-data/areas', area.getPage);
router.post('/areas/refresh', area.refresh);
router.post('/areas/showEntryAreaList', area.showEntry);
router.post('/areas/search', area.search);

module.exports = router;
