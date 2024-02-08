const router = require('express').Router();
const program = require('../../../controllers/admin/programs/program/index');
const programSessions = require('../../../controllers/admin/programs/programsessions/index');

router.get('/program', program.getPage);
router.post('/program/create', program.create);
router.post('/program/update', program.update);
router.post('/program/delete', program.delete);
router.post('/program/search', program.search);
router.post('/program/showEntry', program.showEntry);

router.get('/program-session', programSessions.getPage);
router.post('/program-session/refresh', programSessions.refresh);
router.post('/program-session/update', programSessions.update);
router.post('/program-sessions/search', programSessions.search);
router.post('/program-sessions/showEntry', programSessions.showEntry);

module.exports = router;
