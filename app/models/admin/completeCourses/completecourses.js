const { json } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');
const { use } = require('../../../routers/admin/courseworkload');
const s = require('connect-redis');

module.exports = class completeCourses {
 static uploadCompleteCoursesData(slug,inputJson,userid,biddingId){
return poolConnection.then(pool=>{
    return pool.request()
    .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(inputJson))
    .input('last_modified_by', sql.Int, userid)
    .input('bidding_session_lid',sql.Int,biddingId)
    .output('output_json', sql.NVarChar(sql.MAX))
    .execute(`[${slug}].[sp_upload_completed_courses]`)
})
}
static getCompleteCourseList(slug,biddingId,showEntry){
      showEntry = showEntry?showEntry: 10;
      return poolConnection.then(pool=>{
        return pool.request() 
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT TOP ${showEntry} cc.id, sd.student_name , cc.course_name FROM [${slug}].completed_courses cc 
        INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id  WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId AND sd.bidding_session_lid = @biddingId
        ORDER BY cc.id`)
      })
}

static getCount(slug,biddingId){
    return poolConnection.then(pool=>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .query(`SELECT COUNT(*)  FROM [${slug}].completed_courses cc 
        INNER JOIN [${slug}].student_data sd ON cc.sap_id = sd.sap_id  WHERE cc.active = 1 AND cc.bidding_session_lid = @biddingId`)
      })
}

static delete(courseId,slug,biddingId,userid){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('course_lid',sql.Int,courseId)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_courses]`)
    })
}
static update(inputJson,biddingId,userid,slug){
    return poolConnection.then(pool=>{
        return pool.request()
        .input('last_modified_by',sql.Int,userid)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('input_json',sql.NVarChar(sql.MAX),inputJson)
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_update_courses]`)
    })
}
static search(slug,biddingId,letterSearch,userId){
    return poolConnection.then(pool =>{
        let showEntry = 10;
        return pool.request()
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingId)
        .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction FROM [${slug}].courses c INNER  JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id  WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch  OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch)`)
    })
}

