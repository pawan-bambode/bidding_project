const biddingSession = require('../../../models/admin/biddingsession/biddingsession')
const isJsonString = require('../../../utils/util')

module.exports = {
    getBiddingSessionPage :(req , res) => {
        Promise.all([biddingSession.getAllBiddingSession(res.locals.slug,res.locals.status)]).then(result =>{
            res.render('admin/biddingsession/index.ejs',{
              biddingSessionList: result[0].recordset
            });
        })
      
    }
}  