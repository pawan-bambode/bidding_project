const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');

module.exports =  class Program {
 static getAllProgram(req,res){
    return poolConnection.then(pool =>{
        return pool.request()
        .query(`SELECT id, RTRIM(LTRIM(program_name)) AS program_name, RTRIM(LTRIM(abbr)) AS abbr, RTRIM(LTRIM(ISNULL(program_code,'NA'))) program_code  FROM [sbm_mum].programs WHERE active = 1`);
    })
 }
 static getAllProgramFromDbo(req,res,abbr){
    abbr = 'SBM-NM-M';
    return poolConnection.then(pool =>{
        return pool.request().input('abbr',sql.NVarChar,abbr).query(`SELECT RTRIM(LTRIM(dboP.program_name))AS program_name, RTRIM(LTRIM(dboP.abbr)) as abbr,dboP.program_id FROM [dbo].programs dboP  WHERE dboP.program_id NOT IN(SELECT program_id FROM [sbm_mum].programs WHERE active = 1)
         AND dboP.abbr = @abbr`);
    })
 }
 static save(inputJSON, slug, userid,biddingId) {
    return poolConnection.then(pool => {
        return pool.request().input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid',sql.Int,biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_import_programs]`)
    })
}
static update(inputJSON,slug,userid,biddingSessionId){
    return poolConnection.then(pool =>{
        return pool.request().input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(inputJSON))
        .input('last_modified_by', sql.Int, userid)
        .input('bidding_session_lid',sql.Int,biddingSessionId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_programs]`)
    })
}
static delete(programlid,slug,userId,biddingSessionId){
    return poolConnection.then(pool =>{
        return pool.request().input('input_program_lid',sql.Int,programlid).
        input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingSessionId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_programs]`)
    })
}
}