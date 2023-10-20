const specialization = require('../../../models/admin/specialization/specialization');
const isJsonString =  require('../../../utils/util');

module.exports = {
    getPage : (req,res) =>{
       Promise.all([specialization.getAllSpecialization(req,res,res.locals.slug)]).then( result => {
            res.render('admin/specialization/index.ejs',{
               specializationList : result[0].recordset
            })
     })
    },
    add :(req,res) =>{
      specialization.add(req.body,res.locals.biddingId,res.locals.userId,res.locals.slug).then(result =>{
         res.status(200).json(JSON.parse(result.output.output_json));
      }).catch(error =>{
         if(isJsonString.isJsonString(error.originalError.info.message)){
             res.status(500).json(JSON.parse(error.originalError.info.message));
         }
         else{
            res.json({
               status:500,
               description:error.originalError.info.message,
               data:[]
            })
         }
      })
    },
    delete :(req,res) =>{
      specialization.delete(req.body.specializationId,res.locals.biddingId,res.locals.userId,res.locals.slug).then(result =>{
         res.status(200).json(JSON.parse(result.output.output_json));
      }).catch(error =>{
         if(isJsonString.isJsonString(error.originalError.info.message)){
            res.status(500).json(JSON.parse(error.originalError.info.message));
         }else{
            res.json({
               status:500,
               description:error.originalError.info.message,
               data:[]
            })
         }
      })
    },
    update :(req,res) =>{
      specialization.update(req.body,res.locals.biddingId,res.locals.userId,res.slug).then(result =>{
         res.status(200).json(JSON.parse(result.output.output_json));
      }).catch(error =>{
         if(isJsonString.isJsonString(error.originalError.info.message)){
            res.status(500).json(JSON.parse(error.originalError.info.message));
         }
         else{
            res.json({
               status:500,
               description:error.originalError.info.message,
               data:[]
            })
         }
      })
    }
}

