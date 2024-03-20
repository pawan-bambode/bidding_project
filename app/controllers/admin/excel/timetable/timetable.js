const timetable = require('../../../../models/admin/timetable/timetable');
const isJsonString = require('../../../../utils/util');
const excel = require('exceljs');
const xlsx = require('xlsx');

module.exports = {
    generateExcel: (req, res) => {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet1');
    
        worksheet.columns = [
            {header: 'programId', key: 'programId', width: 15},
            {header: 'acadSession', key: 'acadSession', width: 15},
            {header: 'courseName', key: 'courseName', width: 15},
            {header: 'division', key: 'division', width: 15},
            {header: 'batch', key: 'batch', width: 15},
            {header: 'day', key: 'day', width: 15},
            {header: 'startTime', key: 'startTime', width: 15},
            {header: 'endTime', key: 'endTime', width: 15},
            {header: 'roomNo', key: 'roomNo', width: 15},
            {header: 'facultyId', key: 'facultyId', width: 15},
            {header: 'facultyName', key: 'facultyName', width: 15},
            {header: 'facultyType', key: 'facultyType', width: 15}
        ];
    
        worksheet.getRow(1).eachCell(cell => {
            cell.font = {bold: true};
            cell.alignment = {horizontal: 'center', vertical: 'center'};
        });
    
        for (let rowNumber = 2; rowNumber <= 2000; rowNumber++) {
            const cell = worksheet.getCell(`F${rowNumber}`);
            cell.dataValidation = {
                type: 'list',
                formulae: ['"Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday"'],
                allowBlank: true
            };
        }
    
        const filePath = __dirname + '/sampleForImportTimetable.xlsx';
    
        workbook.xlsx.writeFile(filePath)
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
    const timetableJsonData = xlsx.utils.sheet_to_json(sheet);

    const timetableDataWithColumnHypen = timetableJsonData.map(item => {
        const defaultValue = null;
        return {
            program_id: item.programId == undefined ? defaultValue : item.programId,
            acad_session: item.acadSession == undefined ? defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
            course_name: item.courseName == undefined ? defaultValue : item.courseName.replace(/\s+/g, ' ').trim(),
            division: item.division == undefined ? defaultValue : item.division.replace(/\s+/g, ' ').trim(),
            batch: item.batch == undefined ? defaultValue : item.batch,
            day: item.day == undefined ? defaultValue : item.day,
            start_time: item.startTime == undefined ? defaultValue : isJsonString.convertExcelTimeToHHMMSS(item.startTime),
            end_time: item.endTime == undefined ? defaultValue : isJsonString.convertExcelTimeToHHMMSS(item.endTime),
            room_no: item.roomNo == undefined ? defaultValue : item.roomNo.toString(),
            faculty_id: item.facultyId == undefined ? defaultValue : item.facultyId.toString(),
            faculty_name: item.facultyName == undefined ? defaultValue : item.facultyName.replace(/\s+/g, ' ').trim(),
            faculty_type_abbr: item.facultyType == undefined ? defaultValue : item.facultyType
        };
    });

    let timetableDataValue = JSON.stringify({ timetable: timetableDataWithColumnHypen });

    timetable.upload(res.locals.slug, timetableDataValue, res.locals.userId, biddingId).then(result => {
        res.status(200).json(JSON.parse(result.output.output_json));
    }).catch(error => {
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