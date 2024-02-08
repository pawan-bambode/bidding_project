const router = require('express').Router();
const upload = require('../../../middlewares/multerUpload');
const divisionBatches = require('../../../controllers/admin/divisionBatches/divisionBatches');
const diviionBatchesExcel = require('../../../controllers/admin/excel/divisionBatches/divisionBatches');

router.get('/division-batches', divisionBatches.getList);
router.post('/division-batches/update', divisionBatches.update);
router.post('/division-batches/delete', divisionBatches.delete);
router.post('/division-batches/delete-all', divisionBatches.deleteAll);
router.post('/division-batches/search', divisionBatches.search);
router.post('/division-batches/showEntry', divisionBatches.showEntry);
router.post('/division-batches/filter-by-programId', divisionBatches.listByProgramId);
router.post('/division-batches/filter-by-session-id', divisionBatches.listBySessionId);

router.post('/division-batches/upload', upload.single('import-division-batches'), diviionBatchesExcel.upload);
router.get('/division-batches/generate-excel', diviionBatchesExcel.generateExcel);

module.exports = router;
