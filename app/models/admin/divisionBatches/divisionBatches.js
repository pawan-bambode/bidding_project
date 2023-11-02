const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');
const { use } = require('../../../routers/admin/courseworkload');
const s = require('connect-redis');
const {transformToIdJson} = require('../../../../public/js/utils');


module.exports = class divisionBatches {

  static getDivisionBatches(slug,biddingId){
        let showEntry = 10;
        return poolConnection.then(pool=>{
          return pool.request() 
           .input('biddingId',sql.Int,biddingId)
           .query(`SELECT TOP ${showEntry} db.id,p.program_name,ad.acad_session, c.course_name, db.division,db.batch,max_seats,input_batch_count FROM [${slug}].division_batches db 
           INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
           INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
           INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
           WHERE db.active = 1 AND db.bidding_session_lid = @biddingId`)
        })
  }
 static getCountOfDivisionBatches(slug,biddingId){
      return poolConnection.then(pool=>{
       return pool.request() 
         .input('biddingId',sql.Int,biddingId)
         .query(`SELECT COUNT(*) FROM [${slug}].division_batches db INNER JOIN [${slug}].courses c ON db.course_lid = c.id WHERE db.active = 1 AND db.bidding_session_lid = @biddingId`)
     })
   } 

 static uploadDivisionBatches(slug,inputJson,userid,biddingId){
     return poolConnection.then(pool=>{
        return pool.request()
         .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(inputJson))
         .input('last_modified_by', sql.Int, userid)
         .input('bidding_session_lid',sql.Int,biddingId)
         .output('output_json', sql.NVarChar(sql.MAX))
         .execute(`[${slug}].[sp_upload_division_batches]`)
     })
    }
  static update(inputJson,biddingId,userid,slug){
      return poolConnection.then(pool=>{
            return pool.request()
             .input('last_modified_by',sql.Int,userid)
             .input('bidding_session_lid',sql.Int,biddingId)
             .input('input_json',sql.NVarChar(sql.MAX),inputJson)
             .output('output_json',sql.NVarChar(sql.MAX))
             .execute(`[${slug}].[sp_update_division_batches]`)
        })
    }

  static delete(divisionId,slug,biddingId,userid){
      return poolConnection.then(pool =>{
         return pool.request()
            .input('last_modified_by',sql.Int,userid)
            .input('bidding_session_lid',sql.Int,biddingId)
            .input('div_batch_lid',sql.Int,divisionId)
            .output('output_json',sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_division_batches]`)
        })
    }
  static deleteAll(slug,biddingId,userId,deleteDivisionBatchesIdJson){
        deleteDivisionBatchesIdJson = Object.keys(deleteDivisionBatchesIdJson).map(key => {
            const id = deleteDivisionBatchesIdJson[key];
            return { id: parseInt(id) }; 
        })
        return poolConnection.then(pool =>{
            return pool.request()
            .input('last_modified_by',sql.Int,userId)
            .input('bidding_session_lid',sql.Int,biddingId)
            .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(deleteDivisionBatchesIdJson))
            .output('output_json',sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_division_batches]`)
        })
    }
static search(slug,biddingId,letterSearch,userId,showEntry,pageNo){
    if(pageNo){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .input('last_modified_by',sql.Int,userId)
        .input('biddingId',sql.Int,biddingId)
        .input('pageNo',sql.Int,pageNo)
        .query(`SELECT db.id,p.program_name,ad.acad_session, c.course_name, db.division,db.batch,max_seats,input_batch_count FROM [${slug}].division_batches db 
        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE  @letterSearch  OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR 
         db.division LIKE  @letterSearch OR  db.batch LIKE  @letterSearch OR   db.max_seats LIKE  @letterSearch  OR db.input_batch_count LIKE  @letterSearch )  ORDER BY c.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
    })
}else{
    return poolConnection.then(pool =>{
        return pool.request()
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .input('last_modified_by',sql.Int,userId)
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT TOP ${showEntry} db.id,p.program_name,ad.acad_session, c.course_name, db.division,db.batch,max_seats,input_batch_count FROM [${slug}].division_batches db 
        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE  @letterSearch  OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR 
         db.division LIKE  @letterSearch OR  db.batch LIKE  @letterSearch OR   db.max_seats LIKE  @letterSearch  OR db.input_batch_count LIKE  @letterSearch )`);
    })
}
}

static getCountSearch(slug,biddingId,letterSearch,userId){
    return poolConnection.then(pool =>{
      
        return pool.request()
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .input('last_modified_by',sql.Int,userId)
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT COUNT(*) FROM [${slug}].division_batches db 
        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE  @letterSearch  OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR 
         db.division LIKE  @letterSearch OR  db.batch LIKE  @letterSearch OR   db.max_seats LIKE  @letterSearch  OR db.input_batch_count LIKE  @letterSearch )`)
    })
}

static showEntryDivisionBatchesList(slug,biddingId,showEntry,pageNo){
    if(pageNo){
        return poolConnection.then(pool=>{
          return pool.request() 
          .input('biddingId',sql.Int,biddingId)
          .input('pageNo',sql.Int,pageNo)
          .query(`SELECT db.id,p.program_name,ad.acad_session, c.course_name, db.division,db.batch,max_seats,input_batch_count FROM [${slug}].division_batches db 
          INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
          INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
          INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
          WHERE c.active = 1 AND c.bidding_session_lid = @biddingId
          ORDER BY c.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
        })
    }
    else{
        return poolConnection.then(pool=>{
            return pool.request() 
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT TOP ${showEntry} db.id,p.program_name,ad.acad_session, c.course_name, db.division,db.batch,max_seats,input_batch_count FROM [${slug}].division_batches db 
            INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
            WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
          })
    }
}
static getCounts(slug,biddingId){
    return poolConnection.then(pool=>{
      return pool.request() 
      .input('biddingId',sql.Int,biddingId)
      .query(`SELECT COUNT(*) FROM [${slug}].division_batches db 
      INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
      INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
      INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
      WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
    })
}


static getProgramList(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('bidding_session_lid',sql.Int,biddingId)
        .query(`select p.program_name,p.program_id from [sbm-mum].courses c
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id WHERE c.active = 1 AND p.bidding_session_lid = @bidding_session_lid GROUP BY p.program_id,program_name`)
    })


}}
