const router = require('express').Router();
const dashboard = require('../../../controllers/admin/dashboard');

router.get('/dashboard', dashboard.getPage);
router.get('/master-data', dashboard.masterData)
router.get('/bidding-settings', dashboard.biddingSettings);
router.get('/reports', dashboard.reports);
router.get('/utility', dashboard.utility);

module.exports = router;
