const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');
module.exports = class BiddingRound
{
 static getBiddingRounds(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT id,round_name,total_students,total_courses, FORMAT(end_date_time, 'dd MMM yyyy, hh:mm tt') AS end_date_time,FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1`);
    })
 }
 static getPredefineBiddingRounds(slug){
    return poolConnection.then(pool =>{
        return pool.request()
        .query(`SELECT pbr.id,pbr.bidding_round_name FROM [${slug}].predefine_bidding_rounds pbr
        LEFT JOIN [${slug}].round_settings rs ON rs.bidding_round_lid = pbr.id WHERE  (rs.round_name IS NULL  OR rs.active = 0)`)
    })
 }
 static getStudentsBiddingRounds(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT *  FROM [${slug}].student_data sd INNER JOIN [sbm-mum].programs p ON p.program_id = sd.program_id
        WHERE sd.bidding_session_lid = @biddingId`)
    })
 }
 static getCouresBiddingRounds(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT * FROM [${slug}].courses WHERE bidding_session_lid = @biddingId`)
    })
 }
 static save(inputJSON, slug, userid,biddingId) {
    return poolConnection.then(pool => {
        return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid',sql.Int,biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_round_settings]`)
    })
}
static delete(programlid,slug,userId,biddingSessionId){
    return poolConnection.then(pool =>{
        return pool.request().input('input_round_lid',sql.Int,programlid).
        input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingSessionId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_round_settings]`)
    })
}
}