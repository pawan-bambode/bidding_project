const academicYear = require('../../../models/academicyear');
module.exports = {
  getAcademicYear: (req, res) => {
    res.render('admin/academicYear/index.ejs');
  },
  save: (req, res) => {
    Promise.all([academicYear.save(req.body)]).then(result => {
      console.log(result[0].rowsAffected);
      res.json({
        status: "200",
        message: "success"
      })
    })
  }
}
