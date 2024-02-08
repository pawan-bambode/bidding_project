const router = require('express').Router();
const completedCourses = require('../../../controllers/admin/completedCourses/completedCourse');
const upload = require('../../../middlewares/multerUpload');
const compltedCoursesExcel = require('../../../controllers/admin/excel/completedCourses/completedCourse');

router.get('/completed-courses', completedCourses.getList);
router.post('/completed-courses/delete-all', completedCourses.deleteAll);
router.post('/completed-courses/showEntry', completedCourses.showEntry);
router.post('/completed-courses/search', completedCourses.search);
router.get('/completed-courses/download', completedCourses.download);

router.get('/completed-courses/gerenate-excel', compltedCoursesExcel.generateExcel);
router.post('/completed-courses/upload', upload.single('import-complete-course'), compltedCoursesExcel.upload);

module.exports = router;
