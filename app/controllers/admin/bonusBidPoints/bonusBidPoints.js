const bonusBidPoints = require('../../../models/admin/bonusBidPoints/bonusbidpoints');
const isJsonString = require('../../../utils/util');
module.exports = {
getPage: (req, res) => {
  
    Promise.all([bonusBidPoints.getBonusBidPointList(res.locals.slug, res.locals.biddingId)]).then(result =>{
        res.render('admin/bonusBidPoints/index', { 
            active:'dashboard',
            breadcrumbs: req.breadcrumbs,
            bonusBidPoints: result[0].recordset   
          })
    })
    },

      add: (req, res) => {
        bonusBidPoints.addBonusBidPoints(res.locals.slug, res.locals.userId, res.locals.biddingId ,req.body.InputJson)
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
    
    delete: (req, res) => {
        bonusBidPoints.delete(res.locals.slug, res.locals.userId, res.locals.biddingId ,req.body.Id)
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

    update: (req, res) => {
        bonusBidPoints.update(res.locals.slug, res.locals.userId, res.locals.biddingId ,req.body.inputJson)
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