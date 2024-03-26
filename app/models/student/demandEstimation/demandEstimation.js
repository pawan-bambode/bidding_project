const { urlencoded } = require('express');
const { sql, poolConnection } = require('../../../../config/db');

module.exports = class DemandEstimation {
    static getDemandEstimationRoundList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('demand', sql.NChar, 'DEMAND_ESTIMATION_ROUND')
                .query(`SELECT id, SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, 
                        LEN(round_name)) AS DemandEstimation
                        FROM [${slug}].round_settings WHERE active = 1 AND bidding_session_lid = @biddingId AND round_name LIKE '%' + @demand + '%'`);
        });
    }

    static getCourseListByAcadSession(slug, biddingId, acadSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT c.*, p.program_name 
                        FROM [${slug}].courses c 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                        WHERE c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND c.active = 1 ORDER BY c.id`);
        });
    }

    static getCourseCountByAcadSession(slug, biddingId, acadSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT COUNT(*) AS count 
                        FROM [${slug}].courses c 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id 
                        WHERE c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND c.active = 1`);
        });
    }
    
    static getAreaList(slug, biddingId, acadSessionId, roundId, studentId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .input('roundId', sql.Int, roundId)
                .input('studentId', sql.Int, studentId)      
                .query(`SELECT DISTINCT c.area_name
                        FROM [${slug}].timetable t 
                        INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                        INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                        INNER JOIN [dbo].days d ON d.id = t.day_lid
                        LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND student_lid = @studentId AND sem.div_batch_lid IS NOT NULL
                        LEFT JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentId AND seb.bidding_session_lid = @acadSessionId AND seb.active = 1 AND (seb.is_confirmed = 1 OR seb.round_lid = @roundId)
                        WHERE db.available_seats > 0 AND seb.div_batch_lid IS NULL AND c.sap_acad_session_id = @acadSessionId`);
        });
    }

    static isStudentPartOfRound (slug, biddingId, studentId, roundId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentId', sql.Int, studentId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT * FROM [${slug}].student_round_mapping 
                        WHERE round_lid = @roundId AND student_lid = @studentId AND active = 1 AND 
                        bidding_session_lid = @biddingId`);
        });
    }
    

    static coursesByArea(slug, biddingId, acadSessionId, areaName) {

        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .input('areaName', sql.NVarChar, `%${areaName}%`)
                .query(`SELECT c.*, p.program_name 
                        FROM [${slug}].courses c 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                        WHERE c.sap_acad_session_id = @acadSessionId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND c.area_name LIKE @areaName ORDER BY c.id`);
        });
    }

    static coursesByAreaCount(slug, biddingId, acadSessionId, areaName) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .input('areaName', sql.NVarChar, `%${areaName}%`)
                .query(`SELECT COUNT(*) AS count 
                        FROM [${slug}].courses c 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id 
                        WHERE c.sap_acad_session_id = @acadSessionId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND c.area_name LIKE @areaName`);
        });
    }

    static searchByLetter(slug, biddingId, letterSearch, pageNo, showEntry, acadSessionId, area) {
        if (pageNo) {
            if (acadSessionId && area) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('area', sql.NVarChar, `%${area}%`)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction, c.sap_acad_session_id
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND c.sap_acad_session_id = @acadSessionId AND c.area_name LIKE @area AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            } else if (acadSessionId) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction ,c.sap_acad_session_id
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND c.sap_acad_session_id = @acadSessionId AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            } else {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, 
                                ad.acad_session, area_name, min_demand_criteria, year_of_introduction, 
                                c.sap_acad_session_id
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                });
            }
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('bidding_session_lid', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                            area_name, min_demand_criteria, year_of_introduction, c.sap_acad_session_id
                            FROM [${slug}].courses c
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch)
                    `);
            });
        }
    }

    static getCounts(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*)
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`);
        });
    }
    
    static getSelectedCourses(slug, biddingId, studentId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentId', sql.Int, studentId)
                .query(`SELECT c.id, c.area_name, c.course_name, c.acad_session, c.credits,
                        c.sap_acad_session_id 
                        FROM [${slug}].demand_estimation de 
                        INNER JOIN [${slug}].courses c ON c.id = de.course_lid WHERE de.student_lid = @studentId AND de.active = 1 AND c.active = 1`);
        });
    }

    static completedCourses(slug, biddingId, username) {
       
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('sapId', sql.NVarChar, username)
                .query(`SELECT cc.id, cc.course_name 
                        FROM [${slug}].completed_courses cc 
                        WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND cc.sap_id = @sapId`)
        });
    }

    static getFavouriteCourseList(slug, biddingId, studentId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentId', sql.Int, studentId)
                .query(`SELECT sem.*, db.course_id FROM [${slug}].student_elective_mapping sem
                        INNER JOIN [${slug}].division_batches db ON sem.div_batch_lid = db.id
                        WHERE sem.student_lid = @studentId AND sem.bidding_session_lid = @biddingId AND is_favourite = 1`);
        });
    }
    static getAvailableCourseList(slug, biddingId) {
       
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.id, course_name, credits, program_id, 
                        ad.acad_session, area_name, min_demand_criteria, year_of_introduction, 
                        c.sap_acad_session_id
                        FROM [${slug}].course_round_mapping crm 
                        INNER JOIN [${slug}].courses c ON crm.course_lid = c.id
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        LEFT JOIN [${slug}].demand_estimation de ON c.id = de.course_lid AND c.active = 1
                        AND c.bidding_session_lid = @biddingId AND de.bidding_session_lid = @biddingId
                        AND de.active = 1 WHERE de.course_lid IS NULL ORDER BY c.id`);
       
        });
    }
    
    static getAvailableCourseCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) AS count
                        FROM [${slug}].courses c 
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`);
        });
    }

    static save(slug, biddingId, userid, student_lid, round_lid, selectedCourseJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(selectedCourseJson))
                .input('student_lid', sql.Int, student_lid)
                .input('round_lid', sql.Int, round_lid)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_demand]`);
        });
    } 
}
