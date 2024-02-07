const course = require('../../../models/admin/course/course');
const isJsonString = require('../../../utils/util');

module.exports = {
    getCourse: (req, res) => {
        Promise.all([
            course.getCourseList(res.locals.slug, res.locals.biddingId),
            course.getCount(res.locals.slug, res.locals.biddingId),
            course.getProgramList(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
            res.render('admin/course/index.ejs', {
                courseList: result[0].recordset,
                pageCount: result[1].recordset[0][''],
                programList: result[2].recordset,
                active: 'dashboard',
                breadcrumbs: req.breadcrumbs
            });
        });
    },

    delete: (req, res) => {
        course.delete(req.body.id, res.locals.slug, res.locals.biddingId, res.locals.userId).then(result => {
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

    update: (req, res) => {
        course.update(req.body.editCourse, req.body.biddingSessionId, res.locals.userId, res.locals.slug)
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
            course.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId, req.body.acadSessionId, req.body.showEntry),
            course.getCountSearch(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId, req.body.acadSessionId)
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

    searchByLetter: (req, res) => {
        course.searchByLetter(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                data: result.recordset,
                length: result.recordset.length
            });
        }).catch(error => {
            throw error;
        });
    },

    showEntryCouresList: (req, res) => {
        Promise.all([
            course.showEntryCouresList(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.pageNo),         
            course.getCounts(res.locals.slug, res.locals.biddingId)
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

    deleteAll: (req, res) => {
        course.deleteAll(res.locals.slug, res.locals.biddingId, res.locals.userId, req.body).then(result => {
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

    filterByProgramId: (req, res) => {
        Promise.all([
            course.filterByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry), 
            course.sessionByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry),
            course.getCountfilterByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                workload: result[0].recordset,
                sessionList: result[1].recordset,
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
            course.filterBySessionId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.showEntry),
            course.moduleBySessionId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.showEntry),
            course.getCountFilterBySessionId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId)
        ]).then(result => {
            res.json({
                status: "200",
                message: "Sucessfull",
                workload: result[0].recordset,
                moduleList: result[1].recordset,
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

    filterByCourseId: (req, res) => {
        Promise.all([
            course.filterByCourseId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.courseId, req.body.showEntry),
            course.getCountFilterByCourseId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.sessionId, req.body.courseId)
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
