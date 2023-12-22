const {sql,poolConnection} = require('../../../../config/db')

module.exports = class Specialization {
  
  static add(specializationName, biddingId, userId, slug) {
    return poolConnection.then(pool => {
      return pool.request()
        .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(specializationName))
        .input('last_modified_by', sql.Int, userId)
        .input('bidding_session_lid', sql.Int, biddingId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_add_specialization]`);
    });
  }
  
  static delete(specializationId, biddingId, userId, slug) {
    return poolConnection.then(pool => {
      return pool.request()
        .input('input_concentration_lid', sql.Int, specializationId)
        .input('last_modified_by', sql.Int, userId)
        .input('bidding_session_lid', sql.Int, biddingId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_specialization]`);
    });
  }

  static update(inputJson, biddingId, userId, slug) {
    return poolConnection.then(pool => {
      return pool.request()
        .input('input_json', sql.NVarChar, JSON.stringify(inputJson))
        .input('last_modified_by', sql.Int, userId)
        .input('bidding_session_lid', sql.Int, biddingId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_specialization]`);
    });
  }

    static getAllSpecialization(slug, biddingId, showEntry) {
      showEntry = showEntry ? showEntry : 10;
      return poolConnection.then(pool => {
        return pool.request()
          .input('biddingId', sql.Int, biddingId)
          .query(`SELECT TOP ${showEntry} id, concentration_name 
                  FROM [${slug}].concentration WHERE active = 1 AND bidding_session_lid = @biddingId`);
      });
    }
    
    static getCount(slug, biddingId) {
      return poolConnection.then(pool => {
        return pool.request()
          .input('biddingId', sql.Int, biddingId)
          .query(`SELECT COUNT(*) 
                  FROM [${slug}].concentration WHERE active = 1 AND bidding_session_lid = @biddingId`);
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
            .query(`SELECT c.id, c.concentration_name  
                    FROM [${slug}].concentration c WHERE c.active = 1 AND c.bidding_session_lid = @bidding_session_lid AND (c.concentration_name LIKE @letterSearch) ORDER BY c.id DESC  
                    OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
        });
      } else {
        return poolConnection.then(pool => {
          return pool.request()
            .input('pageNo', sql.Int, pageNo)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
            .query(`SELECT TOP ${showEntry} c.id, c.concentration_name
                    FROM [${slug}].concentration c WHERE c.active = 1 AND c.bidding_session_lid = @bidding_session_lid AND (c.concentration_name LIKE @letterSearch)`);
        });
      }
    }
    
    static getCountOfSearch(slug, biddingId, pageNo, letterSearch, showEntry) {
      showEntry = showEntry ? showEntry : 10;
      return poolConnection.then(pool => {
        return pool.request()
          .input('pageNo', sql.Int, pageNo)
          .input('bidding_session_lid', sql.Int, biddingId)
          .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
          .query(`SELECT COUNT(*) 
                  FROM [${slug}].concentration c WHERE c.active = 1 AND c.bidding_session_lid = @bidding_session_lid AND (c.concentration_name LIKE @letterSearch)`);
      });
    }
    
    static showEntrySpecializationList(slug, biddingId, showEntry, pageNo) {
      if (pageNo) {
        return poolConnection.then(pool => {
          return pool.request() 
            .input('biddingId', sql.Int, biddingId)
            .input('pageNo', sql.Int, pageNo)
            .query(`SELECT c.id, c.concentration_name 
                    FROM [${slug}].concentration c WHERE c.active = 1 AND c.bidding_session_lid = @biddingId
                    ORDER BY a.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
        });
      } else {
        return poolConnection.then(pool => { 
          return pool.request() 
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${showEntry} c.id, c.concentration_name 
                    FROM [${slug}].concentration c WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`);
        });
      }
    }    
}
