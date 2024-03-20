const router = require('express').Router();
const favouriteCourse = require('../../../controllers/student/favouriteCourse/favouriteCourse')

router.get('/available-course', favouriteCourse.getPage);
router.post('/available-course/course-by-area', favouriteCourse.getCourseByArea);
router.post('/available-course/course', favouriteCourse.getCourseByCourseId);
router.post('/available-course/by-acadsession', favouriteCourse.getCourseByAcadSession);
router.post('/available-course/add-favourite', favouriteCourse.addFavourite);

module.exports = router;