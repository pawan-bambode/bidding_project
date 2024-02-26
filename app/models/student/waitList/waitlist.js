const { sql, poolConnection } = require('../../../../config/db');

module.exports = class WaitList {
    static getStudentDetails(slug, biddingId, studentId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .query(`SELECT concentration_lid AS concentrationId 
                        FROM [${slug}].student_data 
                        WHERE id = @studentLid AND bidding_session_lid = @biddingId`);
        });
    }

    static getWaitListCourse(slug, biddingId, studentId, roundId) {
      
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT db.id, seb.bid_points , c.course_name, c.area_name, c.acad_session,
                        c.sap_acad_session_id,c.credits, db.max_seats,db.available_seats,
                        RTRIM(LTRIM(db.division)) AS division, t.faculty_id, t.faculty_name 
                        FROM [${slug}].student_elective_bidding seb
                        INNER JOIN [${slug}].division_batches db On seb.div_batch_lid = db.id
                        INNER JOIN [${slug}].courses c ON seb.course_lid = c.id
                        INNER JOIN [${slug}].timetable t On t.division_batch_lid = db.id
                        WHERE seb.active = 1 AND seb.round_lid = @roundId AND seb.student_lid = @studentLid
                        AND seb.bidding_session_lid = @biddingId
                        GROUP BY db.id, seb.bid_points, c.course_name, c.area_name, c.acad_session, 
                        c.sap_acad_session_id, c.credits, db.max_seats,db.available_seats,division, 
                        t.faculty_id, t.faculty_name`);
        });
    }

      // Procedures code starts from here.
    static addBidPoints(slug, id, studentId, roundId, divisionId, bidPoints, previousBidPoints, userId, biddingSessionId) {
 
        return poolConnection.then(pool => {
            return pool.request()
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
        return poolConnection.then(pool => {
            return pool.request()
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
        return poolConnection.then(pool => {
            return pool.request()
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
