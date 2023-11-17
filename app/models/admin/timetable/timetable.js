const s = require('connect-redis');
const{sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');
const { use } = require('../../../routers/admin/timetable/timetable');


module.exports = class timetable {

    static uploadTimetable(slug,electiveTimetable,userId,biddingId){
        electiveTimetable = JSON.parse(electiveTimetable);
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX),JSON.stringify(electiveTimetable))
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
            .query(`SELECT  p.id, p.program_id,p.program_name  FROM [${slug}].timetable et 
            INNER JOIN [${slug}].programs p ON et.program_lid = p.id  AND p.bidding_session_lid = @biddingId
            WHERE et.active = 1 AND et.bidding_session_lid =  @biddingId GROUP By p.id, p.program_id,p.program_name
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
            WHERE et.active = 1 AND et.bidding_session_lid =  @biddingId AND program_lid = @program_lid GROUP BY ps.id,ad.sap_acad_session_id,ad.acad_session`);
        })
    } 
    static delete(programlid,radioType,slug,userId,biddingSessionId){
        if(radioType == 'program'){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_program_lid',sql.Int,programlid).
            input('last_modified_by',sql.Int,userId)
            .input('bidding_session_lid',sql.Int,biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_program_timetable]`)
        })
    }else{
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_program_session_lid',sql.Int,programlid).
            input('last_modified_by',sql.Int,userId)
            .input('bidding_session_lid',sql.Int,biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_program_session_timetable]`)
        })
    }}
    static getMinAndMaxTimetableTime(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT MIN(start_slot_lid) AS start_slot_lid,MAX(end_slot_lid) AS end_slot_lid from [${slug}].timetable WHERE bidding_session_lid = @biddingId AND active = 1`)
        })
    }
    static getRoomList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT DISTINCT room_no FROM [${slug}].timetable WHERE bidding_session_lid = @biddingId AND active = 1`)
        })
    }
    static getCourses(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT t.faculty_name,p.program_name,c.acad_session,c.course_name,db.division,db.batch,t.faculty_type_abbr ,
            start_slot_lid,end_slot_lid,t.room_no 
            from [${slug}].timetable t 
            INNER JOIN [${slug}].programs p ON t.program_lid = p.id
            INNER JOIN [${slug}].division_batches db ON t.division_batch_lid = db.id
            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
            WHERE t.active = 1 AND t.bidding_session_lid = @biddingId`)
        })
    }
     static getTimeslot(){
        return poolConnection.then(pool =>{
            return pool.request().query(`SELECT CONVERT(NVARCHAR,start_time, 0) as start_time,CONVERT(NVARCHAR,end_time, 0)end_time FROM [dbo].slot_interval_timings`)
        })
    }
    static getTimetableByDayId(dayId,acadSession,slug,biddingId){ 
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .input('dayId',sql.Int,dayId)
            .input('acadSession',sql.Int,acadSession)
            .query(`SELECT t.faculty_name,p.program_name,c.acad_session,c.course_name,db.division,db.batch,t.faculty_type_abbr ,
            start_slot_lid,end_slot_lid,t.room_no 
            from [${slug}].timetable t 
            INNER JOIN [${slug}].programs p ON t.program_lid = p.id
            INNER JOIN [${slug}].division_batches db ON t.division_batch_lid = db.id
            INNER JOIN [${slug}].courses c ON c.id = db.course_lid
            INNER JOIN [dbo].acad_sessions ad ON c.sap_acad_session_id = ad.sap_acad_session_id
            WHERE t.active = 1 AND t.bidding_session_lid = @biddingId AND t.day_lid = @dayId AND ad.sap_acad_session_id = @acadSession`)
        })
    }

    static getDropdownAcadSessionList(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT ad.acad_session ,ps.sap_acad_session_id FROM  [${slug}].program_sessions ps
            INNER JOIN [dbo].acad_sessions ad ON ps.sap_acad_session_id = ad.sap_acad_session_id WHERE ps.bidding_session_lid = @biddingId`)
        })
    }
    }