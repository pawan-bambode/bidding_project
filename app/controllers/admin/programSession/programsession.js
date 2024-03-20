const programSession = require('../../../models/admin/programSession/programsession');
const isJsonString = require('../../../utils/util');

module.exports = {
    
    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([
            programSession.getList(res.locals.slug, res.locals.biddingId),
            programSession.getCount(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/programs/programsession/index.ejs', {
                programSessionList: result[0].recordset,
                pageCount: result[1].recordset[0][''],
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    refresh: (req, res) => {
        programSession.refresh(res.locals.slug, res.locals.biddingId, res.locals.userId)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
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

    update: (req, res) => {
        programSession.update(req.body, res.locals.slug, res.locals.biddingId, res.locals.userId)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
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

    search: (req, res) => {
        Promise.all([
            programSession.search(req.body.pageNo, req.body.searchLetter, req.body.showEntry, res.locals.slug, res.locals.biddingId, res.locals.userId),
            programSession.searchCount(req.body.pageNo, req.body.searchLetter, res.locals.slug, res.locals.biddingId, res.locals.userId)
        ]).then(result => {
            
            res.json({
                status: '200',
                programSessionList: result[0].recordset,
                message: 'Result Data is Fetch',
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
    },

    showEntry: (req, res) => {
        Promise.all([
            programSession.showEntry(req.body.showEntry, res.locals.slug, res.locals.biddingId, req.body.pageNo),
            programSession.showEntryCount(res.locals.slug, res.locals.biddingId, req.body.pageNo)
        ]).then(result => {
            res.json({
                status: '200',
                programSessionList: result[0].recordset,
                message: 'Result Data is Fetch',
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
