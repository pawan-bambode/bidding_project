const course = require('../../../models/admin/course/course');

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
}