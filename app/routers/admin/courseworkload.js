const router = require('express').Router();
const courseWorkload = require('../../controllers/admin/courseworkload/courseworkload')

router.get('/courseworkload', courseWorkload.getCourseworkload);
module.exports = router;