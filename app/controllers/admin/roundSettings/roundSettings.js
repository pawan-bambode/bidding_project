const roundSettings = require('../../../models/admin/roundSettings/roundSettings');
const isJsonString = require('../../../utils/util');

module.exports = {

    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([
            roundSettings.getList(res.locals.slug, res.locals.biddingId),
            roundSettings.preDefineRounds(res.locals.slug, res.locals.biddingId),
            roundSettings.students(res.locals.slug, res.locals.biddingId),
            roundSettings.courses(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/roundSettings/index.ejs', {
                biddingRounds: result[0].recordset,
                pageCount: result[0].recordset.length,
                predefineRounds: result[1].recordset,
                students: result[2].recordset,
                courses: result[3].recordset,
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    create: (req, res) => {
        roundSettings.create(req.body.inputJSON, res.locals.slug, res.locals.userId, res.locals.biddingId)
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
        roundSettings.delete(req.body.biddingRoundId, res.locals.slug, res.locals.userId, req.body.biddingSessionId)
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
        roundSettings.update(req.body.inputJSON, res.locals.slug, res.locals.userId, res.locals.biddingId)
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
            roundSettings.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry),
            roundSettings.searchCount(res.locals.slug, res.locals.biddingId, req.body.searchLetter)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Result fetched",
                data: result[0].recordset,
                length: result[1].recordset[0]['']
            });
        }).catch(error => {
            throw error;
        });
    },

    roundWiseMapping: (req, res) => {
        Promise.all([
            roundSettings.studentsMapping(res.locals.slug, res.locals.biddingId, req.body.roundId),
            roundSettings.coursesMapping(res.locals.slug, res.locals.biddingId, req.body.roundId)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Result fetched",
                studentsMapping: result[0].recordset,
                coursesMapping: result[1].recordset
            });
        }).catch(error => {
            throw error;
        });
    }
};
