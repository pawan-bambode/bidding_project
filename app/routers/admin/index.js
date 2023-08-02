const {
    isLoggedIn,
    check,
    checkPermission
} = require("../../middlewares/user");

function AdminRoute(app) {
    const adminDashboard = require('../../routers/admin/dashboard');
    const courseWorkload = require('../../routers/admin/courseworkload');
    const studentInfo = require('../../routers/admin/student');
   
    app.use('/admin/', isLoggedIn, checkPermission, adminDashboard);
    app.use('/admin/', courseWorkload);
    app.use('/admin/', studentInfo);
    
  
}

module.exports = AdminRoute;