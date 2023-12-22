const completeCourses = require('../../../models/admin/completeCourses/completecourses');
const isJsonString = require('../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');
const path = require('path');
const acadSession = require('../../../controllers/admin/acadsession/acadsession')

module.exports = {

    getCompleteCourses: (req,res) => {
        Promise.all([completeCourses.getCompleteCourseList(res.locals.slug,res.locals.biddingId,req.body.showEntry),completeCourses.getCount(res.locals.slug,res.locals.biddingId)]).then(result =>{
            res.render('admin/completeCourses/index.ejs',{
            completeCouseList : result[0].recordset,
            pageCount:result[1].recordset[0][''],
            active:'dashboard',
            breadcrumbs: req.breadcrumbs
            })
        })
        },
        generateExcel:  (req, res) => {
     
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet1');
const acadsessionList =  acadSession.getAcadSessionList(req,res);
// console.log('values of acadSession ON RETURN VALUES',acadsessionList);
// const dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];

// worksheet.addDataValidation({
//   type: 'list',
//   allowBlank: true,
//   sqref: 'B2', 
//   formulas: [dropdownOptions.join(',')]
// });

worksheet.column(1).setWidth(15); 
worksheet.column(2).setWidth(20); 
worksheet.column(3).setWidth(20);
worksheet.column(4).setWidth(40);

const headerStyle = workbook.createStyle({
  font: {
    bold: true
  }
});

worksheet.cell(1, 1).string('studentSapId').style(headerStyle);
worksheet.cell(1, 2).string('acadSession').style(headerStyle);
worksheet.cell(1, 3).string('courseId').style(headerStyle);
worksheet.cell(1, 4).string('courseName').style(headerStyle);

  // worksheet.cell(i, 2).string('').style({ dataValidation: { showDropDown: true } });
  
//workbook.write(path.join(__dirname, '../../../../excelFile/'+'sampleForImportCompleteCourses.xlsx'))
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Excel file with dropdown created successfully');
//   }
// });
        
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
                              acad_session: item.acadSession.replace(/\s+/g,' ').trim(),
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

          showEntry :(req,res) =>{
            Promise.all([completeCourses.showEntry(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo),
              completeCourses.getCounts(res.locals.slug,res.locals.biddingId)]).then(result =>{
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
            Promise.all([completeCourses.search(res.locals.slug,res.locals.biddingId,req.body.searchLetter,res.locals.userId),completeCourses.getCountSearch(res.locals.slug,res.locals.biddingId,req.body.searchLetter,res.locals.userId)]).then(result => {
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
       download: (req,res) =>{      
        const filePath = path.join(__dirname, '../../../../excelFile/sampleForImportCompleteCourses.xlsx');
        res.download(filePath);
       }
        }      
          