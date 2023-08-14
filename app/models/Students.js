const s = require('connect-redis');
const{sql, poolConnection} = require('../../config/db');

const pool = require('mssql');


module.exports = class Students {

    static getStudentName() {
        return poolConnection.then(pool => {
            return pool.request().query('SELECT DISTINCT first_name FROM [dbo].student_details')
        })
    }

    static saveStudentDetails(inputJson){
        return poolConnection.then(pool => {
            const request = pool.request();
            return request.input('input_json', sql.NVarChar(sql.MAX), inputJson)
                          .output('output_json', sql.NVarChar(sql.MAX))
                          .execute(`[dbo].[sp_add_student_details]`)
        })
    }

    static fetchAllStudentDetails(){
        return poolConnection.then(pool => {
            return pool.request().query(`SELECT * FROM student_details`)
        })
    }

    static fetchStudentDetailsById(id) {
        return poolConnection.then(pool => {
            return pool.request().query(`SELECT * FROM student_details WHERE id = ${id}`)
        })
    }

    static updateStudentDetails(firstName, lastName, studentEmail, studentPhone, studentId) {
        console.log('IN MODAL', firstName)
        return poolConnection.then(pool => {
            return pool.request().query(`UPDATE student_details SET first_name = '${firstName}', last_name = '${lastName}', email = '${studentEmail}', phone = '${studentPhone}' WHERE id = ${studentId}`)
        })
    }

    static getDetailsByFirstname(firstName) {
        return poolConnection.then(pool => {
            return pool.request().query(`SELECT * FROM student_details WHERE first_name = '${firstName}'`)
        })
    }

}