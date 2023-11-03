const s = require('connect-redis');
const{sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');


module.exports = class timetable {

    static uploadTimetable(slug,electiveTimetable,userId,biddingId){
        console.log('values of electiveTimetable',electiveTimetable);
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), electiveTimetable)
            .input('last_modified_by', sql.Int,userId )
            .input('bidding_session_lid',sql.Int,biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_timetable]`)
        })
    }    
    }