const router = require('express').Router();
const roundSettings = require('../../../controllers/admin/roundSettings/roundSettings');

router.get('/dashboard/round-setting', roundSettings.getPage);
router.get('/bidding-settings/round-setting', roundSettings.getPage);

router.post('/round-setting/create', roundSettings.create);
router.post('/round-setting/delete', roundSettings.delete);
router.post('/round-setting/update', roundSettings.update);
router.post('/round-setting/search', roundSettings.search);
router.post('/round-settings/mappings', roundSettings.roundWiseMapping);

module.exports = router;
