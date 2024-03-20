
module.exports = {
    getPage: (req, res) => { 
        let sidebarActive = req.sidebarActive.split('/');
            res.render('admin/dashboard/index', {
                currentFormStep: 0,
                active: sidebarActive[2],
                path: '/admin',
                breadcrumbs: req.breadcrumbs
            });
    },

    masterData: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        res.render('admin/masterData/index', {
            active:sidebarActive[2],
            breadcrumbs: req.breadcrumbs
        });
    },

    biddingSettings: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        res.render('admin/biddingSettings/index', {
            active:sidebarActive[2],
            breadcrumbs: req.breadcrumbs
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
