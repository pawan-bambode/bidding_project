const router = require('express').Router();
const manual = require('../../../controllers/admin/manual/manual');

router.get('/dashboard/manual-enrollment', manual.getPage);
router.get('/manual', manual.getPage);
router.post('/manual/courses', manual.courses);
router.post('/manual/add', manual.add)

module.exports = router;