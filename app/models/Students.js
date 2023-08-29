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

    static getStudentsData() {
        return poolConnection.then(pool => {
            return pool.request().query(`SELECT first_name, last_name, email, phone, city, REPLACE(CONVERT(VARCHAR, date_of_birth, 103), '/', '') dob, active FROM student_details WHERE active = 0 AND isPasswordGenerate = 0`)
        })
    }


    static createStudentCredentials(inputJson){
        
        return poolConnection.then(pool => {
            const request = pool.request();
            return request.input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJson))
                          .output('output_json', sql.NVarChar(sql.MAX))
                          .execute(`[dbo].[sp_generate_student_credentials]`)
        })
    }

    static updatePassword(userName, newPassword) {
        return poolConnection.then(pool => {
            return pool.request().query(`UPDATE users SET password = '${newPassword}' WHERE username = '${userName}'`)
        })
    }

    static getSlotForShowTimetable(){
        return poolConnection.then(pool => {
          return pool.request().query(`SELECT MIN(slot_lid) AS start_time_lid, MAX(slot_lid) AS end_time_lid FROM [dbo].event_bookings`)
        })
    }
    static getDistintRoomList(){
        return poolConnection.then(pool =>{
            return pool.request().query(`SELECT DISTINCT eb.room_lid,r.room_number FROM [dbo].event_bookings eb INNER JOIN [dbo].rooms r ON eb.room_lid = r.room_lid`)
        })
    }
    static getTimeslot(){
        return poolConnection.then(pool =>{
            return pool.request().query(`SELECT CONVERT(NVARCHAR,start_time, 0) as start_time,CONVERT(NVARCHAR,end_time, 0)end_time FROM [Infra_bidding_latest].[dbo].slot_interval_timings`)
        })
    }
    static subjectAdded(inputJson){
        return poolConnection.then(pool =>{
            return pool.request() 
            .input('input_json', sql.NVarChar(sql.MAX), inputJson)
            .input('last_modified_by', sql.Int, 15038)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[dbo].add_student_subjects`);
        })
    }
}