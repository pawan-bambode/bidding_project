const router = require('express').Router();
const concentrationSettings = require('../../../controllers/admin/concentrationsettings/concentration');

router.get('/concentration-settings',concentrationSettings.getPage);
router.post('/concentration-settings/refresh',concentrationSettings.refresh);
router.post('/concentration-settings/delete',concentrationSettings.delete);
router.post('/concentration-settings/update',concentrationSettings.update);

module.exports = router;