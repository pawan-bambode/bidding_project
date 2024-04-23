const isJsonString = require('../../../../utils/util');
const excel = require('excel4node');
const xlsx = require('xlsx');
const divisionBatch = require('../../../../models/admin/divisionBatches/divisionBatches');
 
module.exports = {

    upload : (req, res) => {
        let excelFileBufferData = req.file.buffer;
        let biddingId = res.locals.biddingId;
        let excelFileDataWorkbook = xlsx.read(excelFileBufferData);
        const sheetName = excelFileDataWorkbook.SheetNames[0];
        const sheet = excelFileDataWorkbook.Sheets[sheetName];
        const courseJsonData = xlsx.utils.sheet_to_json(sheet);
        const divisionBatchesWithColumnHypen = courseJsonData.map(item => {
            let defaultValue = null;
            return {
                course_name: item.courseName == undefined ? defaultValue: item.courseName,
                course_id: item.courseId == undefined ? defaultValue : item.courseId,
                division: item.division == undefined ? defaultValue : item.division,
                batch: item.batch == undefined ? defaultValue : item.batch,
                max_seats: item.maxSeats == undefined ? defaultValue : item.maxSeats
            };
        });
        
        let divisionBatches = { division_batches: divisionBatchesWithColumnHypen };
        
        divisionBatch.upload(res.locals.slug, divisionBatches, res.locals.userId, biddingId)
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

    generateExcel: (req, res) => {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
    
        worksheet.column(1).setWidth(15);
        worksheet.column(2).setWidth(15);
        worksheet.column(3).setWidth(10);
        worksheet.column(4).setWidth(10);
        worksheet.column(5).setWidth(10);
        
        worksheet.cell(1, 1).string('courseName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 2).string('courseId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 3).string('division').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 4).string('batch').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 5).string('maxSeats').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
      
        const filePath = __dirname + '/sampleForImportDivisionBatches.xlsx';
        
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
}