const completedCourses = require('../../../models/admin/completedCourses/completedCourses');
const isJsonString = require('../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');
const path = require('path');

module.exports = {
    
    getList: (req, res) => {
        Promise.all([
            completedCourses.getList(res.locals.slug, res.locals.biddingId, req.body.showEntry),
            completedCourses.getCount(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/completedCourses/index.ejs', {
                completeCouseList: result[0].recordset,
                pageCount: result[1].recordset[0][''],
                active: 'dashboard',
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    deleteAll: (req, res) => {
        completedCourses.deleteAll(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body)
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

    showEntry: (req, res) => {
        Promise.all([
            completedCourses.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),
            completedCourses.showEntryCount(res.locals.slug, res.locals.biddingId)
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
            completedCourses.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry),
            completedCourses.searchCount(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry)
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

    download: (req, res) => {
        const filePath = path.join(__dirname, '../../../../excelFile/sampleForImportCompletedCourses.xlsx');
        res.download(filePath);
    }
};
