const router = require('express').Router();
const specialization = require('../../../controllers/admin/specialization/specialization');

router.get('/specialization', specialization.getPage);
router.post('/specialization/add', specialization.add);
router.post('/specialization/delete', specialization.delete);
router.post('/specialization/update', specialization.update);
router.post('/specialization/search', specialization.search);
router.post('/specialization/showEntry', specialization.showEntry);

module.exports = router;
