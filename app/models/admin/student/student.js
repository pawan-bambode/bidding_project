const s = require('connect-redis');
const{sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');


module.exports = class StudentsData {

    static uploadStudentRawData(slug,studetRawData,userId,biddingId){
        console.log('values of studentRaw Data',studetRawData);
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), studetRawData)
            .input('last_modified_by', sql.Int,userId )
            .input('bidding_session_lid',sql.Int,biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].sp_upload_student_data`)
        })
    }    
    static refresh(slug,biddingId,userid) {
        return poolConnection.then(pool => {
            const request = pool.request();
            return request
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int,biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_student_data]`)
        })
    }

    static update(slug,biddingId,userid,responseJson) {
        return poolConnection.then(pool => {
            const request = pool.request();
            return request
                .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(responseJson))
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int,biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_student_data]`)
        })
    }
    static delete(studentId,slug,userId,biddingSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_student_lid',sql.Int,studentId).
            input('last_modified_by',sql.Int,userId)
            .input('bidding_session_lid',sql.Int,biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_student_data]`)
        })
    }
}