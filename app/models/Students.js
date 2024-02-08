const { sql, poolConnection } = require('../../config/db');

module.exports = class Students {

    static studentDetail(slug, biddingId, username) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('username', sql.NVarChar, username)
                .query(`SELECT sd.id, sd.sap_id, roll_no, sd.student_name, email, sd.bid_points,
                        year_of_joining, sd.previous_elective_credits, 
                        IIF(sd.concentration_lid IS NULL, 0, sd.concentration_lid) AS concentration, 
                        LOWER(c.concentration_name) AS concentrationName
                        FROM [${slug}].student_data sd
                        INNER JOIN [${slug}].concentration c ON c.id = sd.concentration_lid 
                        WHERE email = @username AND sd.active = 1`);
        });
    }

    static concentrationList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT id, concentration_name 
                        FROM [${slug}].concentration WHERE bidding_session_lid = @biddingId`);
        });
    }

    static confirmaCourseList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.course_name, c.credits  
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        WHERE seb.bidding_session_lid = @biddingId AND seb.is_confirmed = 1`);
        });
    }

    static confirmCreditsCounts(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT IIF(SUM(c.credits) IS NULL, 0, SUM(c.credits)) AS total_confirm_credits 
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        WHERE seb.bidding_session_lid = @biddingId AND seb.is_confirmed = 1`);
        });
    }

    static completedCourseList(slug, biddingId, username) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('sapId', sql.NVarChar, username)
                .query(`SELECT cc.id, cc.course_name 
                        FROM [${slug}].completed_courses cc 
                        WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND cc.sap_id = @sapId`)
                .then(result => {
                    return result.recordset;
                })
                .catch(err => {
                    throw err;
                });
        });
    }

    static dropCourseList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.course_name, c.credits 
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        WHERE seb.bidding_session_lid = @biddingId AND seb.is_dropped = 1`);
        });
    }

    static winningCourseList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.course_name, c.credits 
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id 
                        WHERE seb.bidding_session_lid = @biddingId AND 
                        (seb.is_winning = 1 AND seb.is_confirmed = 0) OR 
                        (seb.is_winning = 1 AND seb.is_dropped = 0 AND seb.is_confirmed = 0)`);
        });
    }

    static waitListCouresList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.course_name, c.credits 
                        FROM [${slug}].student_elective_bidding seb 
                        INNER JOIN [${slug}].division_batches db ON db.id = seb.div_batch_lid
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id 
                        WHERE seb.bidding_session_lid = @biddingId AND seb.is_waitlisted = 1`);
        });
    }

    static getSlotForShowTimetable() {
        return poolConnection.then(pool => {
            return pool.request()
                .query(`SELECT MIN(start_slot_lid) AS start_time_lid, MAX(end_slot_lid) AS end_time_lid 
                        FROM [sbm-mum].timetable`);
        });
    }

    static getDistintRoomList() {
        return poolConnection.then(pool => {
            return pool.request()
                .query(`SELECT DISTINCT room_no FROM [sbm-mum].timetable`);
        });
    }

    static getTimeslot() {
        return poolConnection.then(pool => {
            return pool.request()
                .query(`SELECT CONVERT(NVARCHAR, start_time, 0) as start_time,
                        CONVERT(NVARCHAR, end_time, 0) as end_time 
                        FROM [Infra_bidding_latest].[dbo].slot_interval_timings`);
        });
    }

    static couresListSelectedByStudent(student_lid) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('student_id', sql.NVarChar, student_lid)
                .query(`SELECT * FROM [sbm-mum].student_elective_mapping sem 
                        INNER JOIN [sbm-mum].student_data sd ON sem.student_lid = sd.id 
                        WHERE sap_id = @student_id AND sd.active = 1`);
        });
    }

    static getDemandEstimationAreaList(slug, acadSessionId, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('acadSessionId', sql.Int, acadSessionId)
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT DISTINCT area_name 
                        FROM [${slug}].courses 
                        WHERE sap_acad_session_id = @acadSessionId AND active = 1 AND bidding_session_lid = @biddingId`);
        });
    }

    static coursesCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) AS count 
                        FROM [${slug}].courses c 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id 
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`);
        });
    }

    static getSlotDayId(day_lid) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('day_lid', sql.Int, day_lid)
                .query(`SELECT DISTINCT end_slot_lid,
                        CONCAT(start_slot_lid, '-', end_slot_lid) as slot_value, start_slot_lid 
                        FROM [sbm-mum].timetable 
                        WHERE day_lid = @day_lid 
                        ORDER BY end_slot_lid`);
        });
    }

    // Procedures code starts from here.
    static saveSpecialization(slug, selectConcentration, biddingId, UserId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), selectConcentration)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('last_modified_by', sql.Int, UserId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].sp_select_specialization`);
        });
    }

    static saveStudentDetails(inputJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[dbo].[sp_add_student_details]`);
        });
    }

    static createStudentCredentials(inputJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJson))
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[dbo].[sp_generate_student_credentials]`);
        });
    }

    static subjectAdded(inputJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .input('last_modified_by', sql.Int, 15048)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[dbo].add_student_subjects`);
        });
    }

    static updateSubject(inputJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .input('last_modified_by', sql.Int, 15048)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[dbo].update_student_subjects`);
        });
    }

}
