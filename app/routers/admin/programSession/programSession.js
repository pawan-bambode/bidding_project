const router = require('express').Router();
const programSessions = require('../../../controllers/admin/programSession/programsession');

router.get('/dashboard/program-sessions', programSessions.getPage);
router.get('/master-data/program-sessions', programSessions.getPage);

router.post('/program-sessions/refresh', programSessions.refresh);
router.post('/program-sessions/update', programSessions.update);
router.post('/program-sessions/search', programSessions.search);
router.post('/program-sessions/showEntry', programSessions.showEntry);

module.exports = router;