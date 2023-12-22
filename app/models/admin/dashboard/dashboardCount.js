const {sql,poolConnection} = require('../../../../config/db')

module.exports = class DashboardCount{

    static async getCouresCount(slug, biddingId){   
        try {
            let courseCount = 0
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].courses WHERE active = 1 AND bidding_session_lid =   @biddingId`);
            courseCount = result.recordset[0]['']; 
            return courseCount;
        } catch (error) {
             return 0; 
        }
    }

    static async getProgramCount(slug, biddingId){
        try {   
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].programs WHERE active = 1 AND bidding_session_lid =  @biddingId`);
            const programCount = result.recordset[0]['']; 
            return programCount;
        } catch (error) {
            return 0; 
        }
    }

    static async getProgramSessionCount(slug, biddingId){
        try{
            let programSessionCount = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].program_sessions WHERE active = 1 AND bidding_session_lid = @biddingId`);
            programSessionCount  = result.recordset[0][''];
            return programSessionCount;
        }catch(error) {
            return 0;
        }
    }

    static async getAreaCount(slug, biddingId){
        try{
            let  areaCount = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].areas WHERE active = 1 AND bidding_session_lid = @biddingId`);
             areaCount  = result.recordset[0][''];
            return areaCount;
        }catch(error) {
            return 0;
        }
    }

    static async getConcentrationCount(slug, biddingId){
        try{
            let  concentrationCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].concentration WHERE active = 1 AND bidding_session_lid = @biddingId`);
            concentrationCount  = result.recordset[0][''];
            return concentrationCount;
        }catch(error) {
            return 0;
        }
    }

    static async getConcentrationSettingsCount(slug, biddingId){
        try{
            let  concentrationSettingsCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].concentration_settings WHERE active = 1 AND bidding_session_lid = @biddingId`);
            concentrationSettingsCount  = result.recordset[0][''];
            return concentrationSettingsCount;
        }catch(error) {
            return 0;
        }
    }

    static async getStudentCount(slug, biddingId){
        try{
            let  studentCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].student_data WHERE active = 1 AND bidding_session_lid = @biddingId`);
            studentCount  = result.recordset[0][''];
            return studentCount;
        }catch(error) {
            return 0;
        }
    }

    static async getPrequisitesCounts(slug, biddingId){
        try{
            let  preRequisiteCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].pre_requisites WHERE active = 1 AND bidding_session_lid = @biddingId`);
            preRequisiteCount  = result.recordset[0][''];
            return preRequisiteCount;
        }catch(error) {
           return 0;
        }
    }

    static async getCompleteCourseCount(slug, biddingId){
        try{
            let  completeCouresCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].completed_courses WHERE active = 1 AND bidding_session_lid = @biddingId`);
            completeCouresCount  = result.recordset[0][''];
            return completeCouresCount;
        }catch(error) {
           return 0;
        }
    }
       
    static async getDivisionBatchCount(slug, biddingId){
        try{
            let  divisionBatchCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].division_batches WHERE active = 1 AND bidding_session_lid = @biddingId`);
            divisionBatchCount  = result.recordset[0][''];
            return divisionBatchCount;
        }catch(error) {
            return 0;
        }
    }
 
    static async getRoundSettingCount(slug, biddingId){
        try{
            let  roundSettingCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) FROM [${slug}].round_settings WHERE active = 1 AND 
                    bidding_session_lid = @biddingId`);
            roundSettingCount  = result.recordset[0][''];
            return roundSettingCount;
        }catch(error) {
            return 0;
        }
    }
}