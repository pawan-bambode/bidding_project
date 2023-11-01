const excel = require('excel4node');
const xlsxPopulate = require('xlsx-populate');
const xlsx = require('xlsx');
const studentRawData = require('../../../models/admin/student/student');
const isJsonString = require('../../../utils/util');

module.exports = {
  generateExcelStudent: (req, res) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.column(1).setWidth(15);
    worksheet.column(2).setWidth(10);
    worksheet.column(3).setWidth(15);
    worksheet.column(4).setWidth(30);
    worksheet.column(5).setWidth(15);
    worksheet.column(6).setWidth(15);
    worksheet.column(7).setWidth(20);
    worksheet.column(8).setWidth(20);
    worksheet.column(9).setWidth(25);

    worksheet.cell(1, 1).string('studentSapId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 2).string('rollNo').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 3).string('studentName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 4).string('email').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 5).string('programId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 6).string('bidPoints').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 7).string('yearOfJoining').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 8).string('SpecilizationName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 9).string('previousElectiveCredits').style({font:{bold:true},alignment:{horizontal:'center',vertical:'center'}});
    const filePath = __dirname + '/sampleForImportStudent.xlsx';
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
    const studentJsonData = xlsx.utils.sheet_to_json(sheet);
    const studentDataWithColumnHypen = studentJsonData.map(item =>{
                    return {
                      sap_id: item.studentSapId,
                      roll_no: item.rollNo.replace(/\s+/g,' ').trim(),
                      student_name: item.studentName.replace(/\s+/g,' ').trim(),
                      email: item.email.replace(/\s+/g,' ').trim(),
                      program_id: item.programId,
                      bid_points: item.bidPoints,
                      year_of_joining: item.yearOfJoining,
                      concentration_name: item.SpecilizationName.replace(/\s+/g,' ').trim(),
                      previous_elective_credits:item.previousElectiveCredits
                    };
                  })
    let studentRawDataValue = {student_data: studentDataWithColumnHypen}
    studentRawData.uploadStudentRawData(res.locals.slug,JSON.stringify(studentRawDataValue),res.locals.userId,biddingId).then(result =>{
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
  refresh :(req,res) =>{
    studentRawData.refresh(res.locals.slug,res.locals.biddingId,res.locals.userId).then(result =>{
       res.status(200).json(JSON.parse(result.output.output_json));
   
    }).catch(error => {
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
update:(req,res) =>{
  studentRawData.update(res.locals.slug,res.locals.biddingId,res.locals.userId,req.body).then(result =>{
    res.status(200).json(JSON.parse(result.output.output_json));

 }).catch(error => {
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
delete: (req, res) => {
  
  studentRawData.delete(req.body.studentDataId, res.locals.slug, res.locals.userId,res.locals.biddingId)
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
deleteAll :(req, res) => {
  studentRawData.deleteAll(req.body, res.locals.slug, res.locals.userId,res.locals.biddingId)
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
searchStudentData :(req,res) =>{  
  Promise.all([studentRawData.searchStudentData(res.locals.slug,res.locals.biddingId,req.body.searchLetter,res.locals.userId,req.body.pageNo,req.body.showEntry),studentRawData.getCountSearch(res.locals.slug,res.locals.biddingId,req.body.searchLetter,res.locals.userId)]).then(result => {
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
searchStudentDataByletter :(req,res) =>{
   Promise.all([studentRawData.searchStudentDataByletter(res.locals.slug,res.locals.biddingId,req.body.searchLetter,req.body.pageNo,req.body.showEntry),studentRawData.getCounts(res.locals.slug,res.locals.biddingId,req.body.searchLetter,req.body.pageNo)]).then(result =>{
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
showEntryStudentDataList :(req,res) =>{
  Promise.all([studentRawData.showEntryCouresList(res.locals.slug,res.locals.biddingId,req.body.showEntry,req.body.pageNo,req.body.showEntry),studentRawData.getCounts(res.locals.slug,res.locals.biddingId,req.body.showEntry)]).then(result =>{
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
studentDataFilterByProgramId : (req,res) =>{
  Promise.all([studentRawData.studentDataFilterByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.showEntry),studentRawData.studentSapIdByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId),studentRawData.getCountfilterByProgramId(res.locals.slug,res.locals.biddingId,req.body.programId)]).then(result =>{
    res.json({
      stats:'200',
      message:'Result Fetched',
      data:result[0].recordset,
      studentDataSapIdList:result[1].recordset,
      length:result[2].recordset[0]['']
    })
  })
},
studentDataFilterByStudentSapId : (req,res) =>{
  Promise.all([studentRawData.studentDataFilterByStudentId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.showEntry,req.body.studentSapId),studentRawData.getCountfilterByStudentId(res.locals.slug,res.locals.biddingId,req.body.programId,req.body.studentSapId)]).then(result =>{
    console.log('values of result[1]',result[1].recordset[0]['']);
    res.json({
      stats:'200',
      message:'Result Fetched',
      data:result[0].recordset,
      length:result[1].recordset[0]['']
    })
  })
}

}

