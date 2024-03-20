const biddingSession = require('../../../models/admin/biddingsession/biddingsession');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
    let sidebarActive = req.sidebarActive.split('/');
    
        Promise.all([
            biddingSession.biddingSessions(res.locals.slug, res.locals.status),
            biddingSession.acadSessions(res.locals.biddingId)
        ]).then(result => {
            res.render('admin/biddingsession/index.ejs', {
                biddingSessions: result[0].recordset,
                acadSessions: result[1].recordset,
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    create: (req, res) => {
        biddingSession.create(req.body.inputJSON, res.locals.slug, res.locals.userId)
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

    delete: (req, res) => {
        biddingSession.delete(req.body.id, res.locals.slug, res.locals.userId)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                if ((isJsonString.isJsonString(error.originalError.info.message))) {
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
        biddingSession.update(req.body.updateBiddingSession, req.body.id, res.locals.slug, res.locals.userId)
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

    active: (req, res) => {
        biddingSession.active(res.locals.slug)
            .then(result => {
                res.json({
                    status: 200,
                    data: result.recordset
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    description: error.originalError.info.message,
                    data: []
                });
            });
    },

    updateStatus: (req, res) => {
        biddingSession.updateStatus(res.locals.slug, JSON.stringify(req.body), res.locals.userId)
            .then(result => {
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
    }
};
