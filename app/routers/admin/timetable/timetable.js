const router = require('express').Router();
const timetable = require('../../../controllers/admin/timetable/timetable');
const upload = require('../../../middlewares/multerUpload')

router.get('/timetable',timetable.getTimetablePage);
router.get('/timetable/generate-excel',timetable.generateExcel);
router.post('/timetable/upload',upload.single('import-elective-timetable'),timetable.upload)

module.exports = router;