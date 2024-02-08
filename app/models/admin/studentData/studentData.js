const { sql, poolConnection } = require('../../../../config/db');

module.exports = class StudentsData {

    static getList(slug,biddingId) {
        let showEntry = 10;
       return poolConnection.then(pool => {
           return pool.request()
           .input('biddingId',sql.Int,biddingId)
           .query(`SELECT TOP ${showEntry} sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, 
                   p.program_name, sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                   FROM [${slug}].student_data sd 
                   INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND 
                   p.bidding_session_lid= @biddingId  AND sd.bidding_session_lid = @biddingId AND p.active = 1`)
       })
   }

   static getCount(slug,biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND  p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId`)
        })
    }
    static programList(slug,biddingId) {
    return poolConnection.then(pool => {
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT p.program_id,p.program_name
                FROM [${slug}].student_data sd 
                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND 
                p.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId GROUP BY p.program_id,p.program_name`)
    })
    }


    static showEntry(slug, biddingId, showEntry, programId) {
        if (programId) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .query(`SELECT TOP ${showEntry} sd.id, sd.sap_id, sd.roll_no, sd.student_name, 
                            sd.email, p.program_name, sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT TOP ${showEntry} sd.id, sd.sap_id, sd.roll_no, sd.student_name, 
                            sd.email, p.program_name, sd.bid_points,sd.year_of_joining, sd.previous_elective_credits
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId`);
            });
        }
    }

    static showEntryCount(slug, biddingId, programId) {
        if (programId) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId`);
            });
        }
    }
    
    static updatePassword(userName, newPassword) {
        return poolConnection.then(pool => {
            return pool.request().
            query(`UPDATE users SET password = '${newPassword}' WHERE username = '${userName}'`)
        })
    }
    
    static search(slug, biddingId, letterSearch, programId, pageNo, showEntry) {
        showEntry = showEntry ? showEntry : 10;
        if (programId !== '-1') {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, p.program_name,
                            sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT TOP ${showEntry} sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email,
                            p.program_name, sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId  AND sd.bidding_session_lid = @biddingId AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`);
            });
        }
    }

    static searchCount(slug, biddingId, letterSearch, programId) {
        if (programId !== '-1') {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .input('programId', sql.Int, programId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch) `);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND p.bidding_session_lid= @biddingId  AND sd.bidding_session_lid = @biddingId AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`);
            });
        }
    }

    static searchByletter(slug, biddingId, letterSearch, pageNo, showEntry) {
        if (pageNo) {
            if (letterSearch) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, 
                                p.program_name, sd.bid_points, sd.year_of_joining, 
                                sd.previous_elective_credits
                                FROM [${slug}].student_data sd 
                                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                                WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1' AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch) ORDER BY sd.id OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            } else {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, 
                                p.program_name,sd.bid_points,sd.year_of_joining ,sd.previous_elective_credits
                                FROM [${slug}].student_data sd 
                                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id AND p.bidding_session_lid = @bidding_session_lid
                                WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1' ORDER BY sd.id OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            }
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('bidding_session_lid', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT sd.id, sd.sap_id, sd.roll_no, sd.student_name, sd.email, p.program_name,
                            sd.bid_points, sd.year_of_joining, sd.previous_elective_credits
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                            WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1'AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE  @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`);
            });
        }
    }

    static searchByletterCount(slug, biddingId, letterSearch, pageNo) {
        if (pageNo) {
            if (letterSearch) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT COUNT(*)
                                FROM [${slug}].student_data sd 
                                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                                WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1' AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE  @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch) ORDER BY sd.id OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            } else {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT COUNT(*)
                                FROM [${slug}].student_data sd 
                                INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                                WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1' ORDER BY sd.id OFFSET (@pageNo - 1) * 10 ROWS FETCH NEXT 10 ROWS ONLY`);
                });
            }
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('bidding_session_lid', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].student_data sd 
                            INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                            WHERE sd.bidding_session_lid = @bidding_session_lid AND sd.active = '1'AND (sd.sap_id LIKE @letterSearch OR sd.student_name LIKE @letterSearch OR sd.roll_no LIKE @letterSearch OR sd.email LIKE @letterSearch OR p.program_name LIKE @letterSearch OR sd.bid_points LIKE @letterSearch OR sd.year_of_joining LIKE @letterSearch)`);
            });
        }
    }

    static listByProgramId(slug, biddingId, programId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT TOP ${showEntry} sd.sap_id, sd.roll_no, sd.student_name, sd.email,
                        p.program_name,sd.bid_points,sd.year_of_joining
                        FROM [${slug}].student_data sd
                        INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                        WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId ORDER BY sd.id`);
        });
    }

    static studentIdByProgramId(slug, biddingId, programId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT sap_id, student_name
                        FROM [${slug}].student_data sd
                        INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                        WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId ORDER BY sd.id`);
        });
    }

    static listByProgramIdCount(slug, biddingId, programId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT COUNT(*)
                        FROM [${slug}].student_data sd
                        INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                        WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId`);
        });
    }

    static listByStudentId(slug, biddingId, programId, showEntry, sapId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sapId', sql.NVarChar(sql.MAX), sapId)
                .query(`SELECT TOP ${showEntry} sd.sap_id, sd.roll_no, sd.student_name, sd.email,
                        p.program_name,sd.bid_points,sd.year_of_joining
                        FROM [${slug}].student_data sd
                        INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id 
                        WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND sd.sap_id = @sapId`);
        });
    }

    static listByStudentIdCount(slug, biddingId, programId, sapId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sapId', sql.NVarChar(sql.MAX), sapId)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].student_data sd 
                        INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id WHERE sd.active = 1 AND sd.bidding_session_lid = @biddingId AND p.program_id = @programId AND p.bidding_session_lid = @biddingId AND sd.sap_id = @sapId`);
        });
    }

    // Procedures code starts from here.
    static uploadStudentRawData(slug, studetRawData, userId, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), studetRawData)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].sp_upload_student_data`);
        });
    }

    static refresh(slug, biddingId, userid) {
        return poolConnection.then(pool => {
            const request = pool.request();
            return request
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_student_data]`);
        });
    }

    static update(slug, biddingId, userid, responseJson) {
        return poolConnection.then(pool => {
            const request = pool.request();
            return request
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(responseJson))
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_student_data]`);
        });
    }

    static delete(studentId, slug, userId, biddingSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_student_lid', sql.Int, studentId)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_student_data]`);
        });
    }

    static save(studentData, slug, userId, biddingSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_student_data', sql.NVarChar(sql.MAX), JSON.stringify(studentData))
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_save_student_data]`);
        });
    }
};
