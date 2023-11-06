const s = require('connect-redis');
const{sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');
const { use } = require('../../../routers/admin/timetable/timetable');


module.exports = class timetable {

    static uploadTimetable(slug,electiveTimetable,userId,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), electiveTimetable)
            .input('last_modified_by', sql.Int,userId )
            .input('bidding_session_lid',sql.Int,biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_timetable]`)
        })
    } 
    static getProgramList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT p.id, p.program_id,p.program_name  FROM [sbm-mum].timetable et 
            INNER JOIN [${slug}].programs p ON et.program_lid = p.id  AND p.bidding_session_lid = @biddingId
            WHERE et.active = 1 AND et.bidding_session_lid =  @biddingId
            `);
        })
    }   
    static getAcadSessionList(slug,biddingId,program_lid){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .input('program_lid',sql.Int,program_lid)
            .query(`SELECT ps.id, ad.sap_acad_session_id,ad.acad_session  FROM [${slug}].timetable et 
            INNER JOIN [${slug}].program_sessions ps ON et.program_session_lid = ps.id  AND ps.bidding_session_lid = @biddingId
            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = ps.sap_acad_session_id
            WHERE et.active = 1 AND et.bidding_session_lid =  @biddingId AND program_lid = @program_lid`);
        })
    } 
    static delete(programlid,radioType,slug,userId,biddingSessionId){
        if(radioType == 'program'){
            console.log('values of program_lid',programlid);
            console.log('values of radioType',radioType);
            console.log('values of useId',userId);
            console.log('valuesof biddin',biddingSessionId);
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_program_lid',sql.Int,programlid).
            input('last_modified_by',sql.Int,userId)
            .input('bidding_session_lid',sql.Int,biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_program_timetable]`)
        })
    }else{
        console.log('values of program_lid',programlid);
        console.log('values of radioType',radioType);
        console.log('values of useId',userId);
        console.log('valuesof biddin',biddingSessionId);
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_program_session_lid',sql.Int,programlid).
            input('last_modified_by',sql.Int,userId)
            .input('bidding_session_lid',sql.Int,biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_program_session_timetable]`)
        })
    }}
    }