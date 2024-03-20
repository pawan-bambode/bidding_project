const areas = require('../../../models/admin/areas/areas');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([
            areas.getList(res.locals.slug, res.locals.biddingId),
            areas.getCount(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/areas/index.ejs', {
                areaList: result[0].recordset,
                pageCount: result[1].recordset[0][''],
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    refresh: (req, res) => {
        areas.refresh(res.locals.slug, res.locals.biddingId, res.locals.userId).then(result => {
            res.status(200).json(JSON.parse(result.output.output_json));
        }).catch(error => {
            if (isJsonString.isJsonString(error.originalError.info.message)) {
                res.status(500).json(JSON.parse(error.originalError.info.message));
            } else {
                res.status(500).json({
                    status: 500,
                    description: error.originalError.info.message,
                    data: []
                });
            }
        });
    },

    showEntry: (req, res) => {
        Promise.all([
            areas.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),
            areas.showEntryCount(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                data: result[0].recordset,
                length: result[1].recordset[0]['']
            });
        }).catch(error => {
            throw error;
        });
    },

    search: (req, res) => {
        Promise.all([
            areas.search(res.locals.slug, res.locals.biddingId, req.body.pageNo, req.body.searchLetter, req.body.showEntry),
            areas.searchCount(res.locals.slug, res.locals.biddingId, req.body.pageNo, req.body.searchLetter)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                data: result[0].recordset,
                length: result[1].recordset[0]['']
            });
        }).catch(error => {
            if (isJsonString.isJsonString(error.originalError.info.message)) {
                res.status(500).json(JSON.parse(error.originalError.info.message));
            } else {
                res.status(500).json({
                    status: 500,
                    description: error.originalError.info.message,
                    data: []
                });
            }
        });
    }
};
