const academicYear = require('../../../models/academicyear');
module.exports = {
  getAcademicYear: (req, res) => {
    Promise.all([academicYear.getAllAcademicYear()]).then(result =>{
    res.render('admin/academicYear/index.ejs',{
      academicYearList:result[0].recordset
    })
  })
},
  save: (req, res) => {
    Promise.all([academicYear.save(req.body)]).then(result => {
      res.json({
        status: "200",
        message: "success"
      })
    })
  }
}
