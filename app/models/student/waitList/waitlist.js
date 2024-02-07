const { sql, poolConnection } = require('../../../../config/db');

module.exports = class WaitList {


  static getStudentDetails(slug, biddingId, studentId) {
    return poolConnection.then((pool) => {
      return pool
        .request()
        .input('biddingId', sql.Int, biddingId)
        .input('studentLid', sql.Int, studentId)
        .query(`SELECT concentration_lid AS concentrationId 
                FROM [${slug}].student_data where id = @studentLid AND bidding_session_lid = @biddingId`);
    });
  }

  static getWaitListCourse(slug, biddingId, studentId){
    let roundId = 6;
          return poolConnection.then(pool =>{
              return pool.request()
              .input('biddingId', sql.Int, biddingId)
              .input('studentLid', sql.Int, studentId)
              .input('roundId', sql.Int, roundId)
              .query(`SELECT t.division_batch_lid, 
                      c.area_name, c.course_name, c.course_id, c.acad_session, 
                      c.sap_acad_session_id, c.credits, db.max_seats ,db.available_seats, RTRIM(LTRIM(db.division)) AS division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                      d.day_name, c.id AS course_lid, seb.id, seb.bid_points,
                      IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite 
                      FROM [${slug}].timetable t 
                      INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                      INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                      INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                      INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                      INNER JOIN [dbo].days d ON d.id = t.day_lid
                      INNER JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid 
                      INNER JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND seb.round_lid = @roundId AND seb.is_waitlisted = 1 ORDER BY sem.id DESC`)                    
          })
  }

    // Procedures code starts from here.
  static addBidPoints(slug, id, studentId, roundId, divisionId, bidPoints, previousBidPoints, userId, biddingSessionId) {
   
    return poolConnection.then((pool) => {
      return pool
        .request()
        .input('id', sql.Int, id)
        .input('student_lid', sql.Int, studentId)
        .input('round_lid', sql.Int, roundId)
        .input('div_batch_lid', sql.Int, divisionId)
        .input('bid_points', sql.Int, bidPoints)
        .input('previous_bid_points', sql.Int, previousBidPoints)
        .input('last_modified_by', sql.Int, userId)
        .input('bidding_session_lid', sql.Int, biddingSessionId)
        .output('output_flag', sql.Bit)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_waitlist_change_bid]`);
    });
  }

  static withdraw(slug, id, studentId, roundId, divisionId, userId, biddingSessionId) {
    return poolConnection.then((pool) => {
      return pool
        .request()
        .input('id', sql.Int, id)
        .input('student_lid', sql.Int, studentId)
        .input('round_lid', sql.Int, roundId)
        .input('div_batch_lid', sql.Int, divisionId)
        .input('last_modified_by', sql.Int, userId)
        .input('bidding_session_lid', sql.Int, biddingSessionId)
        .output('output_flag', sql.Bit)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_waitlist_withdraw_bid]`);
    });
  }

  static addWaitList(slug, studentId, roundId, courseId, concentrationId, divisionId, userId, biddingSessionId) {
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
        .execute(`[${slug}].[sp_add_waitlist_consideration_set]`);
    });
  }
};
