const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class Specialization {
     static getAllSpecialization(slug,biddingId){
     return poolConnection.then(pool =>{
       return pool.request()
       .input('biddingId',sql.Int,biddingId)
       .query(`SELECT id,concentration_name FROM [${slug}].concentration WHERE active = 1 AND bidding_session_lid = @biddingId`);
     })
     }
     static getCount(slug,biddingId){
      return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT COUNT(*) FROM [${slug}].concentration WHERE active = 1 AND bidding_session_lid = @biddingId`);
      })
      }
     static add(specializationName,biddingId,userId,slug){
      return poolConnection.then(pool =>{
        return pool.request()
        .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(specializationName))
        .input('last_modified_by', sql.Int, userId)
        .input('bidding_session_lid',sql.Int,biddingId)
        .output('output_json', sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_add_specialization]`)
      })
     }
     static delete(specializationId,biddingId,userId,slug){
      return poolConnection.then(pool =>{
        return pool.request()
        .input('input_concentration_lid',sql.Int,specializationId)
        .input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingId)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_specialization]`)
      })
     }
     static update(inputJson,biddingId,userId,slug){
      console.log('values of slug',slug);
      return poolConnection.then(pool =>{
        return pool.request()
        .input('input_json',sql.NVarChar,JSON.stringify(inputJson))
        .input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingId)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_specialization]`);
      })
     }
}
