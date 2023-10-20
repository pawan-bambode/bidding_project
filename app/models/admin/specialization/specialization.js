const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class Specialization {
     static getAllSpecialization(req,res,slug){
        slug = 'sbm_mum'
     return poolConnection.then(pool =>{
       return pool.request()
       .query(`SELECT id,concentration_name FROM [${slug}].concentration WHERE active = 1`);
     })
     }
     static add(specializationName,biddingId,userId,slug){
      slug = 'sbm_mum';
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
      slug = 'sbm_mum';
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
      slug= 'sbm_mum';
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
