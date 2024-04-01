const { sql, poolConnection } = require('../../../../config/db');

module.exports = class RoundSettings {

    static getList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT id, round_lid, round_name, total_students, is_bid_limit, bid_limit,
                        IIF(total_courses IS NULL, '', total_courses) AS total_courses,
                        FORMAT(end_date_time, 'dd MMM yyyy, hh:mm tt') AS end_date_time, 
                        FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time,
                        FORMAT(end_date_time, 'yyyy-MM-dd HH:mm:ss') AS end_date_time_attr,
                        FORMAT(start_date_time, 'yyyy-MM-dd HH:mm:ss') AS start_date_time_attr
                        FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1`);
        });
    }

    static preDefineRounds(slug) {
        return poolConnection.then(pool => {
            return pool.request()
                .query(`SELECT esr.id, esr.round_name 
                        FROM [dbo].elective_selection_rounds esr 
                        WHERE esr.id NOT IN( SELECT rs.round_lid
                        FROM [${slug}].round_settings rs
                        INNER JOIN [${slug}].bidding_session bs ON bs.id = rs.bidding_session_lid
                        WHERE rs.active = 1 AND bs.status = 1 )`);
        });
    }

    static students(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT sd.id AS student_lid, * FROM [${slug}].student_data sd 
                        INNER JOIN [${slug}].programs p ON p.program_id = sd.program_id
                        WHERE sd.bidding_session_lid = @biddingId AND sd.active = 1 AND p.bidding_session_lid = @biddingId AND p.active = 1`);
        });
    }

    static courses(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.* FROM [${slug}].courses c 
                        INNER JOIN [${slug}].programs p ON c.program_id = p.program_id
                        WHERE c.bidding_session_lid = @biddingId AND c.active = 1 AND p.bidding_session_lid = @biddingId AND p.active = 1`);
        });
    }

    static search(slug, biddingId, letterSearch, pageNo, showEntry) {
        if (pageNo) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('pageNo', sql.Int, pageNo)
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT id, round_lid, round_name, total_students, is_bid_limit, bid_limit, 
                            IIF(total_courses IS NULL, '0', total_courses) AS total_courses,
                            FORMAT(end_date_time, 'dd MMM yyyy, hh:mm tt') AS end_date_time, 
                            FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time,
                            FORMAT(end_date_time, 'yyyy-MM-dd HH:mm:ss') AS end_date_time_attr,
                            FORMAT(start_date_time, 'yyyy-MM-dd HH:mm:ss') AS start_date_time_attr
                            FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND (round_name LIKE @letterSearch OR total_students LIKE @letterSearch OR total_courses LIKE @letterSearch OR end_date_time LIKE @letterSearch OR start_date_time LIKE @letterSearch) ORDER BY cc.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('biddingId', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT id, round_lid, round_name, total_students, is_bid_limit, bid_limit,
                            IIF(total_courses IS NULL, '0', total_courses) AS total_courses,
                            FORMAT(end_date_time, 'dd MMM yyyy, hh:mm tt') AS end_date_time,
                            FORMAT(start_date_time, 'dd MMM yyyy, hh:mm tt') AS start_date_time, 
                            FORMAT(end_date_time, 'yyyy-MM-dd HH:mm:ss') AS end_date_time_attr,
                            FORMAT(start_date_time, 'yyyy-MM-dd HH:mm:ss') AS start_date_time_attr
                            FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND (round_name LIKE @letterSearch OR total_students LIKE @letterSearch OR total_courses LIKE @letterSearch OR end_date_time LIKE @letterSearch OR start_date_time LIKE @letterSearch)`);
            });
        }
    }

    static searchCount(slug, biddingId, letterSearch) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT count(*)
                        FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND (round_name LIKE @letterSearch OR total_students LIKE @letterSearch OR total_courses LIKE @letterSearch OR end_date_time LIKE @letterSearch OR start_date_time LIKE @letterSearch)`);
        });
    }

    static studentsMapping(slug, biddingId, roundId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT * FROM [${slug}].student_round_mapping 
                        WHERE bidding_session_lid = @biddingId AND active = 1 AND round_lid = @roundId`);
        });
    }

    static coursesMapping(slug, biddingId, roundId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundId', sql.Int, roundId)
                .query(`SELECT * FROM [${slug}].course_round_mapping 
                        WHERE bidding_session_lid = @biddingId AND active = 1 AND round_lid = @roundId`);
        });
    }

    static roundId(slug, biddingId) {
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

    static demandEstimOneDayBefore(slug, biddingId, roundId) {

        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('roundId', sql.Int, roundId) 
                .query(`SELECT round_lid, FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
                        FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
                        REPLACE(SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)), '_', ' ') AS roundName
                        FROM [${slug}].round_settings
                        WHERE start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                        end_date_time > GETDATE() AND 
                        bidding_session_lid = @biddingId AND 
                        active = 1 AND 
                        round_lid = @roundId`);
        });
    }

    static currentRoundStatus(slug, biddingId, roundId) {

        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT rs.round_name, 
                        IIF(rs.end_date_time < GETDATE(), 1, 0) AS round_ended, 
                        IIF((rs.end_date_time > GETDATE() AND rs.start_date_time < GETDATE()), 1, 0) AS round_started,  
                        IIF(rs.start_date_time > GETDATE(), 1, 0) AS round_not_started_yet
                        FROM [${slug}].round_settings rs
                        INNER JOIN [dbo].elective_selection_rounds es ON es.id = rs.round_lid
                        WHERE es.round_name = 'DEMAND_ESTIMATION_ROUND' 
                        AND rs.active = 1 
                        AND rs.bidding_session_lid = @biddingId`);
        });
    }

    static listByOneDayBefore(slug, biddingId, round1Id, round2Id) {

    
 
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('round1Id', sql.Int, round1Id) 
                .input('round2Id', sql.Int, round2Id)
                .query(`
                IF (SELECT COUNT(*) 
                FROM [${slug}].round_settings 
                WHERE round_lid = @round1Id AND end_date_time >= GETDATE()) > 0
                    BEGIN
                        SELECT
                            round_lid, 
                            FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
                            FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
                            bidding_session_lid,
                            REPLACE(SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)), '_', ' ') AS roundName
                        FROM 
                            [${slug}].round_settings
                        WHERE 
                            start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                            end_date_time > GETDATE() AND 
                            bidding_session_lid = @biddingId AND 
                            active = 1 AND 
                            round_lid = @round1Id
                    END
                ELSE
                    BEGIN
                        SELECT
                            round_lid, 
                            FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
                            FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
                            bidding_session_lid,
                            REPLACE(SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)), '_', ' ') AS roundName
                        FROM 
                            [${slug}].round_settings
                        WHERE 
                            start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                            end_date_time > GETDATE() AND 
                            bidding_session_lid = @biddingId AND 
                            active = 1 AND 
                            round_lid = @round2Id
                    END 
                `);
        });
    }
    
    static roundSettingTime(slug, biddingId, roundFirst, roundSecond){

        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('round1_lid', sql.Int, roundFirst)
            .input('round2_lid', sql.Int, roundSecond)
            .query(`IF (SELECT COUNT(*) FROM [${slug}].round_settings 
                    WHERE round_lid = @round1_lid AND start_date_time >= GETDATE()) > 0
                        BEGIN
                            SELECT start_date_time, end_date_time ,bidding_session_lid
                            FROM [${slug}].round_settings
                            WHERE bidding_session_lid = @biddingId AND active = 1 AND 
                            round_lid = @round1_lid AND  start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                            end_date_time > GETDATE()
                        END
                        ELSE    
                        BEGIN
                            SELECT start_date_time, end_date_time ,bidding_session_lid
                            FROM [${slug}].round_settings
                            WHERE bidding_session_lid = @biddingId AND active = 1 AND 
                            round_lid = @round2_lid AND  start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                            end_date_time > GETDATE()
                        END `)
        })
    }
    static startAndEndTime(slug, biddingId, roundfirst) {

        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('round_lid', sql.Int, roundfirst)
                .query(`SELECT FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,     
                        FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime, 
                        SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, LEN(round_name)) AS roundName,
                        round_lid , bidding_session_lid
                        FROM [${slug}].round_settings 
                        WHERE active = 1 AND round_lid = @round_lid  AND start_date_time <= DATEADD(HOUR, 24, GETDATE()) AND 
                        end_date_time > GETDATE()`);
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


    // Procedures code starts from here.
    static create(inputJSON, slug, userid, biddingId) {
        console.log('inputJSON', inputJSON);
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_round_settings]`);
        });
    }

    static delete(roundId, slug, userId, biddingSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_round_lid', sql.Int, roundId)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_round_settings]`);
        });
    }

    static update(inputJSON, slug, userid, biddingSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJSON)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_round_settings]`);
        });
    }
};
