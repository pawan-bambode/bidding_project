const { sql, poolConnection } = require('../../../../config/db');

module.exports = class BonusBidPoints {
    
    static getList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT debp.id, round_name, bonus_bid_points AS incrementPoints 
                        FROM [${slug}].bonus_bid_points debp
                        INNER JOIN [${slug}].round_settings rs ON rs.round_lid = debp.round_lid 
                        WHERE debp.active = 1 AND debp.bidding_session_lid = @biddingId`);
        });
    }
    
    // Procedures code starts from here
    static add(slug, userid, biddingId, inputJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_demand_estimation_bid_points]`);
        });
    }

    static delete(slug, userid, biddingId, id) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('id', sql.Int, id)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_delete_demand_estimation_bid_points]`);
        });
    }

    static update(slug, userid, biddingId, inputJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_demand_estimation_bid_points]`);
        });
    }   
}
