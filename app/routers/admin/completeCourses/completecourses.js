const router = require('express').Router();
const completeCourses = require('../../../controllers/admin/completeCourses/completeCourse');
const upload = require('../../../middlewares/multerUpload')

router.get('/complete-courses',completeCourses.getCompleteCourses);
router.get('/generate-excel-complete-courses',completeCourses.generateExcel);
router.post('/upload-complete-course',upload.single('import-complete-course'),completeCourses.readExcelFile);
router.post('/complete-course/delete-all',completeCourses.deleteAll);
router.post('/completed-courses/showEntry',completeCourses.showEntry);
router.post('/completed-courses/search',completeCourses.search);
router.get('/completed-courses/download',completeCourses.download);

module.exports = router;