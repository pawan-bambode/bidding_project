const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const isJsonString = require('../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');

module.exports = {
    getDivisionBatches: (req, res) => {
        Promise.all([
            divisionBatch.getDivisionBatches(res.locals.slug, res.locals.biddingId),
            divisionBatch.getCountOfDivisionBatches(res.locals.slug, res.locals.biddingId),
            divisionBatch.getProgramList(res.locals.slug, res.locals.biddingId)
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

    uploadDivisionBatches: (req, res) => {
        let excelFileBufferData = req.file.buffer;
        let biddingId = res.locals.biddingId;
        let excelFileDataWorkbook = xlsx.read(excelFileBufferData);
        const sheetName = excelFileDataWorkbook.SheetNames[0];
        const sheet = excelFileDataWorkbook.Sheets[sheetName];
        const courseJsonData = xlsx.utils.sheet_to_json(sheet);
        
        const divisionBatchesWithColumnHypen = courseJsonData.map(item => {
            let defaultValue = null;
            return {
                course_id: item.courseId == undefined ? defaultValue : item.courseId,
                division: item.division == undefined ? defaultValue : item.division,
                batch: item.batch == undefined ? defaultValue : item.batch,
                max_seats: item.maxSeats == undefined ? defaultValue : item.maxSeats
            };
        });
        
        let divisionBatches = { division_batches: divisionBatchesWithColumnHypen };
        
        divisionBatch.uploadDivisionBatches(res.locals.slug, divisionBatches, res.locals.userId, biddingId)
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

    sampleForDivisionBatches: (req, res) => {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
    
        worksheet.column(1).setWidth(15);
        worksheet.column(2).setWidth(10);
        worksheet.column(3).setWidth(10);
        worksheet.column(4).setWidth(10);
        
        worksheet.cell(1, 1).string('courseId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 2).string('division').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 3).string('batch').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 4).string('maxSeats').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
      
        const filePath = __dirname + '/sampleForImportDivisionBatches.xlsx';
        
        workbook.write(filePath, (err, stats) => {
            if (err) {
                return res.status(500).send('Error generating Excel file');
            }
            res.sendFile(filePath, (err) => {
                if (err) {
                    return res.status(500).send('Error sending Excel file');
                }
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
            divisionBatch.getCountSearch(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId, req.body.acadSessionId)
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

    showEntryDivisionBatchesList: (req, res) => {
        Promise.all([
            divisionBatch.showEntryDivisionBatchesList(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),
            divisionBatch.getCounts(res.locals.slug, res.locals.biddingId)
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

    filterByProgramId: (req, res) => {
        Promise.all([
            divisionBatch.filterByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry),
            divisionBatch.sessionByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId),
            divisionBatch.getCountfilterByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry)
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

    filterBySessionId: (req, res) => {
        Promise.all([
            divisionBatch.filterBySessionId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.showEntry),
            divisionBatch.getCountFilterBySessionId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.showEntry)
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
