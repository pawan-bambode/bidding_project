const router = require('express').Router();
const program = require('../../../controllers/admin/program/program');

router.get('/dashboard/programs', program.getPage);
router.get('/master-data/programs', program.getPage);
router.post('/programs/create', program.create);
router.post('/programs/update', program.update);
router.post('/programs/delete', program.delete);
router.post('/programs/search', program.search);
router.post('/programs/showEntry', program.showEntry);

module.exports = router;
