const router = require('express').Router();
const upload = require('../../../middlewares/multerUpload');
const studentData = require('../../../controllers/admin/student/studentData');
const studentDataExcel = require('../../../controllers/admin/excel/studentData/studentdata');

router.get('/dashboard/student-data', studentData.getPage);
router.get('/master-data/student-data', studentData.getPage);

router.post('/student-data/check-old-password', studentData.checkOldPassword);
router.post('/student-data/update-password', studentData.updatePassword);
router.post('/student-data/update', studentData.update);
router.post('/student-data/delete', studentData.delete);
router.post('/student-data/delete-all', studentData.deleteAll);
router.post('/student-data/search', studentData.search);
router.post('/student-data/search-by-letter', studentData.searchByletter);
router.post('/student-data/showEntry', studentData.showEntry);
router.post('/student-data/program-id', studentData.listByProgramId);
router.post('/student-data/student-id', studentData.listByStudentId);

router.get('/generate-excel-student', studentDataExcel.generateExcel);
router.post('/upload-student-data', upload.single('import-student-data'), studentDataExcel.upload);

module.exports = router;
