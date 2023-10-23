const biddingSession = require('../../../models/admin/biddingsession/biddingsession')
const isJsonString = require('../../../utils/util')

module.exports = {
    getBiddingSessionPage :(req , res) => {
        console.log('values of res',res.locals.status);
        console.log('values of req',req.status);
        Promise.all([biddingSession.getAllBiddingSession(res.locals.slug,res.locals.status)]).then(result =>{
            res.render('admin/biddingsession/index.ejs',{
              biddingSessionList: result[0].recordset
            });
        })
      
    }
}  