static getCountSearch(slug,biddingId,letterSearch,userId){
    return poolConnection.then(pool =>{
      
        return pool.request()
        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
        .input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingId)
        .query(`SELECT COUNT(*) FROM [${slug}].courses c INNER  JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id  WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch  OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch)`)
    })
}
static searchByLetter(slug, biddingId, letterSearch,pageNo,showEntry) {
    
    if(pageNo){
    return poolConnection.then(pool => {
        return pool.request()
            .input('pageNo',sql.Int,pageNo)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
            .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
                FROM [${slug}].courses c
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch  OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY
            `);
    })}
    else{
        return poolConnection.then(pool => {
        
            return pool.request()
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT  c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
                    FROM [${slug}].courses c
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch  OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch)
                `);
        })
    }
}
static showEntryCouresList(slug,biddingId,showEntry,pageNo){
    if(pageNo){
        return poolConnection.then(pool=>{
          return pool.request() 
          .input('biddingId',sql.Int,biddingId)
          .input('pageNo',sql.Int,pageNo)
          .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
          FROM [${slug}].courses c
          INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
          WHERE c.active = 1 AND c.bidding_session_lid = @biddingId
          ORDER BY c.id DESC  OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
        })
    }
    else{
        return poolConnection.then(pool=>{
            return pool.request() 
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
            FROM [${slug}].courses c
            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
            WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
          })
    }
}
static getCounts(slug,biddingId,showEntry){
    return poolConnection.then(pool=>{
      return pool.request() 
      .input('biddingId',sql.Int,biddingId)
      .query(`SELECT COUNT(*)
      FROM [${slug}].courses c
      INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
      WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
    })
}

// static getCountOfSearchLetter(slug, biddingId, letterSearch,pageNo) {
    
//     if(pageNo){
//     return poolConnection.then(pool => {
//         return pool.request()
//             .input('pageNo',sql.Int,pageNo)
//             .input('bidding_session_lid', sql.Int, biddingId)
//             .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
//             .query(`SELECT COUNT(c.id), c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
//                 FROM [${slug}].courses c
//                 INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
//                 WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch  OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC  OFFSET (@pageNo - 1) * 10 ROWS FETCH NEXT 10 ROWS ONLY
//             `);
//     })}
//     else{
//         return poolConnection.then(pool => {
        
//             return pool.request()
//                 .input('bidding_session_lid', sql.Int, biddingId)
//                 .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
//                 .query(`SELECT COUNT(c.id), c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
//                     FROM [${slug}].courses c
//                     INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
//                     WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch  OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch)
//                 `);
//         })
//     }
// }

static deleteAll(slug,biddingId,userId,deleteCompletedCoursesIdJson){
    deleteCompletedCoursesIdJson = Object.keys(deleteCompletedCoursesIdJson).map(key => {
    const id = deleteCompletedCoursesIdJson[key];
    return { id: parseInt(id) }; 
})
    return poolConnection.then(pool =>{
        console.log('valuesof ',JSON.stringify(deleteCompletedCoursesIdJson));
        return pool.request()
        .input('last_modified_by',sql.Int,userId)
        .input('bidding_session_lid',sql.Int,biddingId)
        .input('input_json',sql.NVarChar(sql.MAX),JSON.stringify(deleteCompletedCoursesIdJson))
        .output('output_json',sql.NVarChar(sql.MAX))
        .execute(`[${slug}].[sp_delete_all_completed_courses]`)
    })
}
static getProgramList(slug,biddingId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('bidding_session_lid',sql.Int,biddingId)
        .query(`select p.program_name,p.program_id from [${slug}].courses c
        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id WHERE c.active = 1 AND p.bidding_session_lid = @bidding_session_lid GROUP BY p.program_id,program_name`)
    })
}
static filterByProgramId(slug,biddingId,programId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId
        ORDER BY c.id`)
      })
}
static getCountfilterByProgramId(slug,biddingId,programId){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .query(`SELECT COUNT(*)
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId`)
      })
}
static sessionByProgramId(slug,biddingId,programId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .query(`SELECT TOP ${showEntry} ad.id, ad.sap_acad_session_id  ,ad.acad_session
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId
        GROUP BY ad.id,ad.sap_acad_session_id,ad.acad_session
        ORDER BY ad.id`)
      })
}
static filterBySessionId(slug,biddingId,programId,sessionId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .input('sessionId',sql.Int,sessionId)
        .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId
        ORDER BY c.id`)
      })
}

static getCountFilterBySessionId(slug,biddingId,programId,sessionId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .input('sessionId',sql.Int,sessionId)
        .query(`SELECT COUNT(*)
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId`)
      })
}
static moduleBySessionId(slug,biddingId,programId,sessionId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .input('sessionId',sql.Int,sessionId)
        .query(`SELECT TOP ${showEntry} c.id,c.course_id,c.course_name
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid =  @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId
        GROUP BY c.id,c.course_id,c.course_name
        ORDER BY c.id`)
      })
}
static filterByCourseId(slug,biddingId,programId,sessionId,courseId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .input('sessionId',sql.Int,sessionId)
        .input('courseId',sql.Int,courseId)
        .query(`SELECT TOP  ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, area_name, min_demand_criteria, year_of_introduction
        FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid =  @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId AND c.course_id = @courseId
        ORDER BY c.id`)
      })
}
static getCountFilterByCourseId(slug,biddingId,programId,sessionId,courseId,showEntry){
    return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId',sql.Int,biddingId)
        .input('programId',sql.Int,programId)
        .input('sessionId',sql.Int,sessionId)
        .input('courseId',sql.Int,courseId)
        .query(`SELECT COUNT(*) FROM [${slug}].courses c
        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
        WHERE c.active = 1 AND c.bidding_session_lid =  @biddingId AND program_id = @programId AND c.sap_acad_session_id = @sessionId AND c.course_id = @courseId`)
      })
}
}
