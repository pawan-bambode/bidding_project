const router = require('express').Router();
const acad_session = require('../../controllers/admin/acadsession/acadsession');
const program = require('../../controllers/admin/programs/program/index');
router.get('/acad_session',acad_session.getAcadSessions);
module.exports = router