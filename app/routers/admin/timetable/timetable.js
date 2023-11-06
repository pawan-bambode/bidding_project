const router = require('express').Router();
const timetable = require('../../../controllers/admin/timetable/timetable');
const upload = require('../../../middlewares/multerUpload')

router.get('/timetable',timetable.getTimetablePage);
router.get('/timetable/generate-excel',timetable.generateExcel);
router.post('/timetable/upload',upload.single('import-elective-timetable'),timetable.upload)
router.post('/timetable-delete-modal/acadsession',timetable.getDeleteTimetableModal)
router.post('/timetable-delete-modal/delete',timetable.delete)
module.exports = router;