const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');

module.exports = class ProgramSession{
    static  getAllProgramSessions(req,res,slug){
        slug = 'sbm_mum';
        return poolConnection.then(pool =>{
            return pool.request().query(`SELECT ps.id ,p.program_name,ad.acad_session,bs.year, IIF(ps.min_credits IS NULL, 0, ps.min_credits) AS min_credits,IIF(ps.max_credits IS NULL, 0, ps.max_credits) AS max_credits FROM [${slug}].program_sessions ps 
            INNER JOIN [${slug}].programs p ON ps.program_id = p.program_id
            INNER JOIN [${slug}].bidding_session bs ON ps.bidding_session_lid = bs.id
            INNER JOIN [dbo].acad_sessions ad ON ps.sap_acad_session_id = ad.sap_acad_session_id`);
        })
    }
    static refresh(slug,biddingId,userid) {
        slug = 'sbm_mum';
        return poolConnection.then(pool => {
            const request = pool.request();
            return request
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int,biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_program_sessions]`)
        })
    }
    static update(inputJSON,slug,biddingId,userid){
        slug = 'sbm_mum';
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json',sql.NVarChar,JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int,biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_program_session_credits]`)
        })
    }
}