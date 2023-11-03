const router = require('express').Router();
const preRequisites = require('../../../controllers/admin/preRequisites/preRequisites');
const upload = require('../../../middlewares/multerUpload')

router.get('/pre-requites',preRequisites.getPreRequities);
router.get('/generate-excel-pre-requities',preRequisites.generateExcel);
router.post('/pre-requities/upload',upload.single('import-pre-requisites'),preRequisites.readExcelFile)
router.post('/pre-requisites/delete',preRequisites.delete);
router.post('/pre-requisites/update',preRequisites.update);
router.post('/pre-requisites/showEntryList',preRequisites.showEntryList);
router.post('/pre-requisites/search',preRequisites.search);



module.exports = router;

