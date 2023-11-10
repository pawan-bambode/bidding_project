const { Result } = require('express-validator')
const acadSession = require('../../../models/admin/acadsession/acadsession')
module.exports  = {
   getAcadSessions : (req,res) =>{
    res.render('admin/acadsession/index.ejs')
   },
   getAcadSessionList : (req,res) =>{
     
    return  Promise.all([acadSession.getAllAcadSession(req,res)]).then(result => {
         console.log('values of result',result[0].recordset);
           returnValue = result[0].recordset
      })
    
   }
}