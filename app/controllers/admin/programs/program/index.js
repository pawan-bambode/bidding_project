const program = require('../../../../models/admin/programs/program');
const isJsonString = require('../../../../utils/util')

module.exports = {
    getPage: (req, res) => {
        Promise.all([program.getAllProgram(req, res), program.getAllProgramFromDbo(req, res, res.locals.slug)])
            .then(result => {
                res.render('admin/programs/program/index.ejs', {
                    programList: result[0].recordset,
                    programListFromDbo: result[1].recordset
                });
            });
    },
    create: (req, res) => {
        let object = {
            import_programs: JSON.parse(req.body.inputJSON)
        };
        program.save(object, 'sbm_mum', res.locals.userId,req.body.biddingSessionId)
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
        program.update(req.body, 'sbm_mum', res.locals.userId,req.body.bidding_session_lid)
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

        req.body.program_id == 'undefined'?NULL:req.body.program_id;
        program.delete(req.body.program_id, 'sbm_mum', res.locals.userId,req.body.biddingSessionId)
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
    }
};
