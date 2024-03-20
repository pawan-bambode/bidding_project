const manual = require('../../../models/admin/manual/manual');
const addDropClass = require('../../../models/student/addDrop/addDrop');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        
        let sidebarActive = req.sidebarActive.split('/');
        let roundId = 9;
        Promise.all([
            manual.getRound(res.locals.slug, res.locals.biddingId, roundId),
            manual.getList(res.locals.slug, res.locals.biddingId, roundId),
            manual.students(res.locals.slug, res.locals.biddingId, roundId),
        ]).then(result => {
            res.render('admin/manual/index.ejs', {
                active: sidebarActive[2],
                breadcrumbs: req.breadcrumbs,
                isRoundCreated: result[0].recordset !== undefined ? result[0].recordset: '',
                courses: result[1].recordset !== undefined ? result[1].recordset : '',
                students: result[2].recordset !== undefined ? result[2].recordset : ''
            });
        });
    },

    courses: (req, res) => {
        Promise.all([
            manual.courses(res.locals.slug, res.locals.biddingId, req.body.studentId, req.body.roundId, req.body.id)
        ]).then(result => {
            res.json({
                status: '200',
                message: 'Result fetched',
                courses: result[0].recordset
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

    add: (req, res) => {
        let addDropId = req.body.addDrop;
        let studentId = req.body.studentId;
        let roundId = req.body.roundId;
        let courseId = req.body.courseId;
        let divisionId = req.body.divBatchId;
        let concentrationId = req.body.concentrationId;
        let bidPoints = req.body.bidPoints;
    
        if (addDropId === '1') {
          
            addDropClass.addDrop(res.locals.slug, studentId, roundId, courseId, concentrationId, divisionId, bidPoints, res.locals.userId, res.locals.biddingId).then(result => {
                res.json({
                    addWaitListResponse: result.output.output_json
                });
            }).catch(error => {
                res.json({
                    addWaitListResponse: error.originalError.info.message
                });
            });
        } else {
           
                let id = req.body.id;
                
                addDropClass.drop(res.locals.slug, res.locals.biddingId, id, studentId, divisionId, roundId, res.locals.userId).then(result => {
                    res.json({
                        status: 200,
                        addWaitListResponse: result.output.output_json
                    });
                }).catch(error => {
                    res.json({
                        error: error.originalError.info.message
                    });
                });
        }
    }
}