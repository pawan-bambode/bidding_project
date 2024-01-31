const {sql,poolConnection} = require('../../../../config/db')

module.exports = class BiddingRound
{
    static getBiddingRounds(slug, biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT id, round_lid, round_name, total_students, total_courses, 
                    FORMAT(end_date_time, 'dd MMM  yyyy, hh:mm tt') AS end_date_time, FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time 
                    FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1`);     
        })
    }

    static getPredefineBiddingRounds(slug){
        return poolConnection.then(pool =>{
            return pool.request()
            .query(`SELECT esr.id, esr.round_name FROM [dbo].elective_selection_rounds esr 
                    WHERE esr.id NOT IN( SELECT rs.round_lid
                    FROM [${slug}].round_settings rs
                    INNER JOIN [${slug}].bidding_session bs ON bs.id = rs.bidding_session_lid
                    WHERE rs.active = 1 AND bs.status = 1 )`);
        })
    }

    static getStudentsBiddingRounds(slug, biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT sd.id AS student_lid, * FROM [${slug}].student_data sd 
                    INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                    WHERE sd.bidding_session_lid = @biddingId AND p.active = 1`);
        })
    }

    static getCouresBiddingRounds(slug, biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT c.* FROM [${slug}].courses c 
                    INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                    WHERE c.bidding_session_lid = 16 AND p.active = 1`);
        })
    }

    static save(inputJSON, slug, userid, biddingId) {
     
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid',sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_round_settings]`)
        })
    }

    static delete(roundId, slug, userId, biddingSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_round_lid', sql.Int, roundId)
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_round_settings]`)
        })
    }

    static update(inputJSON, slug, userid, biddingSessionId){

        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid',sql.Int, biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_round_settings]`)
       })
    }

    static search(slug, biddingId, letterSearch, pageNo, showEntry) {
        
        if(pageNo){
            return poolConnection.then(pool => {
                return pool.request()
                    .input('pageNo', sql.Int, pageNo)
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT id, round_lid, round_name, total_students, total_courses, 
                            FORMAT(end_date_time, 'dd MMM  yyyy, hh:mm tt') AS end_date_time, FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time 
                            FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND (round_name LIKE @letterSearch OR total_students LIKE @letterSearch OR total_courses LIKE @letterSearch OR end_date_time LIKE @letterSearch OR start_date_time LIKE @letterSearch) ORDER BY cc.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
            })
        }
        else{
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT id, round_lid, round_name, total_students, total_courses, 
                            FORMAT(end_date_time, 'dd MMM  yyyy, hh:mm tt') AS end_date_time, FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time 
                            FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND (round_name LIKE @letterSearch OR total_students LIKE @letterSearch OR total_courses LIKE @letterSearch OR end_date_time LIKE @letterSearch OR start_date_time LIKE @letterSearch)`);
            })
        }
    }

    static getCountSearch(slug, biddingId, letterSearch, pageNo, showEntry) {
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('biddingId', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT count(*)
                                FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND (round_name LIKE @letterSearch OR total_students LIKE @letterSearch OR total_courses LIKE @letterSearch OR end_date_time LIKE @letterSearch OR start_date_time LIKE @letterSearch)`);
                })
        }     
}