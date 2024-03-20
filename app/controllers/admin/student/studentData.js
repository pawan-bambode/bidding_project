const studentData = require('../../../models/admin/studentData/studentData');
const hash = require('../../../utils/hash');
const User = require('../../../models/User');
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        let sidebarActive = req.sidebarActive.split('/');
        
        Promise.all([
        studentData.getList(res.locals.slug, res.locals.biddingId),
        studentData.getCount(res.locals.slug, res.locals.biddingId),
        studentData.programList(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
        res.render('admin/studentData/index.ejs', {
            studentDataList: result[0].recordset,
            pageCount: result[1].recordset[0][''],
            programList: result[2].recordset,
            active: sidebarActive[2],
            breadcrumbs: req.breadcrumbs
        });
        });
    },

    checkOldPassword: async (req, res) => {
        let checkUserData = await User.getUserDetails(req.body.userName);
        let isVerified = await hash.verifyPassword(req.body.oldPass, checkUserData.recordset[0].password);
        res.status(200).json({
        verifiedStatus: isVerified ? true : false
        });
    },

    updatePassword: async (req, res) => {
        let userName = req.body.userName;
        let encryptPass = await hash.hashPassword(req.body.newPassword);
        studentData.updatePassword(userName, encryptPass).then(data => {
        if (data.rowsAffected.length > 0) {
            res.status(200).json({
            status: 'S'
            });
        } else {
            res.status(400).json({
            status: 'F'
            });
        }
        });
    },
 
    update:(req,res) =>{
        studentData.update(res.locals.slug,res.locals.biddingId,res.locals.userId,req.body).then(result =>{
        res.status(200).json(JSON.parse(result.output.output_json));

    }).catch(error => {
        if(isJsonString.isJsonString(error.originalError.info.message)){
            res.status(500).json(JSON.parse(error.originalError.info.message));
        }
        else{
            res.status(500).json({
            status:500,
            description:error.originalError.info.message,
            data:[]
            });
        }
    })
    },
    delete: (req, res) => {
    
        studentData.delete(req.body.studentDataId, res.locals.slug, res.locals.userId,res.locals.biddingId)
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
    deleteAll :(req, res) => {
        studentData.deleteAll(res.locals.slug, res.locals.userId,res.locals.biddingId, req.body)
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

    search: (req, res) => {
        Promise.all([
            studentData.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId, req.body.pageNo, req.body.showEntry),
            studentData.searchCount(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.programId)
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
    
    searchByletter: (req, res) => {
        Promise.all([
            studentData.searchByletter(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry),
            studentData.searchByletterCount(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo)
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
    
    showEntry: (req, res) => {
        Promise.all([
            studentData.showEntry(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.programId),
            studentData.showEntryCount(res.locals.slug, res.locals.biddingId, req.body.showEntry, req.body.programId)
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
    
    listByProgramId : (req, res) => {
        Promise.all([
            studentData.listByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry),
            studentData.studentIdByProgramId(res.locals.slug, res.locals.biddingId, req.body.programId),
            studentData.listByProgramIdCount(res.locals.slug, res.locals.biddingId, req.body.programId)
        ]).then(result => {
            res.json({
            stats: '200',
            message: 'Result Fetched',
            data: result[0].recordset,
            studentDataSapIdList: result[1].recordset,
            length: result[2].recordset[0]['']
            });
        });
    },
    
    listByStudentId: (req, res) => {
     Promise.all([
            studentData.listByStudentId(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.showEntry, req.body.studentSapId),
            studentData.listByStudentIdCount(res.locals.slug, res.locals.biddingId, req.body.programId, req.body.studentSapId)
        ]).then(result => {
            res.json({
            stats: '200',
            message: 'Result Fetched',
            data: result[0].recordset,
            length: result[1].recordset[0]['']
            });
        });
    }
}
  