const router = require('express').Router();
const favouriteCourse = require('../../../controllers/student/favouriteCourse/favouriteCourse')

router.get('/available-course',favouriteCourse.getPage)