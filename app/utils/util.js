const { Result } = require('express-validator');
const {
    sql,
    poolConnection,
    execPreparedStmt
} = require('../../config/db')

const acadSession = require('../controllers/admin/acadsession/acadsession');
const excel = require('excel4node');

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

async function   currentAcadYear () {
    console.log('HERE:::::::::::::>>')
        let acadyear = await new Promise(async resolve => {
            return poolConnection.then(pool => {
                return pool.request().query(`SELECT input_acad_year FROM [dbo].academic_year WHERE is_locked = 1 AND name ='currrent_academic_year'`)
            })
            
        })
}

function isArray(array){
if (array.length > 0){

}
}
function convertExcelTimeToHHMMSS(excelTime) {
  if (typeof excelTime === 'number') {
      const hours = Math.floor(excelTime * 24);
      let minutes = Math.floor((excelTime * 24 - hours) * 60)
      if(minutes%5 == 1){
           minutes = Math.floor((excelTime * 24 - hours) * 60);
      }
     
      if(minutes%5 == 4){
           minutes = Math.ceil((excelTime * 24 - hours) * 60);
      }
     

      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  } else {
      return excelTime;
  }
}

async function  generateExcel (req, res) {
     
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const acadsessionList = Promise.all([acadSession.getAcadSessionList(req,res)]).then(result =>{
        console.log('values of acadSession',result[0]);
    });
    
    //const dropdownOptions = ['Option 1', 'Option 2', 'Option 3'];
     const dropdownOptions = [];
     for(let acadsession of acadsessionList){
        dropdownOptions.push(acadsession);
     }
    worksheet.addDataValidation({
      type: 'list',
      allowBlank: true,
      sqref: 'B2', 
      formulas: [dropdownOptions.join(',')]
    });
    
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
    
      worksheet.cell(i, 2).string('').style({ dataValidation: { showDropDown: true } });

    workbook.write('C:/Users/suraj.pal.ext/Desktop/8November/bidding_project_working (1)/bidding_project_working/excelFile/'+'sampleForImportCompleteCourses.xlsx', (err, stats) => {
      if (err) {
        console.error(err);
      } else {
        res.json({'status':'200'})
        console.log('Excel file with dropdown created successfully');
      }
    });
    
            
    
              }

  
module.exports = {
    isJsonString,
    currentAcadYear,
    isArray,
    convertExcelTimeToHHMMSS,
    generateExcel
}