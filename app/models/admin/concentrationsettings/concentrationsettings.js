const { sql, poolConnection } = require('../../../../config/db');

module.exports = class ConcentrationSettings {
  
    static getList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT cs.id, a.id AS area_Id, concentration_name, concentration_lid, 
                        cs.bidding_session_lid,
                        IIF(total_elective_credits IS NULL, 0, total_elective_credits) AS total_elective_credits,
                        IIF(max_credits_per_area IS NULL, 0, max_credits_per_area) AS max_credits_per_area,
                        IIF(no_of_areas_to_cover IS NULL, 0, no_of_areas_to_cover) AS no_of_areas_to_cover,
                        IIF(min_credits_per_area IS NULL, 0, min_credits_per_area) AS min_credits_per_area,  
                        IIF(primary_area IS NULL, 'NA', primary_area) AS primary_area,
                        IIF(min_credits_in_primary_area IS NULL, 0, min_credits_in_primary_area) AS min_credits_in_primary_area 
                        FROM [${slug}].concentration_settings cs
                        LEFT JOIN [${slug}].areas a ON a.area_name = cs.primary_area AND cs.active = 1 AND cs.bidding_session_lid = @biddingId AND a.active = 1 AND a.bidding_session_lid = @biddingId`);
        });
    }

    static getCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].concentration_settings WHERE active = 1 AND bidding_session_lid = @biddingId`);
        });
    }

    static showEntry(slug, biddingId, showEntry, pageNo) {
        if (pageNo) {
            return poolConnection.then(pool => {
                return pool.request() 
                    .input('biddingId', sql.Int, biddingId)
                    .input('pageNo', sql.Int, pageNo)
                    .query(`SELECT id, concentration_name,
                            IIF(total_elective_credits IS NULL, 0, total_elective_credits) AS total_elective_credits,
                            IIF(max_credits_per_area IS NULL, 0, max_credits_per_area) AS max_credits_per_area,
                            IIF(no_of_areas_to_cover IS NULL, 0, no_of_areas_to_cover) AS no_of_areas_to_cover,
                            IIF(min_credits_per_area IS NULL, 0, min_credits_per_area) AS min_credits_per_area,
                            IIF(primary_area IS NULL, 'NA', primary_area) AS primary_area,
                            IIF(min_credits_in_primary_area IS NULL, 0, min_credits_in_primary_area) AS min_credits_in_primary_area
                            FROM [${slug}].concentration_settings WHERE active = 1 AND bidding_session_lid = @biddingId
                            ORDER BY a.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request() 
                    .input('biddingId', sql.Int, biddingId)
                    .query(`SELECT TOP ${showEntry} id, concentration_name,
                            IIF(total_elective_credits IS NULL, 0, total_elective_credits) AS total_elective_credits,
                            IIF(max_credits_per_area IS NULL, 0, max_credits_per_area) AS max_credits_per_area,
                            IIF(no_of_areas_to_cover IS NULL, 0, no_of_areas_to_cover) AS no_of_areas_to_cover, 
                            IIF(min_credits_per_area IS NULL, 0, min_credits_per_area) AS min_credits_per_area,
                            IIF(primary_area IS NULL, 'NA', primary_area) AS primary_area,
                            IIF(min_credits_in_primary_area IS NULL, 0, min_credits_in_primary_area) AS min_credits_in_primary_area
                            FROM [${slug}].concentration_settings WHERE active = 1 AND bidding_session_lid = @biddingId`);
            });
        }
    }

    static showEntryCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request() 
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT COUNT(*) FROM [${slug}].concentration_settings WHERE active = 1 AND bidding_session_lid = @biddingId`);
        });
    }

    static search(slug, biddingId, pageNo, letterSearch, showEntry) {
        showEntry = showEntry ? showEntry : 10;
        if (pageNo) {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('pageNo', sql.Int, pageNo)
                    .input('bidding_session_lid', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT cs.id, a.id AS area_Id, cs.concentration_name,
                            IIF(total_elective_credits IS NULL, 0, total_elective_credits) AS total_elective_credits,
                            IIF(max_credits_per_area IS NULL, 0, max_credits_per_area) AS max_credits_per_area,
                            IIF(no_of_areas_to_cover IS NULL, 0, no_of_areas_to_cover) AS no_of_areas_to_cover, 
                            IIF(min_credits_per_area IS NULL, 0, min_credits_per_area) AS min_credits_per_area,
                            IIF(primary_area IS NULL, 'NA', primary_area) AS primary_area,
                            IIF(min_credits_in_primary_area IS NULL, 0, min_credits_in_primary_area) AS min_credits_in_primary_area 
                            FROM [${slug}].concentration_settings cs
                            LEFT JOIN [${slug}].areas a ON a.area_name = cs.primary_area AND cs.active = 1 AND cs.bidding_session_lid = @bidding_session_lid AND a.active = 1 AND a.bidding_session_lid = @bidding_session_lid WHERE cs.concentration_name LIKE @letterSearch OR cs.total_elective_credits LIKE @letterSearch OR cs.max_credits_per_area LIKE @letterSearch OR cs.no_of_areas_to_cover LIKE @letterSearch OR cs.min_credits_per_area LIKE @letterSearch OR cs.primary_area LIKE @letterSearch OR cs.min_credits_in_primary_area LIKE @letterSearch`);
            });
        } else {
            return poolConnection.then(pool => {
                return pool.request()
                    .input('pageNo', sql.Int, pageNo)
                    .input('bidding_session_lid', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT cs.id, a.id AS area_Id, cs.concentration_name ,
                            IIF(total_elective_credits IS NULL, 0, total_elective_credits) AS total_elective_credits,
                            IIF(max_credits_per_area IS NULL, 0, max_credits_per_area) AS max_credits_per_area,
                            IIF(no_of_areas_to_cover IS NULL, 0, no_of_areas_to_cover) AS no_of_areas_to_cover, IIF(min_credits_per_area IS NULL, 0, min_credits_per_area) AS min_credits_per_area,  
                            IIF(primary_area IS NULL, 'NA', primary_area) AS primary_area,
                            IIF(min_credits_in_primary_area IS NULL, 0, min_credits_in_primary_area) AS min_credits_in_primary_area  
                            FROM [${slug}].concentration_settings cs
                            LEFT JOIN [${slug}].areas a ON a.area_name = cs.primary_area AND cs.active = 1 AND cs.bidding_session_lid = @bidding_session_lid AND a.active = 1 AND a.bidding_session_lid = @bidding_session_lid WHERE cs.concentration_name LIKE @letterSearch OR cs.total_elective_credits LIKE @letterSearch OR cs.max_credits_per_area LIKE @letterSearch OR cs.no_of_areas_to_cover LIKE @letterSearch  OR cs.min_credits_per_area LIKE @letterSearch OR cs.primary_area LIKE @letterSearch OR cs.min_credits_in_primary_area LIKE @letterSearch`);
            });
        }
    }

    static searchCount(slug, biddingId, pageNo, letterSearch, showEntry) {
        showEntry = showEntry ? showEntry : 10;
        return poolConnection.then(pool => {
            return pool.request()
                .input('pageNo', sql.Int, pageNo)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT COUNT(*) FROM [${slug}].concentration_settings WHERE active = 1 
                        AND bidding_session_lid = @bidding_session_lid AND (concentration_name LIKE @letterSearch)`);
        });
    }

    static studentList(slug, biddingId, studentEmail) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('studentEmail', sql.NVarChar, studentEmail)
                .query(`SELECT cs.*, u.id AS userId, sd.id AS studentId 
                        FROM [${slug}].student_data sd 
                        INNER JOIN [${slug}].concentration c ON sd.concentration_lid = c.id
                        INNER JOIN [${slug}].users u ON u.email = sd.email
                        INNER JOIN [${slug}].concentration_settings cs ON cs.concentration_lid = sd.concentration_lid WHERE sd.email = @studentEmail AND sd.active = 1 AND u.active = 1`);
        });
    }

    static totalCreditCount(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP 1 total_elective_credits AS totalCount 
                        FROM [${slug}].concentration_settings WHERE active = 1 
                        AND bidding_session_lid = @biddingId`);
        });
    }

    // Procedures code starts from here.
    static refresh(slug, biddingId, userid) {
        return poolConnection.then(pool => {
            return pool.request()        
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_concentration_settings]`);
        });
    }

    static delete(concentrationId, slug, userId, biddingSessionId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_concentration_settings_lid', sql.Int, concentrationId)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingSessionId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_concentration_settings]`);
        });
    }

    static update(responseJson, slug, userId, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userId)
                .input('input_json', sql.NVarChar(sql.MAX), responseJson)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_concentration_settings]`);
        });
    }
}
