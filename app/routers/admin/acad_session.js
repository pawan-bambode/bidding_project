const router = require('express').Router();
const acad_session = require('../../controllers/admin/acadsession/acadsession');
router.get('/acad_session',acad_session.getAcadSessions);
module.exports = router