const fs = require('fs');
const xlsx = require('xlsx');
const Students = require('../../../models/Students');
const hash = require('../../../utils/hash');
const crypto = require('../../../utils/crypto');
const User = require('../../../models/User')


module.exports = {
    getStudentPage: (req, res) => {
        Promise.all([Students.getStudentName()]).then(result => {
            //console.log('checking ==', result[0].recordset)
            res.render('admin/students/index.ejs', {
                studentNameList: result[0].recordset
            })
        })
        
    },

    readExcelFile : (req, res) => {
        console.log('While Upload== ', req.file)
        let filePath = `${req.file.destination}${req.file.filename}`;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log('check excel data --',sheetData);
        let jsonArr = JSON.stringify(sheetData);
        //console.log('Check jsonArr==>', jsonArr);

        Students.saveStudentDetails(jsonArr).then(data => {
            // console.log('check response == ', data.output.output_json)
            
            res.redirect('/admin/student')
            
        })
       
    },

    getStudentDetails: (req, res) => {
        Students.fetchAllStudentDetails().then(data => {
            var output = {
                'draw' : 1,
                'iTotalRecords' : 3363,
                'iTotalDisplayRecords' : 3363,
                'aaData' : data
            };
    
            res.json(output);

        })
    },

    getStudentDetailsById : (req, res) => {
        console.log('body data', req.body.studentId)
        Students.fetchStudentDetailsById(req.body.studentId).then(data => {
            res.status(200).json({
                data: data.recordset,
                message: 'success'
            })
        })
    },

    updateStudentDetailsById : (req, res) => {
        console.log('body data', req.body)
        let updatedBody = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "studentEmail": req.body.studentEmail,
            "studentPhone": req.body.studentPhone,
            "studentId": req.body.studentId,
        }
        Students.updateStudentDetails(req.body.firstName, req.body.lastName, req.body.studentEmail, req.body.studentPhone, req.body.studentId).then(data => {
            console.log('======>>', data)
            res.status(200).json({
                data: updatedBody,
                message: 'success'
            })
        })
    },


    getStudentInfoByFirstname : (req, res) => {

        Students.getDetailsByFirstname(req.body.firstName).then(data => {
            var output = {
                'draw' : 1,
                'iTotalRecords' : 10,
                'iTotalDisplayRecords' : 10,
                'aaData' : data
            };
    
            res.status(200).json(output);
        })
    },

    generateStudentCredentials : async (req, res) => {
       
        let studentData = await Students.getStudentsData();
        let jsonArr = [];
        
        for(let data of studentData.recordset){
            jsonArr.push({
                firstName: data.first_name,
                lastName: data.last_name,
                username: data.email,
                password: await hash.hashPassword(data.dob)
            })
        }

        Students.createStudentCredentials(jsonArr).then(data => {
            res.status(200).json({
                status: JSON.parse(data.output.output_json).status
            })
        })
    },


    checkOldPassword : async (req, res) => {

        let checkUserData = await User.getUserDetails(req.body.userName);

        let isVerified = await hash.verifyPassword(req.body.oldPass, checkUserData.recordset[0].password);

        res.status(200).json({
            verifiedStatus: isVerified ? true : false
        })
       
    },

    updatePassword : async (req, res) => {
        let userName = req.body.userName;
        let encryptPass = await hash.hashPassword(req.body.newPassword);

        Students.updatePassword(userName, encryptPass).then(data => {
            console.log('===>> ', data.rowsAffected.length)
            if(data.rowsAffected.length > 0) {
                res.status(200).json({
                    status: 'S'
                })
            } else {
                res.status(400).json({
                    status: 'F'
                })
            }
        })

    }








    
}
