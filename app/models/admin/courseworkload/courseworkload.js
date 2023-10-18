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
}