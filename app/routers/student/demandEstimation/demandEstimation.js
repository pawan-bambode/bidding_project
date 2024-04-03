const router = require('express').Router();
const demandEstimation = require('../../../controllers/student/demandEstimation/demandEstimation')

router.get('/demand-estimation', demandEstimation.getPage);
router.post('/demand-estimation/courses-by-acad', demandEstimation.coursesByAcad);
router.post('/demand-estimation/courses-by-area', demandEstimation.courseByArea);
router.post('/demand-estimation/save', demandEstimation.save);

module.exports = router;