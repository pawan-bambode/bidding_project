
const {
    isLoggedIn,
    check,
    checkPermission

} = require("../../middlewares/user");


function AdminRoute(app) {
    const adminDashboard = require('../../routers/admin/dashboard');
    const courseWorkload = require('../../routers/admin/courseworkload');
    const studentInfo = require('../../routers/admin/student');
    const acadsessionInfo = require('../../routers/admin/acad_session');
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
    
    app.use('/admin/', isLoggedIn, checkPermission, adminDashboard);
    app.use('/admin/', courseWorkload);
    app.use('/admin/', studentInfo);
    app.use('/admin/', acadsessionInfo)
    app.use('/admin/', academicYearInfo)
    app.use('/student/', student)
    app.use('/admin/', program);
    app.use('/admin/', biddingSession);
    app.use('/admin/',generateExcel);
    app.use('/admin/',area);
    app.use('/admin/',specialization);
    app.use('/admin/',concentrationSettings);
    app.use('/admin/',divisionBatches);
    app.use('/admin/',completeCourse);
    app.use('/admin/',preRequisites);
    app.use('/admin/',timetable);
}

module.exports = AdminRoute;