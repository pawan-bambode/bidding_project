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
router.post('/pre-requisite/courses-by-acad-session', preRequisites.courses);
router.post('/pre-requisites/add', preRequisites.add);

module.exports = router;
