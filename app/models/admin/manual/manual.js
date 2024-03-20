const { sql, poolConnection } = require('../../../../config/db');

module.exports = class Manual {


    static getRound(slug, biddingId, roundId){

        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT * FROM [${slug}].round_settings 
                        WHERE round_lid = @roundId AND bidding_session_lid = @biddingId AND active = 1`);
        });
    }

    static getList(slug, biddingId, roundId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT seb.id, student_lid, student_name, course_name, seb.course_lid, db.division  
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].courses c ON c.id = seb.course_lid
                        INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        WHERE seb.active = 1 AND seb.bidding_session_lid = @biddingId AND seb.round_lid = @roundId
                        AND seb.is_confirmed = 1`);
        });
    }

    static students(slug, biddingId, roundId){
        
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('roundId', sql.Int, roundId)
            .query(`SELECT student_lid, student_name, round_lid, concentration_lid 
                    FROM [${slug}].student_round_mapping rsm
                    INNER JOIN [${slug}].student_data sd ON rsm.student_lid = sd.id
                    WHERE rsm.round_lid = @roundId AND rsm.active = 1 AND rsm.bidding_session_lid = @biddingId`)
        })
    }
 
    static courses(slug, biddingId, studentId, roundId, id){

        if(id == 2){
            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentId', sql.Int, studentId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT seb.id as rowId,c.course_name, c.course_id, c.id AS courseId,
                        db.id AS division_batch_lid, db.division 
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].courses c ON c.id = seb.course_lid
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        where seb.active = 1 AND seb.bidding_session_lid = @biddingId AND c.active = 1 
                        AND c.bidding_session_lid = @biddingId AND is_confirmed = 1 AND student_lid = @studentId`);
            })
        }
        else if(id == 1) {
           return poolConnection.then(pool =>{
               return pool.request()
               .input('biddingId', sql.Int, biddingId)
               .input('studentId', sql.Int, studentId)
               .input('roundId', sql.Int, roundId)
               .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id,
                       c.acad_session, c.sap_acad_session_id, c.credits, db.max_seats,db.available_seats, 
                       RTRIM(LTRIM(db.division)) AS division, t.faculty_id,
                       t.faculty_name, d.day_name, c.id AS course_lid,
                       CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                       CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime
                       FROM [${slug}].timetable t 
                       INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                       INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                       INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                       INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                       INNER JOIN [dbo].days d ON d.id = t.day_lid
                       LEFT JOIN [${slug}].student_elective_bidding seb 
                       ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentId 
                       AND seb.bidding_session_lid = @biddingId AND seb.active = 1 
                       AND seb.is_confirmed != 1  
                       WHERE db.available_seats > 0 AND db.bidding_session_lid = @biddingId 
                       AND db.active = 1 AND seb.div_batch_lid IS NULL`);
           })           
        }
    }
}
