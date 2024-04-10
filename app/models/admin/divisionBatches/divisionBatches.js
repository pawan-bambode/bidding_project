const { sql, poolConnection } = require('../../../../config/db');

module.exports = class DivisionBatches {

    static getList(slug, biddingId) {
        let showEntry = 10;
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.active = 1`);
        });
    }

    static getCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId`);
        });
    }

    static programList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('bidding_session_lid', sql.Int, biddingId)
                .query(`SELECT p.program_id, program_name 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_id = db.course_id 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id WHERE p.bidding_session_lid = @bidding_session_lid GROUP BY p.program_id, p.program_name`);
        });
    }

    static search(slug, biddingId, letterSearch, programId, acadSessionId, showEntry, pageNo) {

        if (pageNo) {
            
            if ((programId != -1) && (acadSessionId != -1)) {
                
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('biddingId', sql.Int, biddingId)
                        .input('programId', sql.Int, programId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('pageNo', sql.Int, pageNo)
                        .query(`SELECT db.id, p.program_name, ad.acad_session, 
                                c.course_name, db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id   
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND p.program_id = @programId
                                AND p.bidding_session_lid = @biddingId AND p.active = 1 
                                AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            } else if (programId != -1) {
                
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('biddingId', sql.Int, biddingId)
                        .input('programId', sql.Int, programId)
                        .input('pageNo', sql.Int, pageNo)
                        .query(`SELECT db.id, p.program_name, ad.acad_session, 
                                c.course_name, db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id 
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId
                                AND p.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.program_id = @programId AND (p.program_name LIKE @letterSearch) OR (ad.acad_session LIKE @letterSearch) OR (c.course_name LIKE @letterSearch) OR (db.division LIKE @letterSearch) OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            } else {
               
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('biddingId', sql.Int, biddingId)
                        .input('pageNo', sql.Int, pageNo)
                        .query(`SELECT db.id, p.program_name, ad.acad_session, c.course_name, 
                                db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId
                                AND(p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            }
        } else {
            if (programId != '-1' && acadSessionId != '-1') {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('biddingId', sql.Int, biddingId)
                        .input('programId', sql.Int, programId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, 
                                c.course_name, db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId  
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch)`);
                });
            } else if (programId != '-1') {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('biddingId', sql.Int, biddingId)
                        .input('programId', sql.Int, programId)
                        .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                                db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`);
                });
            } else {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .input('biddingId', sql.Int, biddingId)
                        .query(`SELECT db.id, p.program_name, ad.acad_session, c.course_name, 
                                db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                                WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`);
                });
            }
        }
    }
    
    
    static searchCount(slug, biddingId, letterSearch, programId, acadSessionId) {
        if (programId != '-1' && acadSessionId != '-1') {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId  
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                            WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch)`);
            });
        } else if (programId != '-1') {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId AND p.program_id = @programId
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                            WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                            WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`);
            });
        }
    }
    
    static showEntry(slug, biddingId, showEntry, programId, acadSessionId) {
        
        if (programId != - 1 && acadSessionId != -1) {  
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .query(`SELECT TOP ${showEntry} db.id, p.program_name,ad.acad_session, c.course_name, 
                            db.division, db.batch, max_seats 
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                            WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @acadSessionId
                            ORDER BY c.id DESC`);
            });
        }
            else if (acadSessionId != -1) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('biddingId', sql.Int, biddingId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .query(`SELECT TOP ${showEntry} db.id,p.program_name,ad.acad_session,
                                c.course_name, db.division, db.batch, max_seats 
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId
                                ORDER BY `);
                });
            }
    else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name,
                            db.division, db.batch, max_seats 
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                            WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`);
            });
        }
    }
    
    static showEntryCount(slug, biddingId, programId, acadSessionId) {
        if (programId != - 1 && acadSessionId != -1) {
           
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                            WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @acadSessionId`);
            });
        }
            else if (acadSessionId != -1) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('biddingId', sql.Int, biddingId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .query(`SELECT COUNT(*)
                                FROM [${slug}].division_batches db 
                                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId`);
                });
            }
    else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].division_batches db 
                            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                            WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`);
            });
        }
    }
       
    static listByProgramId(slug, biddingId, programId, showEntry) {
      
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.active = 1 AND p.bidding_session_lid = @biddingId ORDER BY db.id`);
        });
    }
    
    static listByProgramIdCount(slug, biddingId, programId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.active = 1 AND p.bidding_session_lid = @biddingId`);
        });
    }
    
    static sessionByProgramId(slug, biddingId, programId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT c.sap_acad_session_id, c.acad_session 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id WHERE db.bidding_session_lid = @biddingId AND db.active = 1 AND program_id = @programId  GROUP BY c.sap_acad_session_id, c.acad_session ORDER BY c.sap_acad_session_id`);
        });
    }
    
    static listBySessionId(slug, biddingId, programId, sessionId, showEntry) {
  
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @sessionId AND p.active = 1 AND p.bidding_session_lid = @biddingId ORDER BY db.id`);
        });
    }
    
    static listBySessionIdCount(slug, biddingId, programId, sessionId) {
     
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @sessionId AND p.active = 1 AND p.bidding_session_lid = @biddingId`);
        });
    }
        
    static waitlistAvailableCourse(slug, biddingId, studentId) {
        let roundId = 6;
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .input('roundId', sql.Int, roundId)
                .query(`IF(SELECT COUNT(*) FROM [${slug}].round_settings 
                           WHERE round_lid = @roundId AND GETDATE() >=  start_date_time AND GETDATE() <= end_date_time) > 0
                            BEGIN
                            SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id,
                            c.acad_session, c.sap_acad_session_id, c.credits, db.max_seats,db.available_seats, RTRIM(LTRIM(db.division)) AS division, t.faculty_id,
                            t.faculty_name, d.day_name, c.id AS course_lid,
                            CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                            CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime,
                            IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite
                            FROM [${slug}].timetable t 
                            INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                            INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                            INNER JOIN [dbo].days d ON d.id = t.day_lid
                            LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid AND sem.div_batch_lid IS NOT NULL
                            LEFT JOIN [${slug}].student_elective_bidding seb 
                            ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid 
                            AND seb.bidding_session_lid = @biddingId AND seb.active = 1 
                            AND (seb.is_confirmed = 1 OR seb.is_waitlisted = 1 OR seb.round_lid = @roundId)
                            WHERE db.available_seats = 0 AND seb.div_batch_lid IS NULL ORDER BY sem.is_favourite DESC
                            END`
            );
        });
    }

    static biddingCourse(slug, biddingId, studentId, round1Id, round2Id) {
    
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .input('round1Id', sql.Int, round1Id)
                .input('round2Id', sql.Int, round2Id)
                .query(`IF(SELECT COUNT(*) FROM [${slug}].round_settings 
                            WHERE round_lid = @round1Id AND GETDATE() >=  start_date_time AND GETDATE() <= end_date_time) > 0
                            BEGIN
                               SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                               c.sap_acad_session_id, c.credits, db.max_seats ,db.available_seats, RTRIM(LTRIM(db.division)) AS division,
                               t.faculty_id, t.faculty_name, d.day_name, c.id AS course_lid,
                               CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                               CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                               IIF(sem.is_favourite IS NULL, 0, sem.is_favourite) AS is_favourite
                               FROM [${slug}].timetable t 
                               INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                               INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                               INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                               INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                               INNER JOIN [dbo].days d ON d.id = t.day_lid
                               LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid AND sem.div_batch_lid IS NOT NULL
                               LEFT JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND (seb.is_confirmed = 1 OR seb.round_lid = @round1Id)
                               WHERE db.available_seats > 0 AND seb.div_batch_lid IS NULL
                               ORDER BY sem.is_favourite DESC;
                            END
                        ELSE IF (SELECT COUNT(*) FROM [${slug}].round_settings
                                 WHERE round_lid = @round2Id AND GETDATE() >= start_date_time AND GETDATE() <= end_date_time) > 0
                            BEGIN
                               SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                               c.sap_acad_session_id, c.credits, db.max_seats ,db.available_seats, RTRIM(LTRIM(db.division)) AS division,
                               t.faculty_id, t.faculty_name, d.day_name, c.id AS course_lid,
                               CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                               CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                               IIF(sem.is_favourite IS NULL, 0, sem.is_favourite) AS is_favourite
                               FROM [${slug}].timetable t 
                               INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                               INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                               INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                               INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                               INNER JOIN [dbo].days d ON d.id = t.day_lid
                               LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid AND sem.div_batch_lid IS NOT NULL
                               LEFT JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND (seb.is_confirmed = 1 OR seb.round_lid = @round2Id)
                               WHERE db.available_seats > 0 AND seb.div_batch_lid IS NULL
                               ORDER BY sem.is_favourite DESC;
                            END`);
        });
    }

    static addDropCourse(slug, biddingId, studentId) {
    
        let round1Id = 7;
        let round2Id = 8;
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentLid', sql.Int, studentId)
                .input('round1Id', sql.Int, round1Id)
                .input('round2Id', sql.Int, round2Id)
                .query(`IF(SELECT COUNT(*) FROM [${slug}].round_settings 
                            WHERE round_lid = @round1Id AND GETDATE() >=  start_date_time AND GETDATE() <= end_date_time) > 0
                            BEGIN
                                 SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                                 c.sap_acad_session_id, c.credits, db.max_seats ,db.available_seats, RTRIM(LTRIM(db.division)) AS division,
                                 t.faculty_id, t.faculty_name, d.day_name, c.id AS course_lid,
                                 CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                                 CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                                 IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite
                                 FROM [${slug}].timetable t 
                                 INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                                 INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                                 INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                                 INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                                 INNER JOIN [dbo].days d ON d.id = t.day_lid
                                 LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid AND sem.div_batch_lid IS NOT NULL
                                 LEFT JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND seb.is_confirmed = 1
                                 WHERE seb.div_batch_lid IS NULL AND db.available_seats > 0 
                                 ORDER BY sem.is_favourite DESC
                            END
                        ELSE IF (SELECT COUNT(*) FROM [${slug}].round_settings
                                 WHERE round_lid = @round2Id AND GETDATE() >= start_date_time AND GETDATE() <= end_date_time) > 0
                            BEGIN
                                 SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                                 c.sap_acad_session_id, c.credits, db.max_seats ,db.available_seats, RTRIM(LTRIM(db.division)) AS division,
                                 t.faculty_id, t.faculty_name, d.day_name, c.id AS course_lid,
                                 CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                                 CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                                 IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite
                                 FROM [${slug}].timetable t 
                                 INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                                 INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                                 INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                                 INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                                 INNER JOIN [dbo].days d ON d.id = t.day_lid
                                 LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentLid AND sem.div_batch_lid IS NOT NULL
                                 LEFT JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 AND seb.is_confirmed = 1  
                                 WHERE seb.div_batch_lid IS NULL AND db.available_seats > 0 
                                 ORDER BY sem.is_favourite DESC
                            END`);
        });
    }
    
    static areaList(slug, biddingId, acadSessionId) {
     
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT DISTINCT area_name 
                        FROM [${slug}].timetable t 
                        INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                        INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                        INNER JOIN [dbo].days d ON d.id = t.day_lid 
                        WHERE t.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId`);
        });
    }
    
    static getBiddingCourseByAcadSession(slug, biddingId, acadSessionId, studentId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .input('studentLid', sql.Int, studentId)
                .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                        c.credits, db.max_seats, db.division, t.faculty_id, t.faculty_name,  d.day_name, 
                        CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                        CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, c.sap_acad_session_id, 
                        c.id AS course_lid,
                        IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite 
                        FROM [sbm-mum].timetable t 
                        INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                        INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                        INNER JOIN [sbm-mum].division_batches db ON db.id = t.division_batch_lid 
                        INNER JOIN [sbm-mum].courses c ON c.id = db.course_lid
                        INNER JOIN [dbo].days d ON d.id = t.day_lid
                        LEFT JOIN [sbm-mum].student_elective_mapping sem ON sem.div_batch_lid = db.id AND sem.student_lid = @studentLid 
                        LEFT JOIN [sbm-mum].student_elective_bidding seb ON seb.div_batch_lid = db.id
                        WHERE c.sap_acad_session_id = @acadSessionId AND t.bidding_session_lid = @biddingId
                        ORDER BY sem.is_favourite DESC`);
        });
    }
    
    static getBiddingCourseByCourseId(slug, biddingId, acadSessionId, courseId ,studentId) {
        if (acadSessionId) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .input('courseId', sql.Int, courseId)
                    .input('studentLid', sql.Int, studentId)
                    .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, 
                            c.acad_session, c.credits, db.max_seats, db.division, t.faculty_id, t.faculty_name,  d.day_name,
                            c.sap_acad_session_id, c.id AS course_lid, 
                            CONVERT(VARCHAR, sit.start_time, 100) AS StartTime,
                            CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime,
                            IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite 
                            FROM [${slug}].timetable t 
                            INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                            INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                            INNER JOIN [dbo].days d ON d.id = t.day_lid
                            LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND sem.student_lid = @studentLid 
                            LEFT JOIN [${slug}].student_elective_bidding seb ON seb.div_batch_lid = db.id
                            WHERE c.sap_acad_session_id = @acadSessionId AND c.course_id = @courseId AND t.bidding_session_lid = @biddingId ORDER BY sem.is_favourite DESC`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('courseId', sql.Int, courseId)
                    .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, 
                            c.acad_session, c.credits, db.max_seats, db.division, t.faculty_id, t.faculty_name, d.day_name,
                            c.sap_acad_session_id, c.id AS course_lid,
                            CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                            CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime   
                            FROM [${slug}].timetable t 
                            INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                            INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                            INNER JOIN [dbo].days d ON d.id = t.day_lid 
                            WHERE c.course_id = @courseId AND t.bidding_session_lid = @biddingId`);
            });
        }
    }
    
    static getBiddingCourseByAreaName(slug, biddingId, acadSessionId, areaName ,studentId) {
       
        if (acadSessionId) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .input('areaName', sql.NVarChar, `%${areaName}%`)
                    .input('studentLid', sql.Int, studentId)
                    .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, 
                            c.acad_session, c.credits, db.max_seats, db.division, t.faculty_id, 
                            t.faculty_name, d.day_name, c.sap_acad_session_id, c.id AS course_lid,  
                            CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                            CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime,
                            IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite
                            FROM [${slug}].timetable t 
                            INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                            INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                            INNER JOIN [dbo].days d ON d.id = t.day_lid
                            LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND sem.student_lid = @studentLid 
                            LEFT JOIN [${slug}].student_elective_bidding seb ON seb.div_batch_lid = db.id 
                            WHERE c.area_name LIKE @areaName AND c.sap_acad_session_id = @acadSessionId AND 
                            t.bidding_session_lid = @biddingId ORDER BY sem.is_favourite DESC`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('areaName', sql.NVarChar, `%${areaName}%`)
                    .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, 
                            c.acad_session, c.credits, db.max_seats, db.division, t.faculty_id, t.faculty_name,
                            CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                            CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, d.day_name, c.sap_acad_session_id, 
                            c.id AS course_lid,
                            IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite 
                            FROM [${slug}].timetable t 
                            INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                            INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                            INNER JOIN [dbo].days d ON d.id = t.day_lid 
                            LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND sem.student_lid = @studentLid AND sem.div_batch_lid IS NOT NULL
                            WHERE c.area_name LIKE @areaName AND t.bidding_session_lid = @biddingId ORDER BY sem.is_favourite DESC`);
            });
        }
    }
    
    static courseList(slug, biddingId, acadSessionId) {
       
        if (acadSessionId) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .query(`SELECT DISTINCT c.course_id, c.course_name FROM [${slug}].timetable t
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId 
                            AND c.sap_acad_session_id = @acadSessionId`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT DISTINCT c.course_id, c.course_name 
                            FROM [${slug}].timetable t
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid 
                            WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId `);
            });
        }
    }
    
    static getCourseNameAreaWiseFilter(slug, biddingId, acadSessionId, areaName) {
        if (acadSessionId) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('acadSessionId', sql.Int, acadSessionId)
                    .input('areaName', sql.NVarChar, `%${areaName}%`)
                    .query(`SELECT DISTINCT c.course_id, c.course_name FROM [${slug}].timetable t
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND c.area_name LIKE @areaName`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('areaName', sql.NVarChar, `%${areaName}%`)
                    .query(`SELECT DISTINCT c.course_id, c.course_name FROM [${slug}].timetable t
                            INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                            INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId AND c.area_name LIKE @areaName`);
            });
        }
    }
    
    static addFavourite(slug, userid, biddingId, favJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), favJson)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_favourite]`);
        });
    }
    

    //Procedures code starts from here.
    static upload(slug, inputJson, userid, biddingId){
        return poolConnection.then(pool=>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJson))
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_division_batches]`)
        })
    }

    static update(inputJson, biddingId, userid, slug){
        return poolConnection.then(pool=>{
                return pool.request()
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_division_batches]`)
            })
    }

   static delete(divisionId, slug, biddingId, userid){
      return poolConnection.then(pool =>{
         return pool.request()
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('div_batch_lid', sql.Int, divisionId)
            .output('output_json',sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_division_batches]`)
        })
    }

    static deleteAll(slug, biddingId, userId, deleteDivisionBatchesIdJson){
        deleteDivisionBatchesIdJson = Object.keys(deleteDivisionBatchesIdJson).map(key => {
                const id = deleteDivisionBatchesIdJson[key];
                return { id: parseInt(id) }; 
        })
        return poolConnection.then(pool =>{
            return pool.request()
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(deleteDivisionBatchesIdJson))
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_division_batches]`)
        })
    }
}
