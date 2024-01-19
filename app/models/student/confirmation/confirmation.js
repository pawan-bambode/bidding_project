
const {sql,poolConnection} = require('../../../../config/db');

module.exports = class Confirmation
{
    static winningCourseList(slug, biddingId, studentId, roundId) {  
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .query(`SELECT db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                    c.course_name, c.course_id,  t.faculty_name, c.credits, seb.bid_points, db.division,
                    seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid    
                    FROM [${slug}].student_elective_bidding seb
                    INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                    INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                    INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                    WHERE seb.student_lid = @studentLid AND seb.is_winning = 1 AND seb.round_lid = @round_lid AND seb.is_confirmed = 0 AND seb.active = 1
                    GROUP BY db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                    c.course_name, c.course_id,  t.faculty_name, c.credits, seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid`)
        });
    }
    
    static getConfirmCourseList(slug, biddingId, studentId) {  
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentId)
            .query(`SELECT db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                    c.course_name, c.course_id,  t.faculty_name, c.credits, seb.bid_points, db.division,
                    seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid     
                    FROM [${slug}].student_elective_bidding  seb
                    INNER JOIN [${slug}].division_batches db ON seb.div_batch_lid = db.id
                    INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id
                    WHERE seb.student_lid = @studentLid AND seb.active = 1 AND is_confirmed = 1
                    GROUP BY db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                    c.course_name, c.course_id,  t.faculty_name, c.credits, seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid`)
        });
    }

    static addConfirmCourse(slug, userid, biddingId, addConfirmationJson) {

        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), addConfirmationJson)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_confirmation]`)
        })
    }

    static getRoundId(slug, biddingId, roundName){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('roundName', sql.NVarChar(sql.MAX), `%${roundName}%`)
            .query(`SELECT round_lid AS roundId FROM 
                    [${slug}].round_settings where active = 1 AND bidding_session_lid = @biddingId AND round_name LIKE @roundName`);
        })
    }
}
