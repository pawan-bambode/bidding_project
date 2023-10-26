const { Result } = require('express-validator')
const dashboardCount = require('../../models/admin/dashboard/dashboardCount')
const DashboardCount = require('../../models/admin/dashboard/dashboardCount')
module.exports = {
    getDashboard: (req, res) => {
      Promise.all([dashboardCount.getCouresCount(res.locals.slug,res.locals.biddingId),DashboardCount.getProgramCount(res.locals.slug,res.locals.biddingId),dashboardCount.getProgramSessionCount(res.locals.slug,res.locals.biddingId),dashboardCount.getAreaCount(res.locals.slug,res.locals.biddingId),dashboardCount.getConcentrationCount(res.locals.slug,res.locals.biddingId),dashboardCount.getConcentrationSettingsCount(res.locals.slug,res.locals.biddingId),dashboardCount.getStudentCount(res.locals.slug,res.locals.biddingId)]).then(result =>{
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