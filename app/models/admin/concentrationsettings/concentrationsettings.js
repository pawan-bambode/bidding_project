const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports =  class ConcentrationSettigs{

 static getConcentrationSettingsList(slug){
    
    return poolConnection.then(pool =>{
        return pool.request()
        .query(`SELECT id,concentration_name ,IIF(total_elective_credits IS NULL,0,total_elective_credits) AS total_elective_credits  ,IIF(max_credits_per_area IS NULL,0,max_credits_per_area) AS max_credits_per_area ,IIF(no_of_areas_to_cover IS NULL,0,no_of_areas_to_cover) AS no_of_areas_to_cover, IIF(min_credits_per_area IS NULL ,0,min_credits_per_area) AS min_credits_per_area ,  IIF(primary_area IS NULL,'NA',primary_area) AS primary_area  ,IIF(min_credits_in_primary_area IS NULL,0,min_credits_in_primary_area) AS min_credits_in_primary_area FROM [${slug}].concentration_settings WHERE active = 1 `);
    })
 }
  static refresh(slug,biddingId,userid){
    
    return poolConnection.then(pool =>{
        return pool.request()        
        .input('last_modified_by', sql.Int, userid)
        .input('bidding_session_lid', sql.Int,biddingId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_refresh_concentration_settings]`)
    })
  }
  static delete(concentrationId,slug,userId,biddingSessionId){
    
    return poolConnection.then(pool =>{
        return pool.request().input('input_concentration_settings_lid',sql.Int,concentrationId).
        input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingSessionId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_concentration_settings]`)
    })
}
static update(responseJson,slug,userId,biddingId){
    console.log('valuesof responseJson',responseJson);
    return poolConnection.then(pool =>{
        return pool.request()
        .input('last_modified_by',sql.Int,userId)
        .input('input_json',sql.NVarChar(sql.MAX),responseJson)
        .input('bidding_session_lid',sql.Int,biddingId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_concentration_settings]`)
    })
}

}
