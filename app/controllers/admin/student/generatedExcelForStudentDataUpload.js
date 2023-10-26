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
                      roll_no: item.rollNo,
                      student_name: item.studentName,
                      email: item.email,
                      program_id: item.programId,
                      bid_points: item.bidPoints,
                      year_of_joining: item.yearOfJoining,
                      concentration_name: item.SpecilizationName,
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
      console.log('valuesof result',result);
       res.status(200).json(JSON.parse(result.output.output_json));
   
    }).catch(error => {
      console.log('valuesof error',error);
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
    console.log('valuesof result',result);
    res.status(200).json(JSON.parse(result.output.output_json));

 }).catch(error => {
   console.log('valuesof error',error);
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
}
}

