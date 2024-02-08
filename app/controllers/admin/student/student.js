const StudentData = require('../../../models/Students');
const hash = require('../../../utils/hash');
const User = require('../../../models/User');

module.exports = {
    
    getPage: (req, res) => {
        Promise.all([
        StudentData.getList(res.locals.slug, res.locals.biddingId),
        StudentData.getCount(res.locals.slug, res.locals.biddingId),
        StudentData.programList(res.locals.slug, res.locals.biddingId)
        ]).then(result => {
        res.render('admin/studentData/index.ejs', {
            studentDataList: result[0].recordset,
            pageCount: result[1].recordset[0][''],
            programList: result[2].recordset,
            active: 'dashboard',
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
        Students.updatePassword(userName, encryptPass).then(data => {
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
    }
};
