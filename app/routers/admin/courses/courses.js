const router = require('express').Router();
const course = require('../../../controllers/admin/course/course');
const upload = require('../../../middlewares/multerUpload');
const courseExcel = require('../../../controllers/admin/excel/course/course');

router.get('/dashboard/courses', course.getPage);
router.get('/master-data/courses', course.getPage);

router.post('/courses/delete', course.delete);
router.post('/courses/update', course.update);
router.post('/courses/search', course.search);
router.post('/courses/search-by-letter', course.searchByLetter);
router.post('/courses/showEntry', course.showEntry);
router.post('/courses/delete-all', course.deleteAll);
router.post('/courses/program-id', course.listByProgramId);
router.post('/courses/session-id', course.listBySessionId);
router.post('/courses/course-id', course.listByCourseId);

router.get('/courses/generate-excel', courseExcel.generateExcel);
router.post('/courses/upload', upload.single('import-course'), courseExcel.upload);

module.exports = router;
