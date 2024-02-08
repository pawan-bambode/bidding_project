const excel = require('excel4node');
const xlsx = require('xlsx');
const studentRawData = require('../../../../models/admin/studentData/studentData');
const hash = require('../../../../utils/hash');
const isJsonString = require('../../../../utils/util');

module.exports = {
    generateExcel: (req, res) => {
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
        worksheet.column(10).setWidth(20);

        worksheet.cell(1, 1).string('studentSapId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 2).string('rollNo').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 3).string('studentName').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 4).string('email').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 5).string('programId').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 6).string('bidPoints').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 7).string('yearOfJoining').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 8).string('previousElectiveCredits').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });
        worksheet.cell(1, 9).string('dateofBirthDate').style({ font: { bold: true }, alignment: { horizontal: 'center', vertical: 'center' } });

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

    upload: async (req, res) => {
        let excelFileBufferData = req.file.buffer;
        let biddingId = res.locals.biddingId;
        let excelFileDataWorkbook = xlsx.read(excelFileBufferData);
        const sheetName = excelFileDataWorkbook.SheetNames[0];
        const sheet = excelFileDataWorkbook.Sheets[sheetName];
        const studentJsonData = xlsx.utils.sheet_to_json(sheet);

        const hashPasswords = async (data) => {
            const hashedPasswords = await Promise.all(
                data.map(async (item) => {
                    let hashedPassword = '';
                    if (item.dateofBirthDate) {
                        hashedPassword = await hash.hashPassword(convertExcelDateToJSDate(item.dateofBirthDate.toString()), false);
                    } else {
                        hashedPassword = await hash.hashPassword('pass@123');
                    }
                    let defaultValue = null;
                    return {
                        sap_id: item.studentSapId ?? defaultValue,
                        roll_no: item.rollNo !== undefined ? item.rollNo.toString() : defaultValue,
                        student_name: item.studentName !== undefined ? item.studentName.replace(/\s+/g, ' ').trim() : defaultValue,
                        email: item.email !== undefined ? item.email.replace(/\s+/g, ' ').trim() : defaultValue,
                        program_id: item.programId ?? defaultValue,
                        bid_points: item.bidPoints ?? defaultValue,
                        year_of_joining: item.yearOfJoining ?? defaultValue,
                        previous_elective_credits: item.previousElectiveCredits ?? defaultValue,
                        password: hashedPassword,
                        dob: item.dateofBirthDate == undefined ? defaultValue : convertExcelDateToJSDate(item.dateofBirthDate.toString(), true)
                    };
                })
            );
            return hashedPasswords;
        };

        const convertExcelDateToJSDate = (excelDate, isDelimeter) => {
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const epoch = new Date(Date.UTC(1900, 0, 1));
            const daysSinceEpoch = excelDate - 2;
            const millisecondsSinceEpoch = daysSinceEpoch * millisecondsPerDay;
            return formatJSDate(new Date(epoch.getTime() + millisecondsSinceEpoch), isDelimeter);
        };

        const formatJSDate = (date, isDelimeter) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const delimiter = isDelimeter ? '-' : '';
            return `${day}${delimiter}${month}${delimiter}${year}`;
        };

        const studentDataWithColumnHypen = await hashPasswords(studentJsonData);
        let studentRawDataValue = { student_data: studentDataWithColumnHypen };

        studentRawData.uploadStudentRawData(res.locals.slug, JSON.stringify(studentRawDataValue), res.locals.userId, biddingId).then(result => {
            res.status(200).json(JSON.parse(result.output.output_json));
        }).catch(error => {
            handleErrorResponse(error, res);
        });
    }
}
function handleErrorResponse(error, res) {
    if (isJsonString.isJsonString(error.originalError.info.message)) {
        res.status(500).json(JSON.parse(error.originalError.info.message));
    } else {
        res.status(500).json({
            status: 500,
            description: error.originalError.info.message,
            data: []
        });
    }
}   