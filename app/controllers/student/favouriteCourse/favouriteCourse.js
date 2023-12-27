const favouriteCourse = require('../../../models/student/favouriteCourse/favouriteCourse')
const divisionBatches = require('../../../models/admin/divisionBatches/divisionBatches')

module.exports = {
    getPage : (req ,res) => {
      let demandEstimationUrl = req.route.path.split('/');
      let demandEstimationActive = demandEstimationUrl[demandEstimationUrl.length - 1]
      Promise.all([
                  ]).then(result =>{
                    
        res.render('student/demandEstimation/index',{
          active:demandEstimationActive,
         

        });
      })
   }
}  