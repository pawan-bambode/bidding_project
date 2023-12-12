const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db');
const pool = require('mssql');

module.exports = class RoundSettings {
    static getRoundLid(slug, biddingId) {
      let DEMAND_ESTIMATION_ROUND = 'DEMAND_ESTIMATION_ROUND';
      return poolConnection.then(pool => {
        return pool.request()
          .input('biddingId', sql.Int, biddingId)
          .input('roundName', sql.NVarChar, `%${DEMAND_ESTIMATION_ROUND}%`)
          .query(`SELECT round_lid FROM [${slug}].round_settings WHERE bidding_session_lid = @biddingId AND active = 1 AND round_name LIKE @roundName AND active = 1`);
      });
    }
    static getStartEndTime(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT FORMAT(start_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS startTime,
            FORMAT(end_date_time, 'dd-MMMM yyyy h:mm:ss tt') AS endTime FROM [${slug}].round_settings WHERE active = 1`)
        })
    }
  }
  