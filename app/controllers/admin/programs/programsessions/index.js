const e = require('express');
const ProgramSession = require('../../../../models/admin/programs/programsession');
const programSession = require('../../../../models/admin/programs/programsession');
const isJsonString = require('../../../../utils/util');

module.exports = {
    getPage: (req, res) => {
        Promise.all([programSession.getAllProgramSessions(req, res,res.locals.slug,res.locals.biddingId),programSession.getCount(res.locals.slug,res.locals.biddingId)])
            .then(result => {
                res.render('admin/programs/programsession/index.ejs', {
                    programSessionList: result[0].recordset,
                    pageCount: result[1].recordset[0][''],
                });
            });
    },
    refresh :(req,res) =>{
         ProgramSession.refresh(res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
            res.status(200).json(JSON.parse(result.output.output_json));
        
         }).catch(error => {
            if(isJsonString.isJsonString(error.originalError.info.message)){
                res.status(500).json(JSON.parse(error.originalError.info.message));
            }
            else{
                res.status(500).json({
                   status:500,
                   description:error.originalError.info.message,
                   data:[]
                });
            }
         })
    },
    update:(req,res) =>{
        programSession.update(req.body,res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
            res.status(200).json(JSON.parse(result.output.output_json));
        }).catch(error => {
           if(isJsonString.isJsonString(error.originalError.info.message)){
               res.status(500).json(JSON.parse(error.originalError.info.message));
           }
           else{
               res.status(500).json({
                  status:500,
                  description:error.originalError.info.message,
                  data:[]
               })
            }
        });
    },

    search :(req,res) =>{
       Promise.all([ programSession.search(req.body.pageNo,req.body.searchLetter,req.body.showEntry,res.locals.slug,res.locals.biddingId,res.locals.userId),programSession.getCounts(req.body.pageNo,req.body.searchLetter,res.locals.slug,res.locals.biddingId,res.locals.userId)]).then(result =>{
            res.json({
            status:'200',
            programSessionList:result[0].recordset,
            message:'Result Data is Fetch',
            length:result[1].recordset[0]['']
           })
        }).catch(error => {
           if(isJsonString.isJsonString(error.originalError.info.message)){
               res.status(500).json(JSON.parse(error.originalError.info.message));
           }
           else{
               res.status(500).json({
                  status:500,
                  description:error.originalError.info.message,
                  data:[]
               })
            }
        });
    },
    showEntryProgramSessionList :(req,res) =>{
        programSession.showEntryProgramSessionList(req.body.showEntry,res.locals.slug,res.locals.biddingId).then(result =>{
            
             res.json({
             status:'200',
             programSessionList:result.recordset,
             message:'Result Data is Fetch'
            })
         }).catch(error => {
            if(isJsonString.isJsonString(error.originalError.info.message)){
                res.status(500).json(JSON.parse(error.originalError.info.message));
            }
            else{
                res.status(500).json({
                   status:500,
                   description:error.originalError.info.message,
                   data:[]
                })
             }
         });
     }
}
    