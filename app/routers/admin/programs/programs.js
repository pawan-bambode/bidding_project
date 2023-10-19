const router = require('express').Router();
const program = require('../../../controllers/admin/programs/program/index');
const programSessions = require('../../../controllers/admin/programs/programsessions/index')
router.get('/programs',program.getPage);
router.post('/programs/create',program.create);
router.post('/program/update',program.update);
router.post('/program/delete',program.delete);

router.get('/program/program-session',programSessions.getPage);
router.post('/program/program-session/refresh',programSessions.refresh);
router.post('/program/program-session/update-credits',programSessions.update)

module.exports = router;