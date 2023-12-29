
const {
    isLoggedIn,
    check,
    checkPermission

} = require("../../middlewares/user");

function AdminRoute(app) {
    const adminDashboard = require('../../routers/admin/dashboard');
    const course = require('../../routers/admin/course');
    const studentInfo = require('../../routers/admin/student');
    const academicYearInfo = require('../../routers/admin/academicYear');
    //const timetableShowToStudent = require('../../routers/admin/student');

    const program = require('../../routers/admin/programs/programs')
    const biddingSession = require('../../routers/admin/biddingsession/biddingsession')
    const generateExcel = require('../../routers/admin/generatesampleCoursesImportExcelFile/generatedExecl')
    const area = require('../../routers/admin/areas/areas')
    const specialization = require('../../routers/admin/specialization/specialization');
    const concentrationSettings = require('../../routers/admin/concentrationsettings/concentration')
    const divisionBatches = require('../../routers/admin/divisionBatches/divisionBatches')
    const completeCourse = require('../../routers/admin/completeCourses/completecourses')
    const preRequisites = require('../../routers/admin/preRequisite/prerequisite')
    const timetable = require('../../routers/admin/timetable/timetable')
    const student = require('../../routers/student/student');
    const binddingRound = require('../../routers/admin/biddingrounds/biddingrounds');

    const demandEstimation = require('../../routers/student/demandEstimation/demandEstimation');
    const favouriteCourse = require('../../routers/student/favouriteCourse/favouriteCourse');
    const bidding = require('../../routers/student/bidding/bidding');
    const confirmation = require('../../routers/student/confirmation/confirmation');
    const waitList = require('../../routers/student/waitList/waitList');
    const addDrop = require('../../routers/student/addDrop/addDrop');
    
    app.use('/admin/', isLoggedIn, checkPermission, adminDashboard);
    app.use('/admin/', course);
    app.use('/admin/', studentInfo);
    app.use('/admin/', academicYearInfo)
    app.use('/admin/', program);
    app.use('/admin/', biddingSession);
    app.use('/admin/', generateExcel);
    app.use('/admin/', area);
    app.use('/admin/', specialization);
    app.use('/admin/', concentrationSettings);
    app.use('/admin/', divisionBatches);
    app.use('/admin/', completeCourse);
    app.use('/admin/', preRequisites);
    app.use('/admin/', timetable);
    app.use('/admin/', binddingRound);

    app.use('/student/', isLoggedIn, checkPermission, student)
    app.use('/student', demandEstimation);
    app.use('/student', favouriteCourse);
    app.use('/student', bidding);
    app.use('/student', confirmation);
    app.use('/student', waitList);
    app.use('/student', addDrop);
}

module.exports = AdminRoute;