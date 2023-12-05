const excel = require('excel4node');
const xlsxPopulate = require('xlsx-populate');
const xlsx = require('xlsx');
const courseworkload = require('../../../models/admin/courseworkload/courseworkload');
const isJsonString = require('../../../utils/util');

module.exports = {
  generateExcel: (req, res) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    worksheet.column(1).setWidth(15);
    worksheet.column(2).setWidth(10);
    worksheet.column(3).setWidth(10);
    worksheet.column(4).setWidth(10);
    worksheet.column(5).setWidth(20);
    worksheet.column(6).setWidth(15);
    worksheet.column(7).setWidth(20);
    worksheet.column(8).setWidth(20);

    worksheet.cell(1, 1).string('courseName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 2).string('courseId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 3).string('credits').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 4).string('programId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 5).string('acadSession').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 6).string('areaName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 7).string('yearOfIntroduction').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 8).string('minDemandCriteria').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });

    const filePath = __dirname + '/sampleForImportCourse.xlsx';
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
    const courseJsonData = xlsx.utils.sheet_to_json(sheet);
    const courseDataWithColumnHypen = courseJsonData.map(item =>{
                    return {
                      course_name: item.courseName.replace(/\s+/g, ' ').trim(),
                      course_id: item.courseId,
                      credits: item.credits,
                      program_id: item.programId,
                      acad_session: item.acadSession.replace(/\s+/g, ' ').trim(),
                      area_name: item.areaName.replace(/\s+/g, ' ').trim(),
                      year_of_introduction: item.yearOfIntroduction,
                      min_demand_criteria: item.minDemandCriteria
                    };
                  })
    let course = {courses: courseDataWithColumnHypen}
    courseworkload.uploadCourse(res.locals.slug,course,res.locals.userId,biddingId).then(result =>{
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
  }
}

