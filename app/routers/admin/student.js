const router = require('express').Router();

const studentController = require('../../controllers/admin/student/student');
const upload = require('../../middlewares/multerUpload')

router.get('/student', studentController.getStudentPage);
router.post('/get_excel_upload_data', upload.single('excel-file'), studentController.readExcelFile)
router.get('/get_student_data', studentController.getStudentDetails);
router.post('/student_details_by_id', studentController.getStudentDetailsById)
router.post('/update_student_details_by_id', studentController.updateStudentDetailsById)
router.post('/student_info_by_firstname', studentController.getStudentInfoByFirstname)


module.exports = router;