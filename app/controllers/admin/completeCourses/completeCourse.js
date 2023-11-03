const completeCourses = require('../../../models/admin/completeCourses/completecourses');
const isJsonString = require('../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');

module.exports = {

    getCompleteCourses: (req,res) => {
        Promise.all([completeCourses.getCompleteCourseList(res.locals.slug,res.locals.biddingId,req.body.showEntry),completeCourses.getCount(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/completeCourses/index.ejs',{
            completeCouseList : result[0].recordset,
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
         worksheet.column(4).setWidth(30);

         worksheet.cell(1, 1).string('studentSapId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 2).string('trimester').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 3).string('courseId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
         worksheet.cell(1, 4).string('courseName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
              
         const filePath = __dirname + '/sampleForImportCompleteCourses.xlsx';

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
            const completeCoursesJsonData = xlsx.utils.sheet_to_json(sheet);
            const completeCoursesWithColumnHypen = completeCoursesJsonData.map(item =>{
                            return {
                              sap_id: item.studentSapId,
                              acad_session: item.trimester.replace(/\s+/g,' ').trim(),
                              course_id: item.courseId,
                              course_name: item.courseName.replace(/\s+/g,' ').trim()
                            };
                          })
            let completeCourseDataValue = {completed_courses: completeCoursesWithColumnHypen}
            
            completeCourses.uploadCompleteCoursesData(res.locals.slug,completeCourseDataValue,res.locals.userId,biddingId).then(result =>{
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
          deleteAll:(req,res) =>{
            completeCourses.deleteAll(res.locals.slug,res.locals.biddingId,res.locals.userId,req.body).then(result =>{
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
        }      
          