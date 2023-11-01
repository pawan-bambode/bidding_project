const program = require('../../../../models/admin/programs/program');
const isJsonString = require('../../../../utils/util')

module.exports = {
    getPage: (req, res) => {
        Promise.all([program.getAllProgram(req, res,res.locals.slug,res.locals.biddingId),program.getCount(res.locals.slug,res.locals.biddingId), program.getAllProgramFromDbo(req, res, res.locals.slug,res.locals.biddingId)])
            .then(result => {
                res.render('admin/programs/program/index.ejs', {
                    programList: result[0].recordset,
                    pageCount: result[1].recordset[0][''],
                    programListFromDbo: result[2].recordset
                });
            });
    },
    create: (req, res) => {
        let object = {
            import_programs: JSON.parse(req.body.inputJSON)
        };
        program.save(object,res.locals.slug, res.locals.userId,req.body.biddingSessionId)
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
        program.update(req.body,res.locals.slug, res.locals.userId,req.body.bidding_session_lid)
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

        req.body.program_id == 'undefined'?NULL:req.body.program_id;
        program.delete(req.body.program_id, res.locals.slug, res.locals.userId,req.body.biddingSessionId)
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
    programSearch :(req,res) =>{
     Promise.all([program.search(res.locals.slug,res.locals.biddingId,req.body.pageNo,res.locals.userId,req.body.searchLetter,req.body.showEntry),program.getCountOfSearch(res.locals.slug,res.locals.biddingId,req.body.pageNo,res.locals.userId,req.body.searchLetter)]).then(result => {
        res.json({
            status:'200',
            message:'Result fetched',
            data:result[0].recordset,
            length:result[1].recordset[0]['']
            
        });
      }).catch(error => {
        console.log('values of error',error);
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

  showEntryProgramList :(req,res) =>{
   Promise.all([program.showEntryProgramList(res.locals.slug,res.locals.biddingId,req.body.showEntry),program.getCounts(res.locals.slug,res.locals.biddingId,req.body.showEntry)]).then(result =>{
   
    res.json({
           status:'200',
           message:'Result fetched',
           data:result[0].recordset,
           length:result[1].recordset[0]['']
           
       })
   }).catch(error =>{
       throw error
   })
  }
};