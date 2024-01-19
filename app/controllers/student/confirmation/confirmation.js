const confirmation = require('../../../models/student/confirmation/confirmation');
const isJsonString = require('../../../utils/util');
module.exports = {

    getPage :(req ,res) => {
        let confirmationUrl = req.route.path.split('/');
        let confirmationActive = confirmationUrl[confirmationUrl.length-1]
    
      Promise.all([confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId, 2)]).then(result =>{
        
        res.render('student/confirmation/index',{
          active : confirmationActive,
          winningCourseList: result[0].recordset
        })  
      })
      
    },
    
    getPageRoundWise: (req, res) => {
      let previusBiddingRound;
    
      if (req.url == '/confirmation/rounds-first') {
        previusBiddingRound = 'BIDDING_ROUND1';
      } else if (req.url == '/confirmation/rounds-second') {
        previusBiddingRound = 'BIDDING_ROUND2';
      }
    
      confirmation.getRoundId(res.locals.slug, res.locals.biddingId, previusBiddingRound)
        .then(roundId => {
          if (roundId.recordset[0] && roundId.recordset[0].roundId !== '') {
            return confirmation.winningCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId, roundId.recordset[0].roundId);
          } 
        })
        .then(confirmCourseList => {
          Promise.all([confirmation.getConfirmCourseList(res.locals.slug, res.locals.biddingId, res.locals.studentId)]).then(result =>{
            console.log('values of result[0].recordset[0]', result[0].recordset);
            res.render('student/confirmation/confirmationRoundWise/index', {
              active: 'confirmation',
              winningCourseList: confirmCourseList.recordset,
              confirmCourseList: result[0].recordset,
              roundId: confirmCourseList.recordset[0] != undefined ?  confirmCourseList.recordset[0].round_lid :0
            });
          })
         
        })
        .catch(error => {
          console.log('values of error', error);
          res.status(500).json(JSON.parse(error.originalError.info.message));
        });
    },
    
    addConfirmCourse : (req, res) =>{
      
      confirmation.addConfirmCourse(res.locals.slug, res.locals.userId, res.locals.biddingId, req.body.inputJson)
        .then(result => {
            res.status(200).json(JSON.parse(result.output.output_json));
        })
        .catch(error => {
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