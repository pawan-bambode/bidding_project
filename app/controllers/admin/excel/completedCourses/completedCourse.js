const excel = require('excel4node');
const xlsx = require('xlsx');
const completedCourses = require('../../../../models/admin/completedCourses/completedCourses');
const isJsonString = require('../../../../utils/util');

module.exports = {
generateExcel: (req, res) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

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

    const filePath = path.join(__dirname, '/sampleForImportCompletedCourses.xlsx');

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
    const completedCoursesJsonData = xlsx.utils.sheet_to_json(sheet);

    const completedCoursesWithColumnHypen = completedCoursesJsonData.map(item => {
        let defaultValue = null;
        return {
            sap_id: item.studentSapId == undefined ? defaultValue : item.studentSapId,
            acad_session: item.acadSession == undefined ? defaultValue : item.acadSession.replace(/\s+/g, ' ').trim(),
            course_id: item.courseId == undefined ? defaultValue : item.courseId,
            course_name: item.courseName == undefined ? defaultValue : item.courseName.replace(/\s+/g, ' ').trim()
        };
    });
    let completeCourseDataValue = {
        completed_courses: completedCoursesWithColumnHypen
    };

    completedCourses.upload(res.locals.slug, completeCourseDataValue, res.locals.userId, biddingId)
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