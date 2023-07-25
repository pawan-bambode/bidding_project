
module.exports = {
    getDashboard: (req, res) => {
        
        res.render('admin/dashboard/index', {
            currentFormStep: 0,
            path:'/admin'
        })

    },
 
    dashboardStepForm: (req, res) => {
      
        res.render('admin/dashboard/index', {
            
            path:'/admin'
        })        
    },



}