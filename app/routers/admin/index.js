const {
    isLoggedIn,
    check,
    checkPermission
} = require("../../middlewares/user");

function AdminRoute(app) {
    const adminDashboard = require('../../routers/admin/dashboard');
   
    app.use('/admin/', isLoggedIn, checkPermission, adminDashboard);
  
}

module.exports = AdminRoute;