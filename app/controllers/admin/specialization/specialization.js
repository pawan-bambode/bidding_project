const specialization = require('../../../models/admin/specialization/specialization');
const isJsonString = require('../../../utils/util');

module.exports = {

    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([
            specialization.getList(res.locals.slug, res.locals.biddingId, req.body.showEntry),
            specialization.getCount(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/specialization/index.ejs', {
                specializationList: result[0].recordset,
                pageCount: result[1].recordset[0][''],
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    add: (req, res) => {
        specialization.add(req.body, res.locals.biddingId, res.locals.userId, res.locals.slug)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if (isJsonString.isJsonString(error.originalError.info.message)) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    },

    delete: (req, res) => {
        specialization.delete(req.body.specializationId, res.locals.biddingId, res.locals.userId, res.locals.slug)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if (isJsonString.isJsonString(error.originalError.info.message)) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    },

    update: (req, res) => {
        specialization.update(req.body, res.locals.biddingId, res.locals.userId, res.locals.slug)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if (isJsonString.isJsonString(error.originalError.info.message)) {
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    },

    showEntry: (req, res) => {
        Promise.all([
            specialization.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),
            specialization.showEntryCount(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo)
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
            specialization.search(res.locals.slug, res.locals.biddingId, req.body.pageNo, req.body.searchLetter, req.body.showEntry),
            specialization.searchCount(res.locals.slug, res.locals.biddingId, req.body.pageNo, req.body.searchLetter)
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
