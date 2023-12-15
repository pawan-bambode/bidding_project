const courseworkload = require('../../../models/admin/courseworkload/courseworkload')
const isJsonString = require('../../../utils/util');
module.exports = {
    getCourseworkload : (req, res) => {
        Promise.all([courseworkload.getCourseList(res.locals.slug,res.locals.biddingId),courseworkload.getCount(res.locals.slug,res.locals.biddingId),courseworkload.getProgramList(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/courseworkload/index.ejs',{
             courseList:result[0].recordset,
             pageCount: result[1].recordset[0][''],
             programList:result[2].recordset
            });
        })     
    },
    delete :(req,res) =>{

     courseworkload.delete(req.body.id,res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
        
        res.status(200).json(JSON.parse(result.output.output_json));
     }).catch(error =>{
          console.log('values of error',error);
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
    update: (req, res) => {
        courseworkload.update(req.body.editCourse, req.body.biddingSessionId, res.locals.userId, res.locals.slug)
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
     Promise.all([courseworkload.search(res.locals.slug,res.locals.biddingId,req.body.searchLetter,res.locals.userId),courseworkload.getCountSearch(res.locals.slug,res.locals.biddingId,req.body.searchLetter,res.locals.userId)]).then(result => {
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
searchByLetter :(req,res) =>{
    
    courseworkload.searchByLetter(res.locals.slug,res.locals.biddingId,req.body.searchLetter,req.body.pageNo,req.body.showEntry).then(result =>{
        res.json({
            status:'200',
            message:'Result fetched',
            data:result.recordset,
            length:result.recordset.length
        })
    }).catch(error =>{
        throw error
    })
},
showEntryCouresList :(req,res) =>{
  Promise.all([courseworkload.showEntryCouresList(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo),courseworkload.getCounts(res.locals.slug,res.locals.biddingId)]).then(result =>{
        res.json({
            status:'200',
            message:'Result fetched',
            data:result[0].recordset,
            length:result[1].recordset[0]['']
        })
    }).catch(error =>{
        throw error
    })
},
deleteAll:(req,res) =>{
             courseworkload.deleteAll(res.locals.slug,res.locals.biddingId,res.locals.userId,req.body).then(result =>{
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
                })
},
filterByProgramId  :(req,res) =>{
 Promise.all([courseworkload.filterByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.showEntry),courseworkload.sessionByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.showEntry),courseworkload.getCountfilterByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.showEntry)]).then(result =>{

       res.json({
        status: "200",
        message: "Sucessfull",
        workload: result[0].recordset,
        sessionList :  result[1].recordset,
        workloadLength:result[2].recordset[0]['']    

       })
    }) .catch(error => {
        if (isJsonString.isJsonString(error.originalError.info.message)) {
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
filterBySessionId:(req,res) =>{
    Promise.all([courseworkload.filterBySessionId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.sessionId,req.body.showEntry),courseworkload.moduleBySessionId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.sessionId,req.body.showEntry),courseworkload.getCountFilterBySessionId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.sessionId)]).then(result =>{
          res.json({
           status: "200",
           message: "Sucessfull",
           workload: result[0].recordset,
           moduleList :  result[1].recordset,
           workloadLength:result[2].recordset[0][''] 
          })
       }) .catch(error => {
           if (isJsonString.isJsonString(error.originalError.info.message)) {
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
   filterByCourseId:(req,res) =>{
    Promise.all([courseworkload.filterByCourseId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.sessionId,req.body.courseId,req.body.showEntry),courseworkload.getCountFilterByCourseId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.sessionId,req.body.courseId)]).then(result =>{
          res.json({
           status: "200",
           message: "Sucessfull",
           workload: result[0].recordset,
           workloadLength:result[1].recordset[0][''] 
          })
       }) .catch(error => {
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
       })
   }
   
}
