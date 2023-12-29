const router = require('express').Router();
const addDrop = require('../../../controllers/student/addDrop/addDrop');

router.get('/add-drop', addDrop.getPage);

module.exports = router;