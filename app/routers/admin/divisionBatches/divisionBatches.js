const router = require('express').Router()
const upload = require('../../../middlewares/multerUpload');
const divisionBatches = require('../../../controllers/admin/divisionBatches/divisionBatches');

router.get('/division-batches',divisionBatches.getDivisionBatches);
router.post('/upload-division-batches',upload.single('import-division-batches'),divisionBatches.uploadDivisionBatches);
router.get('/generate-excel-for-division-batches',divisionBatches.sampleForDivisionBatches);
router.post('/division-batches/update',divisionBatches.update);
router.post('/division-batches/delete',divisionBatches.delete);
router.post('/division-batches/delete-all',divisionBatches.deleteAll);
router.post('/division-batches/search',divisionBatches.search);
router.post('/division-batches/showEntryDivisionBatchesList',divisionBatches.showEntryDivisionBatchesList);
router.post('/division-batches/filter-by-programId',divisionBatches.filterByProgramId)
router.post('/division-batches/filter-by-session-id',divisionBatches.filterBySessionId)


module.exports = router;