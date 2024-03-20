const program = require('../../../models/admin/program/program');
const isJsonString = require('../../../utils/util');

module.exports = {

    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        Promise.all([
        program.getList(res.locals.slug, res.locals.biddingId),
        program.getCount(res.locals.slug, res.locals.biddingId),
        program.getListFromDbo(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
        res.render('admin/programs/program/index.ejs', {
            programList: result[0].recordset,
            pageCount: result[1].recordset[0][''],
            programListFromDbo: result[2].recordset,
            active: sidebarActive[2],
            breadcrumbs: req.breadcrumbs
        });
        });
    },
  
    create: (req, res) => {
        let object = {
        import_programs: JSON.parse(req.body.inputJSON)
        };
        program.create(object, res.locals.slug, res.locals.userId, req.body.biddingSessionId)
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
        program.update(req.body, res.locals.slug, res.locals.userId, req.body.bidding_session_lid)
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
        let programId = req.body.program_id !== undefined ? req.body.program_id : null;
        program.delete(programId, res.locals.slug, res.locals.userId, req.body.biddingSessionId)
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
        program.search(res.locals.slug, res.locals.biddingId, req.body.pageNo, res.locals.userId, req.body.searchLetter, req.body.showEntry),
        program.searchCount(res.locals.slug, res.locals.biddingId, req.body.pageNo, res.locals.userId, req.body.searchLetter)
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
    },

    showEntry: (req, res) => {
        Promise.all([
        program.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry),
        program.showEntryCount(res.locals.slug, res.locals.biddingId)
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
    }
};
