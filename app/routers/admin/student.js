const router = require('express').Router();

const studentController = require('../../controllers/admin/student/student');
const upload = require('../../middlewares/multerUpload')
const studentDataUpload = require('../../controllers/admin/student/generatedExcelForStudentDataUpload')


router.get('/student', studentController.getStudentPage);
router.get('/generate-excel-student',studentDataUpload.generateExcelStudent);
router.post('/upload-student-data',upload.single('import-student-data'),studentDataUpload.readExcelFile)
router.post('/student-data-raw/refresh',studentDataUpload.refresh);
router.post('/student-data/update',studentDataUpload.update);
router.post('/student-data/delete',studentDataUpload.delete);

router.post('/get_excel_upload_data', upload.single('excel-file'), studentController.readExcelFile)
router.get('/get_student_data', studentController.getStudentDetails);
router.post('/student_details_by_id', studentController.getStudentDetailsById)
router.post('/update_student_details_by_id', studentController.updateStudentDetailsById)
router.post('/student_info_by_firstname', studentController.getStudentInfoByFirstname)
router.post('/generate-student-credentials', studentController.generateStudentCredentials)


router.post('/check-old-password', studentController.checkOldPassword)
router.post('/update-student-password', studentController.updatePassword)


module.exports = router;