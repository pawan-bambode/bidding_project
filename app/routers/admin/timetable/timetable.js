const router = require('express').Router();
const timetable = require('../../../controllers/admin/timetable/timetable');
const upload = require('../../../middlewares/multerUpload');
const timetableExcel = require('../../../controllers/admin/excel/timetable/timetable');

router.get('/timetable', timetable.getPage);
router.post('/timetable-delete-modal/acadsession', timetable.deleteByAcadSession);
router.post('/timetable-delete-modal/delete', timetable.delete);
router.post('/timetable/by-day', timetable.getListByDay);

router.get('/timetable/generate-excel', timetableExcel.generateExcel);
router.post('/timetable/upload', upload.single('import-elective-timetable'), timetableExcel.upload);

module.exports = router;
