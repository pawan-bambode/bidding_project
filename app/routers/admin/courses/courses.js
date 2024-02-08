const router = require('express').Router();
const course = require('../../../controllers/admin/course/course');
const upload = require('../../../middlewares/multerUpload');
const courseExcel = require('../../../controllers/admin/excel/course/course');

router.get('/course', course.getList);
router.post('/course/delete', course.delete);
router.post('/course/update', course.update);
router.post('/course/search', course.search);
router.post('/course/search-by-letter', course.searchByLetter);
router.post('/course/showEntry', course.showEntry);
router.post('/course/delete-all', course.deleteAll);
router.post('/course/program-id', course.listByProgramId);
router.post('/course/session-id', course.listBySessionId);
router.post('/course/course-id', course.listByCourseId);

router.get('/course/generate-excel', courseExcel.generateExcel);
router.post('/course/upload', upload.single('import-course'), courseExcel.upload);

module.exports = router;
