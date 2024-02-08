const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const isJsonString = require('../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');

module.exports = {
    getList : (req, res) => {
        Promise.all([
            divisionBatch.getList(res.locals.slug, res.locals.biddingId),
            divisionBatch.getCount(res.locals.slug, res.locals.biddingId),
            divisionBatch.programList(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/divisionBatches/index.ejs', {
                divisionBatchList: result[0].recordset,
                pageCount: result[1].recordset[0][''],
                programList: result[2].recordset,
                active: 'dashboard',
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    update: (req, res) => {
        divisionBatch.update(req.body.editDivisionBatches, req.body.biddingSessionId, res.locals.userId, res.locals.slug)
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
        divisionBatch.delete(req.body.id, res.locals.slug, res.locals.biddingId, res.locals.userId)
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
   
    deleteAll: (req, res) => {
        divisionBatch.deleteAll(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body)
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
            divisionBatch.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId, req.body.acadSessionId, req.body.showEntry, req.body.pageNo),
            divisionBatch.searchCount(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId, req.body.acadSessionId)
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

    showEntry : (req, res) => {
        Promise.all([
            divisionBatch.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),
            divisionBatch.showEntryCount(res.locals.slug, res.locals.biddingId)
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

    listByProgramId: (req, res) => {
        Promise.all([
            divisionBatch.listByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry),
            divisionBatch.sessionByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId),
            divisionBatch.listByProgramIdCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                workload: result[0].recordset,
                sessionList:  result[1].recordset,
                workloadLength: result[2].recordset[0]['']    
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

    listBySessionId: (req, res) => {
        Promise.all([
            divisionBatch.listBySessionId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.showEntry),
            divisionBatch.listBySessionIdCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.showEntry)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                workload: result[0].recordset,
                workloadLength: result[1].recordset[0][''] 
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
