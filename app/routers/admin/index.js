const {
    isLoggedIn,
    check,
    checkPermission
} = require("../../middlewares/user");

function AdminRoute(app) {
    const adminDashboard = require('../../routers/admin/dashboard');
    const courseWorkload = require('../../routers/admin/courseworkload');
    const studentInfo = require('../../routers/admin/student');
    const acadsessionInfo = require('../../routers/admin/acad_session')
    const academicYearInfo = require('../../routers/admin/academicYear')
    const timetableShowToStudent = require('../../routers/student/index')

    
    
   
    app.use('/admin/', isLoggedIn, checkPermission, adminDashboard);
    app.use('/admin/', courseWorkload);
    app.use('/admin/', studentInfo);
    app.use('/admin/',acadsessionInfo)
    app.use('/admin/',academicYearInfo)
    app.use('/student/',timetableShowToStudent)
    
  
}

module.exports = AdminRoute;