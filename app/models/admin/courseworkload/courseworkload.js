const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class courseworkload {
 static uploadCourse(slug,inputJson,userid,biddingId){
return poolConnection.then(pool=>{
    return pool.request()
    .input('input_json',sql.NVarChar(sql.MAX),inputJson)
    .input('last_modified_by', sql.Int, userid)
    .input('bidding_session_lid',sql.Int,biddingId)
    .output('output_json', sql.NVarChar(sql.MAX))
    .execute(`[${slug}].[sp_upload_courses]`)
})
}
static getCourseList(slug){
      return poolConnection.then(pool=>{
        return pool.request().query(`SELECT  c.id , course_name,credits,program_id , ad.acad_session,area_name, min_demand_criteria , year_of_introduction FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.active = 1`)
      })
}
static delete(courseId,slug,biddingId,userid){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('course_lid',sql.Int,courseId)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_courses]`)
    })
}
static update(inputJson,biddingId,userid,slug){
    return poolConnection.then(pool=>{
        return pool.request()
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('input_json',sql.NVarChar(sql.MAX),inputJson)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_courses]`)
    })
}
}
