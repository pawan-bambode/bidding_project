const { sql, poolConnection } = require('../../../../config/db');

module.exports = class completedCourses {

    static getList(slug, biddingId, showEntry) {
        showEntry = showEntry ? showEntry : 10;
        return poolConnection.then(pool => {
            return pool.request() 
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${showEntry} cc.id, sd.student_name, cc.course_name 
                        FROM [${slug}].completed_courses cc 
                        INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId
                        ORDER BY cc.id`);
        });
    }

    static getCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) FROM [${slug}].completed_courses cc 
                        INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId`);
        });
    }

    static searchCount(slug, biddingId, letterSearch, pageNo, showEntry) {
        if (pageNo) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('pageNo', sql.Int, pageNo)
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT COUNT(*)
                            FROM [${slug}].completed_courses cc 
                            INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId AND (sd.student_name LIKE @letterSearch OR cc.course_name like @letterSearch)`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT COUNT(*) 
                            FROM [${slug}].completed_courses cc 
                            INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId AND (sd.student_name LIKE @letterSearch OR cc.course_name like @letterSearch)`);
            });
        }
    }

    static search(slug, biddingId, letterSearch, pageNo, showEntry) {
        if (pageNo) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('pageNo', sql.Int, pageNo)
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT cc.id, sd.student_name, cc.course_name 
                            FROM [${slug}].completed_courses cc 
                            INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId AND (sd.student_name LIKE @letterSearch OR cc.course_name like @letterSearch) ORDER BY cc.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT TOP ${showEntry} cc.id, sd.student_name, cc.course_name 
                            FROM [${slug}].completed_courses cc 
                            INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId AND (sd.student_name LIKE @letterSearch OR cc.course_name like @letterSearch)`);
            });
        }
    }

    static showEntry(slug, biddingId, showEntry, pageNo) {
        if (pageNo) {
            return poolConnection.then(pool => {
                return pool.request() 
                    .input('biddingId', sql.Int, biddingId)
                    .input('pageNo', sql.Int, pageNo)
                    .query(`SELECT cc.id, sd.student_name, cc.course_name 
                            FROM [${slug}].completed_courses cc 
                            INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId
                            WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId
                            ORDER BY cc.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request() 
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT TOP ${showEntry} cc.id, sd.student_name, cc.course_name 
                            FROM [${slug}].completed_courses cc 
                            INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId`);
            });
        }
    }

    static showEntryCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request() 
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].completed_courses cc 
                        INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId`);
        });
    }

    static getProgramList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('bidding_session_lid', sql.Int, biddingId)
                .query(`SELECT p.program_name,p.program_id 
                        FROM [${slug}].courses c
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id WHERE c.active = 1 AND p.bidding_session_lid = @bidding_session_lid GROUP BY p.program_id,program_name`);
        });
    }

    static filterByProgramId(slug, biddingId, programId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, 
                        area_name, min_demand_criteria, year_of_introduction
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId
                        ORDER BY c.id`);
        });
    }

    static getCountfilterByProgramId(slug, biddingId, programId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT COUNT(*)
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId`);
        });
    }

    static sessionByProgramId(slug, biddingId, programId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .query(`SELECT TOP ${showEntry} ad.id, ad.sap_acad_session_id, ad.acad_session
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId
                        GROUP BY ad.id, ad.sap_acad_session_id, ad.acad_session ORDER BY ad.id`);
        });
    }

    static filterBySessionId(slug, biddingId, programId, sessionId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, 
                        area_name, min_demand_criteria, year_of_introduction
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId ORDER BY c.id`);
        });
    }

    static getCountFilterBySessionId(slug, biddingId, programId, sessionId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .query(`SELECT COUNT(*)
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId`);
        });
    }

    static moduleBySessionId(slug, biddingId, programId, sessionId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .query(`SELECT TOP ${showEntry} c.id,c.course_id,c.course_name
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId GROUP BY c.id, c.course_id, c.course_name ORDER BY c.id`);
        });
    }

    static filterByCourseId(slug, biddingId, programId, sessionId, courseId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .input('courseId', sql.Int, courseId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, 
                        area_name, min_demand_criteria, year_of_introduction
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId AND c.course_id = @courseId ORDER BY c.id`);
        });
    }

    static getCountFilterByCourseId(slug, biddingId, programId, sessionId, courseId, showEntry) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('programId', sql.Int, programId)
                .input('sessionId', sql.Int, sessionId)
                .input('courseId', sql.Int, courseId)
                .query(`SELECT COUNT(*) FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId AND c.course_id = @courseId`);
        });
    }

    // Procedures code starts from here
    static upload(slug, inputJson, userId, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJson))
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_upload_completed_courses]`);
        });
    }

    static delete(courseId, slug, biddingId, userId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('course_lid', sql.Int, courseId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_courses]`);
        });
    }

    static update(inputJson, biddingId, userId, slug) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid',  sql.Int, biddingId)
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_courses]`);
        });
    }

    static deleteAll(slug, biddingId, userId, deleteCompletedCoursesIdJson) {
        deleteCompletedCoursesIdJson = Object.keys(deleteCompletedCoursesIdJson).map(key => {
            const id = deleteCompletedCoursesIdJson[key];
            return { id: parseInt(id) }; 
        });
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(deleteCompletedCoursesIdJson))
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_all_completed_courses]`);
        });
    }

};
