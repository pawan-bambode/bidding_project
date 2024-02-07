const { sql, poolConnection } = require('../../config/db');
const pool = require('mssql');

module.exports = class StudentElectiveDetails {
    static getConfirmedCoursesList(slug, biddingId, username) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('username', sql.NVarChar, username)
                .query(`SELECT seb.* 
                        FROM [${slug}].student_elective_bidding seb
                        INNER JOIN [${slug}].student_data sd ON seb.student_lid = sd.id 
                        WHERE sd.sap_id = @username AND seb.bidding_session_lid = @biddingId AND 
                        seb.is_confirmed = 1`);
        });
    }
}
