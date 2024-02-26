const { sql, poolConnection } = require('../../../../config/db');

module.exports = class Confirmation {
    
    static winningCourseList(slug, biddingId, studentId, round1Id, round2Id) {  
     
        let prevRound1 = Number(round1Id) - 1;
        let prevRound2 = Number(round2Id) - 1;  
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .input('confirmationRound1Id', sql.Int, round1Id)
                .input('confirmationRound2Id', sql.Int, round2Id)
                .input('prevRound1', sql.Int, prevRound1)
                .input('prevRound2', sql.Int, prevRound2)
                .query(`IF (SELECT COUNT(*) FROM [${slug}].round_settings 
                            WHERE round_lid = @confirmationRound1Id
                            AND GETDATE() >=  start_date_time AND GETDATE() <= end_date_time) > 0
                           BEGIN
                              SELECT db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                              c.course_name, c.course_id, t.faculty_name, c.credits,
                              seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, 
                              seb.is_dropped, seb.is_waitlisted, seb.is_winning , seb.round_lid  
                              FROM [${slug}].student_elective_bidding seb
                              INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                              INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                              INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                              LEFT JOIN (
                                         SELECT div_batch_lid 
                                         FROM [${slug}].student_elective_bidding 
                                         WHERE student_lid = @studentLid 
                                         AND bidding_session_lid = @biddingId 
                                         AND active = 1 AND round_lid = @confirmationRound1Id  
                                         AND is_confirmed = 1
                                        )seb2 ON seb.div_batch_lid = seb2.div_batch_lid
                              WHERE seb.student_lid = @studentLid 
                              AND seb.is_winning = 1 
                              AND seb.is_confirmed = 0 
                              AND seb.active = 1 
                              AND seb.bidding_session_lid = @biddingId
                              AND seb.round_lid = @prevRound1
                              AND seb2.div_batch_lid IS NULL
                              GROUP BY db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                              c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, 
                              db.division, 
                              seb.concentration_lid, seb.course_lid, seb.is_dropped , seb.is_waitlisted, 
                              seb.is_winning, seb.round_lid 
                           END  
                        ELSE IF (SELECT COUNT(*) FROM [sbm-mum].round_settings
                                 WHERE round_lid = @confirmationRound2Id 
                                 AND GETDATE() >= start_date_time AND GETDATE() <= end_date_time) > 0
                           BEGIN
                                SELECT db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, c.course_name, c.course_id, t.faculty_name, c.credits,
                                seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, 
                                seb.is_dropped, seb.is_waitlisted, seb.is_winning , seb.round_lid  
                                FROM [${slug}].student_elective_bidding seb
                                INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                                INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                                INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                                LEFT JOIN (
                                           SELECT div_batch_lid 
                                           FROM [${slug}].student_elective_bidding 
                                           WHERE student_lid = @studentLid AND bidding_session_lid = @biddingId AND active = 1 AND round_lid = @confirmationRound2Id  AND is_confirmed = 1
                                          )seb2 ON seb.div_batch_lid = seb2.div_batch_lid
                                WHERE seb.student_lid = @studentLid 
                                AND seb.is_winning = 1 
                                AND seb.is_confirmed = 0 
                                AND seb.active = 1 
                                AND seb.round_lid = @prevRound2
                                AND seb.bidding_session_lid = @biddingId
                                AND seb2.div_batch_lid IS NULL
                                GROUP BY db.id, t.faculty_id, c.area_name, c.acad_session, 
                                c.sap_acad_session_id, 
                                c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, 
                                db.division, 
                                seb.concentration_lid, seb.course_lid, seb.is_dropped , seb.is_waitlisted, 
                                seb.is_winning, seb.round_lid
                           END`);
        });         
    }
    
    static getConfirmationForBidding(slug, biddingId, studentId) { 
       
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .query(`SELECT db.id, seb.id AS Id, t.faculty_id, c.area_name, c.acad_session, 
                        c.sap_acad_session_id, c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, db.division,
                        seb.concentration_lid, seb.course_lid, is_dropped, is_waitlisted, is_winning, round_lid     
                        FROM [${slug}].student_elective_bidding  seb
                        INNER JOIN [${slug}].division_batches db ON seb.div_batch_lid = db.id
                        INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id
                        WHERE seb.student_lid = @studentLid AND seb.active = 1 AND is_confirmed = 1
                        GROUP BY db.id, seb.id, t.faculty_id, c.area_name, c.acad_session, 
                        c.sap_acad_session_id, c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid`);
        });
    }
    static getConfirmCourseList(slug, biddingId, studentId, round1Id, round2Id) { 
        
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .input('confirmationRound1Id', sql.Int, round1Id)
                .input('confirmationRound2Id', sql.Int, round2Id)
                .query(`IF (SELECT COUNT(*) FROM [${slug}].round_settings 
                         WHERE round_lid = @confirmationRound1Id AND end_date_time >= GETDATE()) > 0
                          BEGIN
                             SELECT db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                             c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, db.division,
                             seb.concentration_lid, seb.course_lid, is_dropped, is_waitlisted, is_winning, round_lid       
                             FROM [${slug}].student_elective_bidding  seb
                             INNER JOIN [${slug}].division_batches db ON seb.div_batch_lid = db.id
                             INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                             INNER JOIN [${slug}].courses c ON db.course_lid = c.id
                             WHERE seb.student_lid = @studentLid AND seb.active = 1 AND is_confirmed = 1 AND round_lid = @confirmationRound2Id
                             GROUP BY db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                             c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid
                          END
                        ELSE
                          BEGIN
                            SELECT db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                            c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, db.division,
                            seb.concentration_lid, seb.course_lid, is_dropped, is_waitlisted, is_winning, round_lid       
                            FROM [${slug}].student_elective_bidding  seb
                            INNER JOIN [${slug}].division_batches db ON seb.div_batch_lid = db.id
                            INNER JOIN [${slug}].timetable t ON t.division_batch_lid = db.id
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id
                            WHERE seb.student_lid = @studentLid AND seb.active = 1 AND is_confirmed = 1 AND round_lid = @confirmationRound1Id
                            GROUP BY db.id, t.faculty_id, c.area_name, c.acad_session, c.sap_acad_session_id, 
                            c.course_name, c.course_id, t.faculty_name, c.credits, seb.bid_points, db.division, seb.concentration_lid, seb.course_lid, is_dropped , is_waitlisted, is_winning, round_lid 
                        END`
                   );
        });
    }

    static getRoundId(slug, biddingId, roundName) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundName', sql.NVarChar(sql.MAX), `%${roundName}%`)
                .query(`SELECT round_lid AS roundId FROM 
                        [${slug}].round_settings where active = 1 AND bidding_session_lid = @biddingId AND round_name LIKE @roundName`);
        });
    }

    // Procedures code starts from here.
    static addConfirmCourse(slug, userid, biddingId, addConfirmationJson) {
       
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), addConfirmationJson)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_confirmation]`);
        });
    }

    static roundEnd(slug ,roundId, biddingSessionId) {
      if((roundId == 3) || (roundId = 5)) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('round_lid', sql.Int, roundId)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_confirmation_round_ends]`)
        })
    }
    if(roundId == 1)  {
        return poolConnection.then(pool => {
            return pool.request()
                .input('round_lid', sql.Int, roundId)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_demand_estimation_round_ends]`)
        })
    }
}
}
