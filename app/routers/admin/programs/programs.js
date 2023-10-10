const router = require('express').Router();
const program = require('../../../controllers/admin/program/index');
router.get('/programs',program.getPage);
router.post('/programs/create',program.create);
router.post('/program/update',program.update);
router.post('/program/delete',program.delete);

module.exports = router;