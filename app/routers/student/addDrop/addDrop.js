const router = require('express').Router();
const addDrop = require('../../../controllers/student/addDrop/addDrop');

router.get('/add-drop', addDrop.getPage);
router.post('/add-drop/round-wise', addDrop.getRoundWiseDetails)
router.post('/add-drop/add', addDrop.addDrop)

module.exports = router;