const courseworkload = require('../../../models/admin/courseworkload/courseworkload')
const isJsonString = require('../../../utils/util');
module.exports = {
    getCourseworkload : (req, res) => {
        Promise.all([courseworkload.getCourseList(res.locals.slug,res.locals.biddingId),courseworkload.getCount(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/courseworkload/index.ejs',{
             courseList:result[0].recordset,
             pageCount: result[1].recordset[0]['']
            });
        })     
    },
    delete :(req,res) =>{

     courseworkload.delete(req.body.id,res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
        
        res.status(200).json(JSON.parse(result.output.output_json));
     }).catch(error =>{
      
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
    update :(req,res) =>{
        courseworkload.update(req.body.editCourse,req.body.biddingSessionId,res.locals.userId,res.locals.slug).then(result=>{
            res.status(200).json(JSON.parse(result.output.output_json));
        }).catch(error =>{
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
    search :(req,res) =>{
       
        courseworkload.search(res.locals.slug,res.locals.biddingId,req.body.pageNo,res.locals.userId).then(result => {
            res.json({
                status: "200",
                message: "Result fetched",
                data: result.recordset,
                length: result.recordset.length
            })
        }).catch(error => {
            throw error
        })
}
}