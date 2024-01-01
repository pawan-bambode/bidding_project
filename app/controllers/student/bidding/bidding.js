const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');
const programSession = require('../../../models/admin/programs/programsession');
const roundSetting = require('../../../models/admin/roundSettings/roundSettings');

module.exports = {

    getPage : (req , res) => {
        let biddingUrl = req.route.path.split('/');
        let bidding = biddingUrl[biddingUrl.length - 1]

        Promise.all([course.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId),
                     programSession.getCredits(res.locals.slug, res.locals.biddingId),
                     roundSetting.getStartEndTime(res.locals.slug, res.locals.biddingId,2)]).then(result => {
                res.render('student/bidding/index',{
                    active :bidding,
                    dropdownAcadSessionList: result[0].recordset,
                    creditList: result[1].recordset,
                    startAndEndTime: result[2].recordset[0]  
            });
        })
   
    },  

    getCourseByAcadSession : (req, res) =>{
      Promise.all([divisionBatch.getBiddingCourseByAcadSession(res.locals.slug, res.locals.biddingId, req.body.acadSessionId)]).then(result =>{
        res.json({
            status:'200',
            message:'Result fetched',
            biddingCourseList:result[0].recordset
        })
        })
    }
}