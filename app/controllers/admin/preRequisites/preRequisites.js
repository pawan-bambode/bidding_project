const preRequisites = require('../../../models/admin/preRequisite/prerequisite');
const isJsonString = require('../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');

module.exports = {

  getPreRequities: (req,res) => {
        Promise.all([preRequisites.getPreRequities(res.locals.slug,res.locals.biddingId,req.body.showEntry),preRequisites.getCount(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/preRequisites/index.ejs',{
            preRequitiesList : result[0].recordset,
            pageCount:result[1].recordset[0]['']
            })
        })
        },
        generateExcel: (req, res) => {
         const workbook = new excel.Workbook();
         const worksheet = workbook.addWorksheet('Sheet1');
        
         worksheet.column(1).setWidth(15);
         worksheet.column(2).setWidth(15);
         worksheet.column(3).setWidth(15);
         worksheet.column(4).setWidth(15);
         worksheet.column(5).setWidth(30);
         worksheet.column(6).setWidth(30);

         worksheet.cell(1, 1).string('acadSession').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 2).string('courseId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 3).string('courseName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 4).string('type').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 5).string('preRequisitesCourseId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 6).string('preRequisitesCourseName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
              
         const filePath = __dirname + '/sampleForImportPreRequisites.xlsx';

            workbook.write(filePath, (err, stats) => {
              if (err) {
                return res.status(500).send('Error generating Excel file');
              }
              res.sendFile(filePath, (err) => {
                if (err) {
                  return res.status(500).send('Error sending Excel file');
                }
              });
            });
          },

          readExcelFile :(req,res) =>{
            let excelFileBufferData = req.file.buffer;
            let biddingId = res.locals.biddingId;
            let excelFileDataWorkbook = xlsx.read(excelFileBufferData);
            const sheetName = excelFileDataWorkbook.SheetNames[0];
            const sheet = excelFileDataWorkbook.Sheets[sheetName];
            const preRequisitesJsonData = xlsx.utils.sheet_to_json(sheet);
          
            const preRequisitesWithColumnHypen = preRequisitesJsonData.map(item =>{
                            return {
                              acad_session: item.acadSession.replace(/\s+/g,' ').trim(),
                              course_id: item.courseId,
                              course_name: item.courseName.replace(/\s+/g,' ').trim(),
                              type: item.type.replace(/\s+/g,' ').trim(),
                              pre_req_course_id: item.preRequisitesCourseId,
                              pre_req_course_name: item.preRequisitesCourseName.replace(/\s+/g,' ').trim()
                            };
                          })
            let preRequisitesDataValue = {pre_requisites: preRequisitesWithColumnHypen}
            
            preRequisites.uploadPreRequisites(res.locals.slug,preRequisitesDataValue,res.locals.userId,biddingId).then(result =>{
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
                })
               }
           })   
          },
          delete :(req,res) =>{
            preRequisites.delete(req.body.id,res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
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
            preRequisites.update(req.body.editPreRequisites, req.body.biddingSessionId, res.locals.userId, res.locals.slug)
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
        showEntryList :(req,res) =>{
          Promise.all([preRequisites.showEntryList(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo),preRequisites.getCounts(res.locals.slug,res.locals.biddingId)]).then(result =>{
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
        search :(req,res) =>{  
          Promise.all([preRequisites.search(res.locals.slug,res.locals.biddingId,req.body.searchLetter),preRequisites.getCountSearch(res.locals.slug,res.locals.biddingId,req.body.searchLetter)]).then(result => {
          
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
          