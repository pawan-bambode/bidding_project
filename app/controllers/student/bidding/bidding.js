const course = require('../../../models/admin/course/course');
const divisionBatch = require('../../../models/admin/divisionBatches/divisionBatches');

module.exports = {

    getPage : (req , res) => {
        let biddingUrl = req.route.path.split('/');
        let bidding = biddingUrl[biddingUrl.length - 1]

        Promise.all([course.getDropdownAcadSessionList(res.locals.slug, res.locals.biddingId)]).then(result => {
            res.render('student/bidding/index',{
                active :bidding,
                 dropdownAcadSessionList: result[0].recordset,
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