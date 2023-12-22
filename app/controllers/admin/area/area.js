const biddingSession = require('../../../models/admin/areas/areas')
const isJsonString = require('../../../utils/util');

module.exports = {
    getPage : (req,res) =>{
        Promise.all([biddingSession.getAreaList(res.locals.slug,res.locals.biddingId),biddingSession.getCount(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/areas/index.ejs',{
             areaList:result[0].recordset,
             pageCount: result[1].recordset[0][''],
             active:'dashboard',
             breadcrumbs: req.breadcrumbs
            });
        })
    },
    refreshArea :(req,res) =>{
        biddingSession.refresh(res.locals.slug, res.locals.biddingId,res.locals.userId).then(result =>{
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
        showEntryAreaList :(req,res) =>{
            Promise.all([biddingSession.showEntryAreaList(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo),biddingSession.getCountsOfShowEntry(res.locals.slug,res.locals.biddingId)]).then(result =>{
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
          areaSearch :(req,res) =>{
            Promise.all([biddingSession.search(res.locals.slug,res.locals.biddingId,req.body.pageNo,req.body.searchLetter,req.body.showEntry),biddingSession.getCountOfSearch(res.locals.slug,res.locals.biddingId,req.body.pageNo,req.body.searchLetter)]).then(result => {
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