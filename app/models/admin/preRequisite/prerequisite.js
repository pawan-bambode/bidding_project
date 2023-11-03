const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');
const { use } = require('../../../routers/admin/courseworkload');
const s = require('connect-redis');

module.exports = class preRequisites {
 static uploadPreRequisites(slug,inputJson,userid,biddingId){
return poolConnection.then(pool=>{
    return pool.request()
    .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(inputJson))
    .input('last_modified_by', sql.Int, userid)
    .input('bidding_session_lid',sql.Int,biddingId)
    .output('output_json', sql.NVarChar(sql.MAX))
    .execute(`[${slug}].[sp_upload_pre_requisites]`)
})
}
static getPreRequities(slug,biddingId,showEntry){
      showEntry = showEntry?showEntry: 10;
      return poolConnection.then(pool=>{
        return pool.request() 
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT pr.id, p.program_name,pr.acad_session,pr.id,pr.course_name,pr.course_id,type,pre_req_course_name,pre_req_course_id FROM [${slug}].pre_requisites pr
        INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
        WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId `)
      })
}

static getCount(slug,biddingId){
    return poolConnection.then(pool=>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`select COUNT(*) FROM [${slug}].pre_requisites WHERE active = 1 AND bidding_session_lid = @biddingId`)
      })
}

static delete(preRequisitesId,slug,biddingId,userid){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('pre_requisite_lid',sql.Int,preRequisitesId)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_pre_requisites]`)
    })
}
static update(inputJson,biddingId,userid,slug){
    return poolConnection.then(pool=>{
        return pool.request()
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('input_json',sql.NVarChar(sql.MAX),inputJson)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_pre_requisites]`)
    })
}


static getCountSearch(slug,biddingId,letterSearch,userId){
    return poolConnection.then(pool =>{
      
        return pool.request()
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .input('last_modified_by',sql.Int,userId)
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT COUNT(*) FROM [${slug}].pre_requisites pr
        INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
        WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId 
         AND (p.program_name LIKE @letterSearch OR pr.acad_session LIKE  @letterSearch OR pr.course_name LIKE @letterSearch OR type LIKE @letterSearch OR pre_req_course_name LIKE @letterSearch) `)
    })
}
static search(slug, biddingId, letterSearch,pageNo,showEntry) {
    
    if(pageNo){
    return poolConnection.then(pool => {
        return pool.request()
            .input('pageNo',sql.Int,pageNo)
            .input('biddingId', sql.Int, biddingId)
            .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
            .query(`SELECT pr.id, p.program_name,pr.acad_session,pr.id,pr.course_name,pr.course_id,type,pre_req_course_name,      
            pre_req_course_id FROM [${slug}].pre_requisites pr
            INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
            WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId 
             AND (p.program_name LIKE @letterSearch OR pr.acad_session LIKE  @letterSearch OR pr.course_name LIKE @letterSearch OR type LIKE @letterSearch OR pre_req_course_name LIKE @letterSearch) 
             ORDER BY pr.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
    })}
    else{
        return poolConnection.then(pool => {
        
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT pr.id, p.program_name,pr.acad_session,pr.id,pr.course_name,pr.course_id,type,pre_req_course_name,pre_req_course_id FROM [${slug}].pre_requisites pr
                INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId 
                 AND (p.program_name LIKE @letterSearch OR pr.acad_session LIKE  @letterSearch OR pr.course_name LIKE @letterSearch OR type LIKE @letterSearch OR pre_req_course_name LIKE @letterSearch)`);
        })
    }
}
static showEntryList(slug,biddingId,showEntry,pageNo){
    console.log('inside the showEntryList function');
    if(pageNo){
        return poolConnection.then(pool=>{
          return pool.request() 
          .input('biddingId',sql.Int,biddingId)
          .input('pageNo',sql.Int,pageNo)
          .query(`SELECT pr.id, p.program_name,pr.acad_session,pr.id,pr.course_name,pr.course_id,type,pre_req_course_name,pre_req_course_id FROM [${slug}].pre_requisites pr
          INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
          INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
          WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId 
          ORDER BY pr.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
        })
    }
    else{
        return poolConnection.then(pool=>{
            return pool.request() 
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT TOP ${showEntry} pr.id , p.program_name,pr.acad_session,pr.id,pr.course_name,pr.course_id,type,pre_req_course_name,pre_req_course_id FROM [${slug}].pre_requisites pr
            INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
            INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
            WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId `)
          })
    }
}
static getCounts(slug,biddingId){
    return poolConnection.then(pool=>{
      return pool.request() 
      .input('biddingId',sql.Int,biddingId)
      .query(`SELECT COUNT(*) FROM [${slug}].pre_requisites pr
      INNER JOIN [${slug}].courses c ON  pr.course_id = c.course_id AND c.bidding_session_lid = @biddingId
      INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
      WHERE pr.active = 1 AND pr.bidding_session_lid = @biddingId `)
    })
}





}
