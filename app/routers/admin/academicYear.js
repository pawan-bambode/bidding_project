const router = require('express').Router();
const academicyear = require('../../controllers/admin/academicyear/academicYear')

router.get('/academic_year',academicyear.getAcademicYear);
router.post('/addAcademicYear',academicyear.save)

module.exports = router;