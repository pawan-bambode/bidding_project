const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class Area {
   static getAreaList(slug, biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT * FROM [${slug}].areas WHERE bidding_session_lid = @biddingId`);
    })
   }
   static getCount(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT COUNT(*) FROM [${slug}].areas WHERE bidding_session_lid = @biddingId`);
    })
   }
   
   static refresh(slug,biddingId,userid){
    return poolConnection.then(pool =>{
        return pool.request().
        input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int,biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_areas]`)
       
    })
   }
}