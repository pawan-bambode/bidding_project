const { max } = require('moment');
const {sql,poolConnection} = require('../../../../config/db')

module.exports = class Bidding
{
    static addConcentrationSet(slug, biddingId, userid, studentLid, roundLid, courseLid, divisionBatchLid, concentrationLid) {
        
        return poolConnection.then(pool => {
            return pool.request()
            .input('student_lid', sql.Int, studentLid)
            .input('round_lid', sql.Int, roundLid)
            .input('course_lid', sql.Int, courseLid)
            .input('concentration_lid', sql.Int, concentrationLid)
            .input('div_batch_lid', sql.Int, divisionBatchLid)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid',sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_consideration_set]`) 
        });
    }

    static withdrawBidding(slug, biddingId, userid, studentLid, roundLid, id , divisionBatchLid) { 
        return poolConnection.then(pool => {
            return pool.request()
            .input('student_lid', sql.Int, studentLid)
            .input('round_lid', sql.Int, roundLid)
            .input('id', sql.Int, id)
            .input('div_batch_lid', sql.Int, divisionBatchLid)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid',sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_withdraw_bid]`) 
        });
    }

    static getConsiderationSet (slug, biddingId, studentLid){
        
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentLid)
            .query(`SELECT seb.div_batch_lid, seb.id, c.area_name, c.course_name, rtb.available_seats, 
                    rtb.total_bidders, rtb.min_req_bid, seb.is_winning, t.division_batch_lid, c.course_id, c.acad_session, STRING_AGG(CONCAT(d.day_name, ' (', CONVERT(VARCHAR, sit.start_time, 100), ' to ', CONVERT(VARCHAR, sit1.end_time, 100), ') ', t.faculty_name), ', ') AS faculty_date_time, c.sap_acad_session_id, c.credits, db.max_seats, RTRIM(LTRIM(db.division)) AS division,c.id AS course_lid, t.faculty_id , t.faculty_name, seb.round_lid, seb.bid_points
                    FROM [${slug}].timetable t
                    INNER JOIN [${slug}].student_elective_bidding seb ON seb.div_batch_lid = t.division_batch_lid
                    INNER JOIN [${slug}].real_time_bidding rtb ON rtb.div_batch_lid = seb.div_batch_lid
                    INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                    INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                    INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                    INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                    INNER JOIN [dbo].days d ON d.id = t.day_lid
                    WHERE seb.bidding_session_lid = @biddingId AND seb.active = 1 AND seb.student_lid = @studentLid AND t.division_batch_lid IN(SELECT div_batch_lid FROM [${slug}].student_elective_bidding Where student_lid = @studentLid) 
                    GROUP BY seb.id, c.area_name, c.course_name, acad_session, c.credits, seb.div_batch_lid, rtb.available_seats, rtb.total_bidders, rtb.min_req_bid, seb.is_winning, t.division_batch_lid, c.course_id, c.acad_session, c.sap_acad_session_id, c.credits,db.max_seats, RTRIM(LTRIM(db.division)), c.id, t.faculty_id , t.faculty_name, seb.round_lid, seb.bid_points`)                    
        })
    }

    static getStudentBidPoints(slug, biddingId, studentLid){
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentLid)
            .query(`SELECT bid_points AS student_bid_points FROM [${slug}].student_data where id = @studentLid AND bidding_session_lid = @biddingId`)                    
        })
    }

    static getUpdateBidPoints(slug, biddingId, studentLid){
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentLid)
            .query(`SELECT DISTINCT (sd.remaining_bid_points) - SUM(seb.bid_points) AS student_bid_points 
                    FROM [${slug}].student_data sd
                    RIGHT JOIN [${slug}].student_elective_bidding seb ON seb.student_lid = sd.id
                    WHERE seb.student_lid = @studentLid AND sd.id = @studentLid AND sd.active = 1 AND seb.active = 1 AND
                    seb.bidding_session_lid = @biddingId GROUP BY sd.remaining_bid_points`)                    
        })
    }
    
    static getWithdrawBiddingDetails (slug, biddingId, divisionId){
        
        return poolConnection.then(pool => {
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('div_batch_lid', sql.Int, divisionId)
            .query(`SELECT available_seats, seb.is_winning , rtb.div_batch_lid, u.id AS student_lid,           
                    total_bidders, min_req_bid AS mrb, seb.active 
                    FROM [${slug}].real_time_bidding rtb
                    INNER JOIN [${slug}].student_elective_bidding seb ON rtb.div_batch_lid = seb.div_batch_lid
                    INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid
					INNER JOIN [${slug}].users u ON sd.email = u.email AND u.active = 1 
                    WHERE seb.div_batch_lid = @div_batch_lid AND seb.active = 1`);
        })
    }
    
    static getAddBiddingDetails (slug, biddingId, divisionId){
        
        return poolConnection.then(pool => {
            return pool.request()
            
            .input('div_batch_lid', sql.Int, divisionId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT seb.id AS studentBiddingId, seb.round_lid, available_seats, seb.is_winning , rtb.div_batch_lid,
                    u.id AS userId, total_bidders, min_req_bid AS mrb
                    FROM [${slug}].real_time_bidding rtb 
                    INNER JOIN [${slug}].student_elective_bidding seb ON rtb.div_batch_lid = seb.div_batch_lid 
                    INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid AND sd.active = 1
                    INNER JOIN [${slug}].users u ON sd.email = u.email AND u.active = 1
                    WHERE seb.div_batch_lid = @div_batch_lid AND seb.bidding_session_lid = @biddingId`);
        })
    }
    static withdrawBidding(slug, studentBiddingId, studentId, roundId, divisionId, userId, biddingSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('id', sql.Int, studentBiddingId)
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('div_batch_lid', sql.Int, divisionId)
            .input('last_modified_by', sql.Int,userId)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_flag', sql.Bit)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_withdraw_bid]`)
        })
    }

    static addBidding(slug, studentId, roundId, courseId, concentrationId, divisionId, userId, biddingSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('course_lid', sql.Int, courseId)
            .input('concentration_lid', sql.Int, concentrationId)
            .input('div_batch_lid', sql.Int, divisionId)
            .input('last_modified_by', sql.Int,userId)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_flag', sql.Bit)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_consideration_set]`)
        })
    }

    static getWithdrawBiddingCourse(slug, biddingId, divisionBatchId, studentId){
    
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentLid', sql.Int, studentId)
            .input('divisionBatchId', sql.Int, divisionBatchId)
            .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                    c.sap_acad_session_id, c.credits, db.max_seats, RTRIM(LTRIM(db.division)) as division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                    d.day_name, c.id AS course_lid 
                    FROM [${slug}].timetable t 
                    INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                    INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                    INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                    INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                    INNER JOIN [dbo].days d ON d.id = t.day_lid
                    WHERE t.division_batch_lid = @divisionBatchId AND t.bidding_session_lid = @biddingId`)
        })
    }

    static studentBidByPoints(slug, studentId, roundId, divBatchId, userId, biddingSessionId ,inputJson){
    
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.VarChar(max), inputJson)
            .input('student_lid', sql.Int, studentId)
            .input('round_lid', sql.Int, roundId)
            .input('div_batch_lid', sql.Int, divBatchId)
            .input('last_modified_by', sql.Int,userId)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_flag', sql.Bit)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_change_bid]`)
        })
    }

    static getBiddingWinningResponse (slug, biddingId, divisionId){
    
        return poolConnection.then(pool => {
            return pool.request()
            
            .input('div_batch_lid', sql.Int, divisionId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT u.id AS userId, seb.bid_points
                    FROM [${slug}].student_elective_bidding seb
                    INNER JOIN [${slug}].real_time_bidding rtb  ON rtb.div_batch_lid = seb.div_batch_lid AND rtb.active = 1
                    INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid AND sd.active = 1
                    INNER JOIN [${slug}].users u ON sd.email = u.email AND u.active = 1
                    WHERE seb.div_batch_lid = @div_batch_lid AND seb.bidding_session_lid = @biddingId AND seb.active =1 AND is_winning = 1`);       
        })
    }
    static getBiddingLossingResponse (slug, biddingId, divisionId){
    
        return poolConnection.then(pool => {
            return pool.request()
            
            .input('div_batch_lid', sql.Int, divisionId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT u.id AS userId
                    FROM [${slug}].student_elective_bidding seb
                    INNER JOIN [${slug}].real_time_bidding rtb  ON rtb.div_batch_lid = seb.div_batch_lid AND rtb.active = 1
                    INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid AND sd.active = 1
                    INNER JOIN [${slug}].users u ON sd.email = u.email AND u.active = 1
                    WHERE seb.div_batch_lid = @div_batch_lid AND seb.bidding_session_lid = @biddingId AND seb.active =1 AND is_winning = 0`);       
        })
    }

    static getMRBPointsResponse (slug, biddingId, divisionId){
    
        return poolConnection.then(pool => {
            return pool.request()
            
            .input('div_batch_lid', sql.Int, divisionId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT min_req_bid AS Mrb
                    FROM [${slug}].student_elective_bidding seb
                    INNER JOIN [${slug}].real_time_bidding rtb  ON rtb.div_batch_lid = seb.div_batch_lid AND rtb.active = 1
                    INNER JOIN [${slug}].student_data sd ON sd.id = seb.student_lid AND sd.active = 1
                    INNER JOIN [${slug}].users u ON sd.email = u.email AND u.active = 1
                    WHERE seb.div_batch_lid = @div_batch_lid AND seb.bidding_session_lid = @biddingId AND seb.active =1 AND is_winning = 1`);       
        })
    }
}
