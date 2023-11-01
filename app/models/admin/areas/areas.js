const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class Area {
   static getAreaList(slug, biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT * FROM [${slug}].areas WHERE bidding_session_lid = @biddingId`);
    })
   }
   static getCount(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT COUNT(*) FROM [${slug}].areas WHERE bidding_session_lid = @biddingId`);
    })
   }
   
   static refresh(slug,biddingId,userid){
    return poolConnection.then(pool =>{
        return pool.request().
        input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int,biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_refresh_areas]`)
       
    })
   }
static showEntryAreaList(slug,biddingId,showEntry,pageNo){
    console.log('inside the showEntryAreaList',showEntry ,pageNo);
   if(pageNo){
    return poolConnection.then(pool=>{
      return pool.request() 
      .input('biddingId',sql.Int,biddingId)
      .input('pageNo',sql.Int,pageNo)
      .query(`SELECT a.id, a.area_name FROM [${slug}].areas a WHERE a.active = 1 AND a.bidding_session_lid = @biddingId
      ORDER BY a.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
    })
}
else{
    return poolConnection.then(pool=>{
        return pool.request() 
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT TOP ${showEntry} a.id, a.area_name FROM [${slug}].areas a WHERE a.active = 1 AND a.bidding_session_lid = @biddingId`)
      })
}
}
static getCountsOfShowEntry(slug,biddingId){
     return poolConnection.then(pool=>{
         return pool.request() 
         .input('biddingId',sql.Int,biddingId)
         .query(`SELECT COUNT(*) FROM [${slug}].areas a WHERE a.active = 1 AND a.bidding_session_lid = @biddingId`)
       })
 }
 
 static search(slug,biddingId,pageNo,letterSearch,showEntry){
    showEntry = showEntry?showEntry:10;
   if(pageNo){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('pageNo',sql.Int,pageNo)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .query(`SELECT  a.id, a.area_name  FROM [${slug}].areas a
        WHERE a.active = 1 AND a.bidding_session_lid = @bidding_session_lid AND (a.area_name LIKE @letterSearch)    
        ORDER BY p.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)

    })
} else{
    return poolConnection.then(pool =>{
        return pool.request()
        .input('pageNo',sql.Int,pageNo)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .query(`SELECT TOP ${showEntry}  a.id, a.area_name FROM [${slug}].areas a WHERE a.active = 1 AND a.bidding_session_lid = @bidding_session_lid AND (a.area_name LIKE @letterSearch)`)
    })
}
}

static getCountOfSearch(slug,biddingId,pageNo,letterSearch,showEntry){
    showEntry = showEntry?showEntry:10;
    return poolConnection.then(pool =>{
        return pool.request()
        .input('pageNo',sql.Int,pageNo)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .query(`SELECT COUNT(*) FROM [${slug}].areas a WHERE a.active = 1 AND a.bidding_session_lid = @bidding_session_lid AND (a.area_name LIKE @letterSearch)`)
    })
}
}