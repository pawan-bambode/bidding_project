const {
    isLoggedIn,
    check,
    checkPermission
} = require("../../middlewares/user");

function AdminRoute(app) {
    
    // Admin side all routes
    const adminDashboard = require('../../routers/admin/dashboard/dashboard');
    const biddingSession = require('../../routers/admin/biddingsession/biddingsession');
    const program = require('../../routers/admin/programs/programs');
    const course = require('../../routers/admin/courses/courses');
    const area = require('../../routers/admin/areas/areas');
    const specialization = require('../../routers/admin/specialization/specialization');
    const concentrationSettings = require('../../routers/admin/concentrationsettings/concentration');
    const studentData = require('../../routers/admin/studentData/student');
    const preRequisites = require('../../routers/admin/preRequisite/prerequisite');
    const completedCourse = require('./completedCourses/completedCourses');
    const divisionBatches = require('../../routers/admin/divisionBatches/divisionBatches');
    const timetable = require('../../routers/admin/timetable/timetable');
    const binddingRound = require('../../routers/admin/biddingrounds/biddingrounds');
    const bonusBiddingPoint = require('../../routers/admin/bonusBidPoints/bonusBidPoint');

    const student = require('../../routers/student/student');
    const demandEstimation = require('../../routers/student/demandEstimation/demandEstimation');
    const favouriteCourse = require('../../routers/student/favouriteCourse/favouriteCourse');
    const bidding = require('../../routers/student/bidding/bidding');
    const confirmation = require('../../routers/student/confirmation/confirmation');
    const waitList = require('../../routers/student/waitList/waitList');
    const addDrop = require('../../routers/student/addDrop/addDrop');

    app.use('/admin/', isLoggedIn, checkPermission, adminDashboard);
    app.use('/admin/', biddingSession);
    app.use('/admin/', program);
    app.use('/admin/', course);
    app.use('/admin/', area);
    app.use('/admin/', specialization);
    app.use('/admin/', concentrationSettings);
    app.use('/admin/', studentData);
    app.use('/admin/', preRequisites);
    app.use('/admin/', completedCourse);
    app.use('/admin/', divisionBatches);
    app.use('/admin/', timetable);
    app.use('/admin/', binddingRound);
    app.use('/admin/', isLoggedIn, checkPermission, bonusBiddingPoint);

    app.use('/student/', isLoggedIn, checkPermission, student);
    app.use('/student', isLoggedIn, checkPermission, demandEstimation);
    app.use('/student', isLoggedIn, checkPermission, favouriteCourse);
    app.use('/student', isLoggedIn, checkPermission, bidding);
    app.use('/student', isLoggedIn, checkPermission, confirmation);
    app.use('/student', isLoggedIn, checkPermission, waitList);
    app.use('/student', isLoggedIn, checkPermission, addDrop);
}

module.exports = AdminRoute;
