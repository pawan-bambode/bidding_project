const {sql,poolConnection} = require('../../../../config/db')

module.exports = class AddDrop
{
    static getWaitListCourse(slug, biddingId, studentId){
        let roundId = 6;
              return poolConnection.then(pool =>{
                  return pool.request()
                  .input('biddingId', sql.Int, biddingId)
                  .input('studentLid', sql.Int, studentId)
                  .input('roundId', sql.Int, roundId)
                  .query(`SELECT DISTINCT t.division_batch_lid, seb.is_waitlisted, seb.is_winning, 
                          c.area_name, c.course_name, c.course_id, c.acad_session, c.sap_acad_session_id, 
                          c.credits, db.max_seats , RTRIM(LTRIM(db.division)) AS division, 
                          t.faculty_id, t.faculty_name, c.id AS course_lid, IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite, seb.bid_points, seb.id
                          FROM [${slug}].timetable t 
                          INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                          INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                          INNER JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid 
                          INNER JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND seb.round_lid = @roundId AND seb.is_waitlisted = 1 `)                    
              })
      }

      static addDrop(slug, studentId, roundId, courseId, concentrationId, divisionId, userId, biddingSessionId) {
        return poolConnection.then((pool) => {
          return pool
            .request()
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('course_lid', sql.Int, courseId)
            .input('concentration_lid', sql.Int, concentrationId)
            .input('div_batch_lid', sql.Int, divisionId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_flag', sql.Bit)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_drop_add]`);
        });
      }
}
