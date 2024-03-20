const router = require('express').Router();
const specialization = require('../../../controllers/admin/specialization/specialization');

router.get('/dashboard/specializations', specialization.getPage);
router.get('/master-data/specializations', specialization.getPage);

router.post('/specializations/add', specialization.add);
router.post('/specializations/delete', specialization.delete);
router.post('/specializations/update', specialization.update);
router.post('/specializations/search', specialization.search);
router.post('/specializations/showEntry', specialization.showEntry);

module.exports = router;
