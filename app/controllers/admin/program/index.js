const program = require('../../../models/admin/program')
module.exports ={
getPage : (req,res) =>{
    Promise.all([program.getAllProgram(req,res)]).then(result =>{
        res.render('admin/program/index.ejs',{
        programList:result[0].recordset,
        })
    }) 
}
}