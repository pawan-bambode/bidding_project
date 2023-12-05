const s = require('connect-redis');
const{sql, poolConnection} = require('../../config/db');

const pool = require('mssql');


module.exports = class Students {

    static getStudentDataList(slug,biddingId) {
         let showEntry = 10;
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`
            SELECT TOP ${showEntry}  sd.id ,sd.sap_id, sd.roll_no,sd.student_name,sd.email,p.program_name,sd.bid_points,sd.year_of_joining ,sd.previous_elective_credits
            FROM [${slug}].student_data sd 
            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1  AND  p.bidding_session_lid= @biddingId  AND sd.bidding_session_lid = @biddingId`)
        })
    }

    static getStudentDetail(slug,biddingId,username){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .input('username',sql.NVarChar,username)
            .query(`SELECT id ,sap_id,roll_no,student_name,email,bid_points,year_of_joining ,previous_elective_credits
            FROM [${slug}].student_data  WHERE email = @username`)
        })
    }
    static getConcentrationList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT id ,concentration_name FROM [${slug}].concentration WHERE bidding_session_lid = @biddingId`)
        })
    }
    static getConfirmaCourseList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT c.course_name ,c.credits  FROM [${slug}].student_elective_bidding seb 
            INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  WHERE seb.bidding_session_lid = @biddingId AND seb.is_confirmed = 1`)
        })
    }
    static getConfirmCreditsCounts(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request().
            input('biddingId',sql.Int,biddingId)
            .query(`SELECT IIF(SUM(c.credits) IS NULL, 0, SUM(c.credits)) AS total_confirm_credits FROM [${slug}].student_elective_bidding seb 
            INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  WHERE seb.bidding_session_lid = @biddingId AND seb.is_confirmed = 1`)
        })
    }  
    static getCompleteCourese(slug, biddingId, username) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('sapId', sql.NVarChar, username)
                .query(`SELECT cc.id, cc.course_name FROM [${slug}].completed_courses cc 
                        WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND cc.sap_id = @sapId`)
                .then(result => {
                    return result.recordset; 
                })
                .catch(err => {
                    console.error('Database error:', err);
                    throw err; 
                });
        });
    }
    
    // static getCompleteCourese(slug,biddingId,username){
    //     console.log('values username',username);
    //     console.log('value sof slug',slug);
    //     console.log('values biddingId',biddingId);
    //   return poolConnection.then(pool =>{
    //     return pool.request()
    //     .input('biddingId',sql.Int,biddingId)
    //     .input('sapId',sql.NVarChar,username.sap_id)
    //     .query(`SELECT  cc.id , cc.course_name FROM [${slug}].completed_courses cc 
    //      WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND cc.sap_id = @sapId  ORDER BY cc.id`)
    //   })
    // }
     static getDropCourseList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT c.course_name ,c.credits FROM [${slug}].student_elective_bidding seb 
            INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  WHERE seb.bidding_session_lid = @biddingId AND seb.is_dropped = 1`)
        })
    }

    static getWinningCourseList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT c.course_name ,c.credits FROM [${slug}].student_elective_bidding seb 
            INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
            INNER JOIN [${slug}].courses c ON db.course_lid = c.id where seb.bidding_session_lid = @biddingId AND  
            (seb.is_winning = 1 AND seb.is_confirmed  = 0) or (seb.is_winning = 1 and seb.is_dropped = 0 And seb.is_confirmed = 0)`)
        })
    }
    static getWaitListCouresList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT c.course_name ,c.credits FROM [${slug}].student_elective_bidding seb 
            INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
            INNER JOIN [${slug}].courses c ON db.course_lid = c.id where seb.bidding_session_lid = @biddingId AND seb.is_waitlisted = 1`)
        })
    }
    
    static getCount(slug,biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`
            SELECT COUNT(*) FROM [${slug}].student_data sd INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1  AND  p.bidding_session_lid= @biddingId  AND sd.bidding_session_lid = @biddingId`)
        })
    }
    static getProgramList(slug,biddingId) {
       return poolConnection.then(pool => {
           return pool.request()
           .input('biddingId',sql.Int,biddingId)
           .query(` SELECT p.program_id,p.program_name
            FROM [${slug}].student_data sd 
            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1  AND  p.bidding_session_lid = @biddingId   AND sd.bidding_session_lid = @biddingId GROUP BY p.program_id,p.program_name`)
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
            return pool.request().query(`SELECT first_name, last_name, email, phone, city, REPLACE(CONVERT(VARCHAR, date_of_birth, 103), '/', '') dob, active FROM  WHERE active = 0 AND isPasswordGenerate = 0`)
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
    static multipleHit(){
        console.log('inside the multiple hit');
    }
    static getSlotForShowTimetable(){
        return poolConnection.then(pool => {
          return pool.request().query(`SELECT MIN(start_slot_lid) AS start_time_lid, MAX(end_slot_lid) AS end_time_lid FROM [sbm-mum].timetable`)
        })
    }
    static getDistintRoomList(){
        return poolConnection.then(pool =>{
            return pool.request().query(`SELECT DISTINCT room_no FROM [sbm-mum].timetable `)
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
            .input('last_modified_by', sql.Int, 15048)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[dbo].add_student_subjects`);
        })
    }


    static updateSubject(inputJson){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJson)
            .input('last_modified_by', sql.Int, 15048)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[dbo].update_student_subjects`);
        })
    }
    static fetchAllCourseSelByStudent(student_lid){
        return poolConnection.then(pool =>{
                return pool.request()
                .input('student_id',sql.NVarChar,student_lid)
                .query(`SELECT * FROM [sbm-mum].student_elective_mapping sem 
                INNER JOIN [sbm-mum].student_data sd ON sem.student_lid = sd.id WHERE sap_id = @student_id AND sd.active = 1`);
            })
    }
    static getTimetableByDayId(slug,sapId,biddingId){
        return poolConnection.then(pool =>{
            return pool.request().
             input('sapId',sql.Int,sapId)
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT c.*,p.program_name FROM [${slug}].courses c INNER JOIN [${slug}].programs p  ON c.program_id = p.program_id WHERE c.sap_acad_session_id = @sapId AND c.active = 1 AND c.bidding_session_lid = @biddingId`)     
        })
    }
    static getCountOfCourses(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT COUNT(*) AS count FROM [${slug}].courses c INNER JOIN [${slug}].programs p  ON c.program_id = p.program_id WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)     
        })
    }
    static getSlotDayId(day_lid){
        return poolConnection.then(pool =>{
            return pool.request().
            input('day_lid',sql.Int,day_lid)
            .query(`SELECT DISTINCT end_slot_lid,CONCAT(start_slot_lid, '-',end_slot_lid) as slot_value,start_slot_lid FROM [sbm-mum].timetable where day_lid = @day_lid order by end_slot_lid`);     
        })
    }

}