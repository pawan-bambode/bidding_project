
module.exports = {
    getDashboard: (req, res) => {
        let adminDashboardUrl = req.route.path.split('/');
        let dashboard = adminDashboardUrl[adminDashboardUrl.length - 1];
            res.render('admin/dashboard/index', {
                currentFormStep: 0,
                active: dashboard,
                path: '/admin',
                breadcrumbs: req.breadcrumbs[0]
            });
    },

    masterData: (req, res) => {
        let adminMasterUrl = req.route.path.split('/');
        let master = adminMasterUrl[adminMasterUrl.length - 1];
        res.render('admin/masterData/index', {
            active: master
        });
    },

    secondaryData: (req, res) => {
        let adminSecondaryUrl = req.route.path.split('/');
        let secondary = adminSecondaryUrl[adminSecondaryUrl.length - 1];
        res.render('admin/secondarydata/index', {
            active: secondary
        });
    },

    biddingSettings: (req, res) => {
        let biddingSettingUrl = req.route.path.split('/');
        let biddingSettings = biddingSettingUrl[biddingSettingUrl.length - 1];
        res.render('admin/biddingSettings/index', {
            active: biddingSettings
        });
    },

    roundSettings: (req, res) => {
        let roundSettingUrl = req.route.path.split('/');
        let roundSettings = roundSettingUrl[roundSettingUrl.length - 1];
        res.render('admin/roundSettings/index', {
            active: roundSettings
        });
    },

    reports: (req, res) => {
        let reportUrl = req.route.path.split('/');
        let report = reportUrl[reportUrl.length - 1];
        res.render('admin/reports/index', {
            active: report
        });
    },

    utility: (req, res) => {
        let utilityUrl = req.route.path.split('/');
        let utility = utilityUrl[utilityUrl.length - 1];
        res.render('admin/utility/index', {
            active: utility
        });
    },
};
