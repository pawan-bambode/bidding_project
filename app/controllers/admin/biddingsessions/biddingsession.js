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
      
    },
    create:(req ,res) =>{
        biddingSession.save(req.body.inputJSON, 'sbm_mum', res.locals.userId)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
                console.log('values of error', error);
                if (isJsonString.isJsonString(error.originalError.info.message)) {
                    console.log('inside the if block');
                    res.status(500).json(JSON.parse(error.originalError.info.message));
                } else {
                    res.status(500).json({
                        status: 500,
                        description: error.originalError.info.message,
                        data: []
                    });
                }
            });
    },
    delete:(req,res) =>{
        biddingSession.delete(req.body.id,'sbm_mum',res.locals.userId).then(result => {
            res.status(200).json(JSON.parse(result.output.output_json));
        })
        .catch(error => {
            if ((isJsonString.isJsonString(error.originalError.info.message))) {
                res.status(500).json(JSON.parse(error.originalError.info.message));
            } else {
                res.status(500).json({
                    status: 500,
                    description: error.originalError.info.message,
                    data: []
                });
            }
        })
    },

    update : (req,res) => {
        
        biddingSession.update(req.body.updateBiddingSession,req.body.id,'sbm_mum',res.locals.userId).then(result =>{
            res.status(200).json(JSON.parse(result.output.output_json));
        }).catch(error =>{
            if(isJsonString.isJsonString(error.originalError.info.message)){
                res.status(500).json(JSON.parse(error.originalError.info.message));
            }
            else{
                res.status(500).json({
                    status:500,description:error.originalError.info.message,
                    data:[]
                });
            }
        })
    },
    getBiddingSessionList: (req, res) => {
        slug = 'sbm-mum';
        biddingSession.getBiddingSessionList(slug)
            .then(result => {
                res.json({
                    status: 200,
                    data: result.recordset
                });
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    description: error.originalError.info.message,
                    data: []
                });
            });
    },
    updateBiddingSession: (req, res) => {
        slug = 'sbm-mum';
        biddingSession.updateBiddingSession('sbm_mum', JSON.stringify(req.body))
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