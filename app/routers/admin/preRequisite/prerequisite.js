const router = require('express').Router();
const preRequisites = require('../../../controllers/admin/preRequisites/preRequisites');
const preRequisiteExcel = require('../../../controllers/admin/excel/preRequisites/preRequisites');
const upload = require('../../../middlewares/multerUpload');

router.get('/dashboard/pre-requisites', preRequisites.getPage);
router.get('/master-data/pre-requisites', preRequisites.getPage);
router.post('/pre-requisites/delete', preRequisites.delete);
router.post('/pre-requisites/update', preRequisites.update);
router.post('/pre-requisites/showEntry', preRequisites.showEntry);
router.post('/pre-requisites/search', preRequisites.search);

router.get('/pre-requisites/generate-excel', preRequisiteExcel.generateExcel);
router.post('/pre-requisites/upload', upload.single('import-pre-requisites'), preRequisiteExcel.upload);

module.exports = router;
