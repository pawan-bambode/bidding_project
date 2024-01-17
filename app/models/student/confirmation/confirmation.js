
const { Result } = require('express-validator');
const {sql,poolConnection} = require('../../../../config/db')

module.exports = class Confirmation
{
    static getConfirmCourseList(slug, biddingId, studentId ) { 
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentId)
            .query(`SELECT DISTINCT t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                    c.course_name, c.course_id,  t.faculty_name, c.credits, seb.bid_points 
                    FROM [${slug}].student_elective_bidding seb 
                    INNER JOIN [${slug}].courses c ON seb.course_lid = c.id AND c.active = 1
                    INNER JOIN [${slug}].division_batches db ON  db.course_lid = c.id AND db.active = 1
                    INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id WHERE seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND  seb.round_lid = 2 AND seb.active = 1 AND seb.is_winning = 1`)
        });
    }

    static saveConfirmCourse() {
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), favJson)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_favourite]`)
        })
    }
}
