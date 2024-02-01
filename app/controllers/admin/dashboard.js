const dashboardCount = require('../../models/admin/dashboard/dashboardCount')
const DashboardCount = require('../../models/admin/dashboard/dashboardCount')

module.exports = {
    getDashboard: (req, res) => {

      let adminDashboardUrl = req.route.path.split('/');
      let dashboard = adminDashboardUrl[adminDashboardUrl.length-1]
      Promise.all([dashboardCount.getCouresCount(res.locals.slug, res.locals.biddingId),DashboardCount.getProgramCount(res.locals.slug, res.locals.biddingId),dashboardCount.getProgramSessionCount(res.locals.slug, res.locals.biddingId),dashboardCount.getAreaCount(res.locals.slug, res.locals.biddingId),dashboardCount.getConcentrationCount(res.locals.slug, res.locals.biddingId),dashboardCount.getConcentrationSettingsCount(res.locals.slug, res.locals.biddingId),dashboardCount.getStudentCount(res.locals.slug, res.locals.biddingId),dashboardCount.getPrequisitesCounts(res.locals.slug, res.locals.biddingId),dashboardCount.getCompleteCourseCount(res.locals.slug, res.locals.biddingId),dashboardCount.getDivisionBatchCount(res.locals.slug, res.locals.biddingId),dashboardCount.getRoundSettingCount(res.locals.slug, res.locals.biddingId)]).then(result =>{
        res.render('admin/dashboard/index', {
            currentFormStep: 0,
            active:dashboard,
            courseCount: result[0],
            programCount:result[1],
            programSessionCount:result[2],
            areaCount:result[3],
            concentrationCount:result[4],
            concentrationSettingCount:result[5],
            studentCount:result[6],
            preRequisiteCount:result[7],
            completedCourseCount:result[8],
            divisionBatchCount:result[9],
            roundSettingCount:result[10],
            path:'/admin',
            breadcrumbs: req.breadcrumbs[0]
         })     
        })
    },

    masterData :(req, res) =>{
        let adminMasterUrl = req.route.path.split('/');
        let master = adminMasterUrl[adminMasterUrl.length-1]
        console.log('values of master', master);
        res.render('admin/masterData/index',{
        active: master 
        })
    },
    
    secondaryData :(req, res) =>{
        let adminSecondaryUrl = req.route.path.split('/');
        let secondary = adminSecondaryUrl[adminSecondaryUrl.length-1]
        res.render('admin/secondarydata/index',{
        active: secondary 
        })
    },  
    
    biddingSettings :(req, res) =>{
        let biddingSettingUrl = req.route.path.split('/');
        let biddingSettings = biddingSettingUrl[biddingSettingUrl.length-1]
        res.render('admin/biddingSettings/index',{
        active: biddingSettings 
        })
    },
    
    roundSettings :(req, res) =>{
        let roundSettingUrl = req.route.path.split('/');
        let roundSettings = roundSettingUrl[roundSettingUrl.length-1]
        res.render('admin/roundSettings/index',{
        active: roundSettings 
        })
    },

    reports:(req, res) =>{
        let reportUrl = req.route.path.split('/');
        let report = reportUrl[reportUrl.length-1]
        res.render('admin/reports/index',{
        active: report 
        })
    },

    utility :(req, res) =>{
        let utilityUrl = req.route.path.split('/');
        let utility = utilityUrl[utilityUrl.length-1]
        res.render('admin/utility/index',{
        active: utility 
        })
    },
    
}