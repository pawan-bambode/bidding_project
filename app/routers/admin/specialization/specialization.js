const router = require('express').Router();
const specialization = require('../../../controllers/admin/specialization/specialization');

router.get('/specialization',specialization.getPage);
router.post('/specialization/add',specialization.add);
router.post('/specialization/delete',specialization.delete);
router.post('/specialization/update',specialization.update);
router.post('/specialization/search',specialization.specializationSearch);
router.post('/specialization/showEntrySpecializationList',specialization.showEntrySpecializationList)
module.exports = router;