const router = require('express').Router();
const upload = require('../../../middlewares/multerUpload')

const generateExcel = require('../../../controllers/admin/generateexcel/generateexcel');
router.get('/generate-excel',generateExcel.generateExcel);
router.post('/upload-course',upload.single('excel-file'),generateExcel.readExcelFile)

module.exports = router;

