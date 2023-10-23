const { Result } = require('express-validator')
const dashboardCount = require('../../models/admin/dashboard/dashboardCount')
const DashboardCount = require('../../models/admin/dashboard/dashboardCount')
module.exports = {
    getDashboard: (req, res) => {
      Promise.all([dashboardCount.getCouresCount(res.locals.slug),DashboardCount.getProgramCount(res.locals.slug),dashboardCount.getProgramSessionCount(res.locals.slug),dashboardCount.getAreaCount(res.locals.slug),dashboardCount.getConcentrationCount(res.locals.slug),dashboardCount.getConcentrationSettingsCount(res.locals.slug),dashboardCount.getStudentCount(res.locals.slug)]).then(result =>{
        res.render('admin/dashboard/index', {
            currentFormStep: 0,
            courseCount: result[0],
            programCount:result[1],
            programSessionCount:result[2],
            areaCount:result[3],
            concentrationCount:result[4],
            concentrationSettingCount:result[5],
            studentCount:result[6],
            path:'/admin'
      })  
        
        })

    },
 
    dashboardStepForm: (req, res) => {
      
        res.render('admin/dashboard/index', {
            
            path:'/admin'
        })        
    },



}