const router = require('express').Router();
const demandEstimation = require('../../../controllers/student/demandEstimation/demandEstimation')

router.get('/demand-estimation',demandEstimation.getPage);
router.post('/demand-estimation/courses-by-acad',demandEstimation.coursesByAcad);
router.post('/demand-estimation/courses-by-area',demandEstimation.courseByArea);
router.post('/demand-estimation/save',demandEstimation.save);

//router.post('/demand-estimation/search-by-letter',demandEstimation.searchByLetter);

module.exports = router;