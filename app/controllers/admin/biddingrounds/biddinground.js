const biddingRound = require('../../../models/admin/biddinground/biddinground')
const isJsonString = require('../../../utils/util')
module.exports = {
    getPage : (req,res) =>{
        Promise.all([biddingRound.getBiddingRounds(res.locals.slug,res.locals.biddingId),
                     biddingRound.getPredefineBiddingRounds(res.locals.slug,res.locals.biddingId),
                     biddingRound.getStudentsBiddingRounds(res.locals.slug,res.locals.biddingId),
                     biddingRound.getCouresBiddingRounds(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/biddingrounds/index.ejs',{
             biddingRoundList:result[0].recordset,
             pageCount:result[0].recordset.length,
             biddingPredefineRounds: result[1].recordset,
             biddingRoundsStudents : result[2].recordset,
             biddingRoundCourseList : result[3].recordset,
             active:'dashboard',
             breadcrumbs: req.breadcrumbs
            })
        })
    },
    create: (req, res) => {
        biddingRound.save(req.body.inputJSON,res.locals.slug, res.locals.userId,res.locals.biddingId)
            .then(result => {
                res.status(200).json(JSON.parse(result.output.output_json));
            })
            .catch(error => {
               console.log('values of error',error);
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
        biddingRound.delete(req.body.biddingRoundId, res.locals.slug, res.locals.userId,req.body.biddingSessionId)
            .then(result => {
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
            });
    },
    update: (req, res) => {
    
        biddingRound.update(req.body.inputJSON,res.locals.slug, res.locals.userId,res.locals.biddingId)
  
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

    search :(req,res) =>{  
        Promise.all([biddingRound.search(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry),biddingRound.getCountSearch(res.locals.slug, res.locals.biddingId, req.body.searchLetter, req.body.pageNo, req.body.showEntry)]).then(result => {
               res.json({
                   status: "200",
                   message: "Result fetched",
                   data: result[0].recordset,
                   length: result[1].recordset[0]['']    
               })
           }).catch(error => {
               throw error
           })
   },
}