const router = require('express').Router();
const completeCourses = require('../../../controllers/admin/completeCourses/completeCourse');
const upload = require('../../../middlewares/multerUpload')

router.get('/complete-courses',completeCourses.getCompleteCourses);
router.get('/generate-excel-complete-courses',completeCourses.generateExcel);
router.post('/upload-complete-course',upload.single('import-complete-course'),completeCourses.readExcelFile);
router.post('/complete-course/delete-all',completeCourses.deleteAll)

module.exports = router;