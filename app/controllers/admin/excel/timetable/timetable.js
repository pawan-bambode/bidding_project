const timetable = require('../../../../models/admin/timetable/timetable');
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
    worksheet.column(5).setWidth(15);
    worksheet.column(6).setWidth(15);
    worksheet.column(7).setWidth(15);
    worksheet.column(8).setWidth(15);
    worksheet.column(9).setWidth(15);
    worksheet.column(10).setWidth(15);
    worksheet.column(11).setWidth(15);
    worksheet.column(12).setWidth(15);

    worksheet.cell(1, 1).string('programId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 2).string('acadSession').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 3).string('courseName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 4).string('division').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 5).string('batch').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 6).string('day').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 7).string('startTime').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 8).string('endTime').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 9).string('roomNo').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 10).string('facultyId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 11).string('facultyName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
    worksheet.cell(1, 12).string('facultyType').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });

    const filePath = __dirname + '/sampleForImportTimetable.xlsx';

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