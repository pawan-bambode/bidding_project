const router = require('express').Router();
const area = require('../../../controllers/admin/area/area')

router.get('/areas',area.getPage)
router.post('/area/refresh',area.refreshArea);

module.exports = router;