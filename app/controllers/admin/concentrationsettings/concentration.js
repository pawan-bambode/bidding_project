const concentrationSettings = require('../../../models/admin/concentrationsettings/concentrationsettings')
const Areas = require('../../../models/admin/areas/areas')
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage : (req,res) =>{
        Promise.all([concentrationSettings.getConcentrationSettingsList(res.locals.slug,res.locals.biddingId),concentrationSettings.getCount(res.locals.slug,res.locals.biddingId),Areas.getAreaList(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/concentrationsettings/index.ejs',{
                concentrationSettingList : result[0].recordset,
                pageCount: result[1].recordset[0][''],
                areaList:result[2].recordset,
            })
        })
    },
    refresh:(req,res) =>{
        concentrationSettings.refresh(res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
            res.status(200).json(JSON.parse(result.output.output_json))
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
    delete: (req, res) => {
        concentrationSettings.delete(req.body.id,res.locals.slug, res.locals.userId,res.locals.biddingId)
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
    update :(req,res) => {
       concentrationSettings.update(req.body.editConcentrationsettings,res.locals.slug,res.locals.userId,res.locals.biddingId).then(result =>{
        res.status(200).json(JSON.parse(result.output.output_json));
       }).catch(error =>{
      
        if(isJsonString.isJsonString(error.originalError.info.message)){
            res.status(500).json(JSON.parse(error.originalError.info.message));
        }else{
            res.status(500).json({
                statut:500,
                description:error.originalError.info.message,
                data:[]
            });
        }
       })
    },
    showEntryConcentrationSettingList :(req,res) =>{
        Promise.all([concentrationSettings.showEntryConcentrationSettingList(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo),concentrationSettings.getCountsOfShowEntry(res.locals.slug,res.locals.biddingId)]).then(result =>{
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
      concentrationSettingsSearch :(req,res) =>{
        Promise.all([concentrationSettings.concentrationSettingsSearch(res.locals.slug,res.locals.biddingId,req.body.pageNo,req.body.searchLetter,req.body.showEntry),concentrationSettings.getCountOfSearch(res.locals.slug,res.locals.biddingId,req.body.pageNo,req.body.searchLetter)]).then(result => {
            console.log('values of result',result[0]);
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
   }
}
