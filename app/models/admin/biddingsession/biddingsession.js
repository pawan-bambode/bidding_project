const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class BiddingSession{
      static getAllBiddingSession(slug,status) {
        slug = 'sbm_mum';
       if(status)
        return poolConnection.then(pool => {
            return pool.request()
            .query(`
            SELECT 
            bs.id, 
            RTRIM(LTRIM(bs.bidding_name)) AS biddingName,
            STRING_AGG(CONCAT(bas.acad_session, ':', bas.acad_session_lid), ',') AS acad_sessions_and_ids,
            bs.start_date, 
            bs.end_date 
        FROM [sbm_mum].bidding_session bs
        INNER JOIN [sbm_mum].bidding_acad_sessions bas ON bas.bidding_session_lid = bs.id 
        WHERE bs.active = 1  AND status = 1
        GROUP BY bs.id, bs.bidding_name, bs.start_date, bs.end_date;`);
        });
        else{
          return poolConnection.then(pool =>{
            return pool.request().query(`SELECT 
            bs.id, 
            RTRIM(LTRIM(bs.bidding_name)) AS biddingName,
            STRING_AGG(CONCAT(bas.acad_session, ':', bas.acad_session_lid), ',') AS acad_sessions_and_ids,
            bs.start_date, 
            bs.end_date 
        FROM [sbm_mum].bidding_session bs
        INNER JOIN [sbm_mum].bidding_acad_sessions bas ON bas.bidding_session_lid = bs.id 
        WHERE bs.active = 1 
        GROUP BY bs.id, bs.bidding_name, bs.start_date, bs.end_date;`);
          })
        }
    }
    static save(inputJSON, slug, userid) {
        return poolConnection.then(pool => { 
            const request = pool.request();
            return request.input('input_json', sql.NVarChar(sql.MAX),inputJSON)
                .input('last_modified_by', sql.Int, userid)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_bidding_session]`)
        })
    }
    static delete(id,slug,userid){
      return poolConnection.then(pool =>{
        return pool.request().input('last_modified_by',sql.Int,userid)
        .input('input_bidding_session_lid',sql.Int,id)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_bidding_session]`)
      })
    }
    static update(inputJSON,biddingSessionId,slug,userid){
      return poolConnection.then(pool =>{
        return pool.request().input('input_json',sql.NVarChar(sql.MAX),inputJSON)
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingSessionId)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_bidding_session]`);
      })
    }
    static getBiddingSessionList(slug){
      slug = 'sbm_mum';
      return poolConnection.then(pool =>{
        return pool.request()
        .query(`SELECT id, bidding_name ,active, status FROM [${slug}].bidding_session WHERE active = 1`);
      })
    }
    static updateBiddingSession(slug,inputJSON){
      
      return poolConnection.then(pool =>{
        return pool.request()
        .input('input_json', sql.NVarChar(sql.MAX),inputJSON)
        .output('output_json', sql.NVarChar(sql.MAX))
        .output('output_flag', sql.Bit)
        .execute(`[${slug}].sp_activate_bidding_session`)
      })
    }
}