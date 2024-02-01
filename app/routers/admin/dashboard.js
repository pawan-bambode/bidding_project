const router = require('express').Router();
const dashboard = require('../../controllers/admin/dashboard');

router.get('/dashboard', dashboard.getDashboard); 
router.get('/master-data',dashboard.masterData);
router.get('/secondary-data',dashboard.secondaryData);
router.get('/bidding-settings',dashboard.biddingSettings);
router.get('/round-settings',dashboard.roundSettings);
router.get('/reports',dashboard.reports);
router.get('/utility',dashboard.utility);

module.exports = router;