const confirmation = require('../../../models/student/confirmation/confirmation')
module.exports = {

    getPage :(req ,res) => {
        let confirmationUrl = req.route.path.split('/');
        let confirmation = confirmationUrl[confirmationUrl.length-1]

      Promise.all([confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId)]).then(result =>{
        
        res.render('student/confirmation/index',{
          active : confirmation,
          winningCourseList: result[0].recordset
        })  
      })
      
    },

    saveConfirmCourse : (req, res) =>{

      confirmation.saveConfirmCourse(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.addFavCourse)
        .then(result => {
            res.status(200).json(JSON.parse(result.output.output_json));
        })
        .catch(error => {
           console.log('values of error ', error);
            if (isJsonString.isJsonString(error.originalError.info.message)) {
                res.status(500).json(JSON.parse(error.originalError.info.message));
            } else {
                res.status(500).json({
                    status: 500,
                    description: error.originalError.info.message,
                    data: []
                });
            }
        });
    }
}