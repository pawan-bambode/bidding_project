const biddingSession = require('../../../models/admin/biddingsession/biddingsession')
const isJsonString = require('../../../utils/util')

module.exports = {
    getBiddingSessionPage :(req , res) => {
        Promise.all([biddingSession.getAllBiddingSession(res.locals.slug,res.locals.status),biddingSession.getAcadSessionList(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/biddingsession/index.ejs',{
              biddingSessionList: result[0].recordset,
              acadSessionList:result[1].recordset
            });
        })
      
    },
    create:(req ,res) =>{
        biddingSession.save(req.body.inputJSON,res.locals.slug, res.locals.userId)
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
    },
    delete:(req,res) =>{
        biddingSession.delete(req.body.id,res.locals.slug,res.locals.userId).then(result => {
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
        
        biddingSession.update(req.body.updateBiddingSession,req.body.id,res.locals.slug,res.locals.userId).then(result =>{
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
        biddingSession.getBiddingSessionList(res.locals.slug)
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
        biddingSession.updateBiddingSession(res.locals.slug, JSON.stringify(req.body),res.locals.userId)
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