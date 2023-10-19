const router = require('express').Router();
const courseWorkload = require('../../controllers/admin/courseworkload/courseworkload')

router.get('/courseworkload', courseWorkload.getCourseworkload);
router.post('/delete-course',courseWorkload.delete);
router.post('/course/update',courseWorkload.update)
module.exports = router;