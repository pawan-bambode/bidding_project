const excel = require('exceljs');
const xlsx = require('xlsx');
const course = require('../../../../models/admin/course/course');
const isJsonString = require('../../../../utils/util');
const biddingSession = require('../../../../models/admin/biddingsession/biddingsession');

module.exports = {  
  generateExcel: (req, res) => {
      const workbook = new excel.Workbook();
      workbook.creator = `${res.locals.fullName}`;
      const worksheet = workbook.addWorksheet('Sheet1');
      let filePath;
      let formulaevalue = '';
      biddingSession.acadSessions(res.locals.biddingId)
          .then(result => {
              const dropdownOptions = [];
              result.recordset.forEach(item => {
                  dropdownOptions.push(item.acad_session);
              });

              worksheet.columns = [
                  { header: 'courseName', key: 'courseName', width: 15 },
                  { header: 'courseId', key: 'courseId', width: 10 },
                  { header: 'credits', key: 'credits', width: 10 },
                  { header: 'programId', key: 'programId', width: 10 },
                  { header: 'acadSession', key: 'acadSession', width: 20 },
                  { header: 'areaName', key: 'areaName', width: 15 },
                  { header: 'yearOfIntroduction', key: 'yearOfIntroduction', width: 20 },
                  { header: 'minDemandCriteria', key: 'minDemandCriteria', width: 20 }
              ];
  
              worksheet.getRow(1).eachCell((cell) => {
                  cell.font = { bold: true };
                  cell.alignment = { horizontal: 'center', vertical: 'center' };
              });
             
              for(let i = 0 ;i<dropdownOptions.length;i++){
                if(i == 0){
                  formulaevalue = ''
                  formulaevalue += "\""+dropdownOptions[i]+',';
                }
                else if (i== dropdownOptions.length-1){
                  formulaevalue += dropdownOptions[i]+'"';
                }
                else{
                  formulaevalue += dropdownOptions[i]+',';
                }
              }
              let array = [];
            
              array.push(formulaevalue);

              for (let rowNumber = 2; rowNumber <= 2000; rowNumber++) {
                  const cell = worksheet.getCell(`E${rowNumber}`); 
                  cell.dataValidation = {
                      type: 'list',
                      formulae: array,
                      allowBlank: true,
                      showErrorMessage: true,
                      errorTitle: 'Invalid Entry',
                      error: 'Please select a value from the dropdown list.'
                  };
              }
              filePath = __dirname + '/sampleForImportCourse.xlsx';
              return workbook.xlsx.writeFile(filePath);
          })
          .then(() => {

              res.sendFile(filePath, (err) => {
                  if (err) {
                      console.error('Error sending Excel file:', err);
                      return res.status(500).send('Error sending Excel file');
                  }
              });
          })
          .catch(error => {
              console.error('Error generating Excel file:', error);
              return res.status(500).send('Error generating Excel file');
          });
  },

  upload: (req, res) => {
    let excelFileBufferData = req.file.buffer;
    let biddingId = res.locals.biddingId;
    let excelFileDataWorkbook = xlsx.read(excelFileBufferData);
    const sheetName = excelFileDataWorkbook.SheetNames[0];
    const sheet = excelFileDataWorkbook.Sheets[sheetName];
    const courseJsonData = xlsx.utils.sheet_to_json(sheet);
    const courseDataWithColumnHypen = courseJsonData.map(item => {
      let defaultValue =  null;
      return {
        course_name: item.areaName == undefined ?  defaultValue : item.courseName.replace(/\s+/g, ' ').trim(), 
        course_id: item.courseId == undefined ?  defaultValue : item.courseId,
        credits: item.credits == undefined ?  defaultValue : item.credits,
        program_id: item.programId == undefined ?  defaultValue : item.programId,
        acad_session: item.acadSession == undefined ?  defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
        area_name: item.areaName == undefined ?  defaultValue : item.areaName.replace(/\s+/g, ' ').trim(),
        year_of_introduction: item.yearOfIntroduction == undefined ?  defaultValue : item.yearOfIntroduction,
        min_demand_criteria: item.minDemandCriteria == undefined ?  defaultValue : item.minDemandCriteria
      };
    });
    
    let courseJSON = { courses: courseDataWithColumnHypen };
    
    course.upload(res.locals.slug, courseJSON, res.locals.userId, biddingId)
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
};
