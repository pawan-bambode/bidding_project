const favouriteCourse = require('../../../models/student/favouriteCourse/favouriteCourse');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const course = require('../../../models/admin/course/course');
const isJsonString = require('../../../utils/util');

module.exports = {

    getPage: (req, res) => {
        let availableCourseUrl = req.route.path.split('/');
        let availableCourse = availableCourseUrl[availableCourseUrl.length - 1];
  
        Promise.all([
            course.acadSessionList(res.locals.slug, res.locals.biddingId),
            divisionBatch.courseList(res.locals.slug, res.locals.biddingId),
            favouriteCourse.getFavCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId),
            favouriteCourse.getFavouriteCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId)
        ]).then(result => {
            console.log('vlauesof available courses', result[2].recordset);
            res.render('student/availablecourse/index', {
                active: availableCourse,
                dropdownAcadSessionList: result[0].recordset,
                courseList: result[1].recordset,
                availableCourseList: result[2].recordset,
                favCourseList: result[3].recordset
            });
        });
    },

    getCourseByAcadSession: (req, res) => {
        Promise.all([
            divisionBatch.getBiddingCourseByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, res.locals.studentId),
            divisionBatch.areaList(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                availableCourseList: result[0].recordset,
                areaList: result[1].recordset
            });
        });
    },

    getCourseByCourseId: (req, res) => {
        Promise.all([
            divisionBatch.getBiddingCourseByCourseId(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.courseId, res.locals.studentId)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                availableCourseList: result[0].recordset
            });
        });
    },

    getCourseByArea: (req, res) => {
        Promise.all([
            divisionBatch.getBiddingCourseByAreaName(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName, res.locals.studentId),
            divisionBatch.getCourseNameAreaWiseFilter(res.locals.slug, res.locals.biddingId, req.body.acadSessionId, req.body.areaName)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                availableCourseList: result[0].recordset,
                courseName: result[1].recordset
            });
        });
    },

    addFavourite: (req, res) => {
        divisionBatch.addFavourite(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.addFavCourse)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if (isJsonString.isJsonString(error.originalError.info.message)) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.status(500).json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    }
};  
