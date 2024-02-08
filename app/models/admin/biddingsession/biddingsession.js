const { sql, poolConnection } = require('../../../../config/db');

module.exports = class BiddingSession {
  
    static allBiddingSession(slug, status) {
        if (status) { 
            return poolConnection.then(pool => {
                return pool.request()
                    .query(`SELECT bs.id , RTRIM(LTRIM(bs.bidding_name)) AS biddingName, 
                            STRING_AGG(CONCAT(bas.acad_session, ':', bas.acad_session_lid), ',') AS acad_sessions_and_ids, bs.start_date, bs.end_date, sd.student_count, c.course_count, ps.max_credits, ps.min_credits 
                            FROM [${slug}].bidding_session bs
                            INNER JOIN [${slug}].bidding_acad_sessions bas ON bas.bidding_session_lid = bs.id 
                            LEFT JOIN (SELECT count(*) as student_count, sd.bidding_session_lid 
                            FROM [${slug}].student_data sd WHERE sd.active = 1
                            GROUP BY bidding_session_lid) sd ON sd.bidding_session_lid = bs.id
                            LEFT JOIN (SELECT count(*) as course_count, c.bidding_session_lid 
                            FROM [${slug}].courses c WHERE c.active = 1
                            GROUP BY bidding_session_lid) c ON c.bidding_session_lid = bs.id  
                            LEFT JOIN (SELECT sum(ps.max_credits) as max_credits, sum(ps.min_credits) AS min_credits, ps.bidding_session_lid 
                            FROM [${slug}].program_sessions ps  WHERE ps.active = 1 GROUP BY bidding_session_lid, ps.program_id) ps ON ps.bidding_session_lid = bs.id  
                            WHERE bs.active = 1 AND bs.status = 1
                            GROUP BY bs.id, bs.bidding_name, bs.start_date, bs.end_date,sd.student_count,c.course_count,ps.max_credits,ps.min_credits`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .query(`SELECT bs.id, RTRIM(LTRIM(bs.bidding_name)) AS biddingName,
                            STRING_AGG(CONCAT(bas.acad_session, ':', bas.acad_session_lid), ',') AS acad_sessions_and_ids, bs.start_date, bs.end_date 
                            FROM [${slug}].bidding_session bs
                            INNER JOIN [${slug}].bidding_acad_sessions bas ON bas.bidding_session_lid = bs.id 
                            WHERE bs.active = 1 
                            GROUP BY bs.id, bs.bidding_name, bs.start_date, bs.end_date`);
            });
        }
    }

    static acadSessionList(biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingSessionId', sql.Int, biddingId)
                .query(`SELECT id, sap_acad_session_id, acad_session FROM [dbo].acad_sessions`);
        });
    }

    static activeList(slug) {
        return poolConnection.then(pool => {
            return pool.request()
                .query(`SELECT id, bidding_name ,active, status FROM [${slug}].bidding_session WHERE active = 1`);
        });
    }

    // Procedures code starts from here
    static create(inputJSON, slug, userid) {
        return poolConnection.then(pool => { 
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
                .input('last_modified_by', sql.Int, userid)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_bidding_session]`);
        });
    }

    static delete(id, slug, userid) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userid)
                .input('input_bidding_session_lid', sql.Int, id)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_bidding_session]`);
        });
    }

    static update(inputJSON, biddingSessionId, slug, userid) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_bidding_session]`);
        });
    }

    static updateStatus(slug, inputJSON, userId) {  
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
                .input('last_modified_by', sql.Int, userId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .output('output_flag', sql.Bit)
                .execute(`[${slug}].sp_activate_bidding_session`);
        });
    }
}
