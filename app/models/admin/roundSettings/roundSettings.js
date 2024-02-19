const { sql, poolConnection } = require('../../../../config/db');

module.exports = class RoundSettings {
  
    static getRoundLid(slug, biddingId) {
        let DEMAND_ESTIMATION_ROUND = 'DEMAND_ESTIMATION_ROUND';
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundName', sql.NVarChar, `%${DEMAND_ESTIMATION_ROUND}%`)
                .query(`SELECT round_lid 
                        FROM [${slug}].round_settings 
                        WHERE bidding_session_lid = @biddingId AND active = 1 
                        AND round_name LIKE @roundName`);
        });
    }
    static listByOneDayBefore(slug, biddingId, round1Id, round2Id) {
       
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('round1Id', sql.Int, round1Id) 
                .input('round2Id', sql.Int, round2Id)
                .query(`
                    SELECT round_lid, 
                           FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
                           FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
                           SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)) AS roundName
                    FROM [${slug}].round_settings
                    WHERE end_date_time > GETDATE() 
                    AND bidding_session_lid = @biddingId 
                    AND active = 1 
                    AND round_lid IN (@round1Id, @round2Id) -- Adjusted parameter names
                `);
        });
    }
    
    static roundSettingTime(slug, biddingId, roundFirst, roundSecond){
     
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('round1_lid', sql.Int, roundFirst)
            .input('round2_lid', sql.Int, roundSecond)
            .query(`IF (SELECT COUNT(*) 
                    FROM [${slug}].round_settings 
                    WHERE round_lid = @round1_lid AND end_date_time >= GETDATE()) > 0
                BEGIN
                    SELECT start_date_time, end_date_time 
                    FROM [${slug}].round_settings
                    WHERE bidding_session_lid = @biddingId AND active = 1 AND 
                    round_lid = @round1_lid
                END
            ELSE
                BEGIN
                    SELECT start_date_time, end_date_time 
                    FROM [${slug}].round_settings
                    WHERE bidding_session_lid = @biddingId AND active = 1 AND 
                    round_lid = @round2_lid
                END`)
        })
    }
    static startAndEndTime(slug, biddingId, roundlid) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('round_lid', sql.Int, roundlid)
                .query(`SELECT FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
                        FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, round_lid 
                        FROM [${slug}].round_settings 
                        WHERE active = 1 AND round_lid = @round_lid`);
        });
    }

    static roundId(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundName', sql.NVarChar, `%${'BIDDING_ROUND1'}%`)
                .query(`SELECT round_lid as round_lid
                        FROM [${slug}].round_settings 
                        WHERE active = 1 AND round_name like @roundName`);
        });
    }
};
