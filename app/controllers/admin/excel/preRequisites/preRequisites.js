const preRequisites = require('../../../../models/admin/preRequisite/prerequisite');
const isJsonString = require('../../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');

module.exports = {
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

  upload: (req, res) => {
    let excelFileBufferData = req.file.buffer;
    let biddingId = res.locals.biddingId;
    let excelFileDataWorkbook = xlsx.read(excelFileBufferData);
    const sheetName = excelFileDataWorkbook.SheetNames[0];
    const sheet = excelFileDataWorkbook.Sheets[sheetName];
    const preRequisitesJsonData = xlsx.utils.sheet_to_json(sheet);

    const preRequisitesWithColumnHypen = preRequisitesJsonData.map(item => {
      let defaultValue = null;
      return {
        acad_session: item.acadSession == undefined ? defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
        course_id: item.courseId == undefined ? defaultValue : item.courseId,
        course_name: item.courseName == undefined ? defaultValue : item.courseName.replace(/\s+/g, ' ').trim(),
        type: item.type == undefined ? defaultValue : item.type.replace(/\s+/g, ' ').trim(),
        pre_req_course_id: item.preRequisitesCourseId == undefined ? defaultValue : item.preRequisitesCourseId,
        pre_req_course_name: item.preRequisitesCourseName == undefined ? defaultValue : item.preRequisitesCourseName.replace(/\s+/g, ' ').trim()
      };
    });

    let preRequisitesDataValue = { pre_requisites: preRequisitesWithColumnHypen };

    preRequisites.upload(res.locals.slug, preRequisitesDataValue, res.locals.userId, biddingId)
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
  }
}