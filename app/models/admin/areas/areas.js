const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class Area {
   static getAreaList(slug){
    slug = 'sbm_mum';
    return poolConnection.then(pool =>{
        return pool.request()
        .query(`SELECT * FROM [${slug}].areas`);
    })
   }
   static refresh(slug,biddingId,userid){
    slug = 'sbm_mum';
    return poolConnection.then(pool =>{
        return pool.request().
        input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int,biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_areas]`)
       
    })
   }
}