const favouriteCourse = require('../../../models/student/favouriteCourse/favouriteCourse')
const divisionBatches = require('../../../models/admin/divisionBatches/divisionBatches')

module.exports = {

  getPage :(req , res) =>{
    let availableCourseUrl = req.route.path.split('/');
    let availableCourse = availableCourseUrl[availableCourseUrl.length-1]
    res.render('student/availablecourse/index', {
      active : availableCourse
    })
  },
}  