const courseworkload = require('../../../models/admin/courseworkload/courseworkload')
const isJsonString = require('../../../utils/util');
module.exports = {
    getCourseworkload : (req, res) => {
        Promise.all([courseworkload.getCourseList(res.locals.slug)]).then(result =>{
            res.render('admin/courseworkload/index.ejs',{
             courseList:result[0].recordset
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
    }
}