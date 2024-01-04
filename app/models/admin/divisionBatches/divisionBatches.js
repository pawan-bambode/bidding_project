const {sql,poolConnection} = require('../../../../config/db')

module.exports = class divisionBatches {

    static uploadDivisionBatches(slug, inputJson, userid, biddingId){
        return poolConnection.then(pool=>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJson))
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_upload_division_batches]`)
        })
    }

    static update(inputJson, biddingId, userid, slug){
        return poolConnection.then(pool=>{
                return pool.request()
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('input_json', sql.NVarChar(sql.MAX), inputJson)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_update_division_batches]`)
            })
    }

   static delete(divisionId, slug, biddingId, userid){
      return poolConnection.then(pool =>{
         return pool.request()
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('div_batch_lid', sql.Int, divisionId)
            .output('output_json',sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_division_batches]`)
        })
    }

    static deleteAll(slug, biddingId, userId, deleteDivisionBatchesIdJson){
        deleteDivisionBatchesIdJson = Object.keys(deleteDivisionBatchesIdJson).map(key => {
                const id = deleteDivisionBatchesIdJson[key];
                return { id: parseInt(id) }; 
        })
        return poolConnection.then(pool =>{
            return pool.request()
            .input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingId)
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(deleteDivisionBatchesIdJson))
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_all_division_batches]`)
        })
    }
    
    static getDivisionBatches(slug, biddingId){
        let showEntry = 10;
        return poolConnection.then(pool=>{
          return pool.request() 
           .input('biddingId', sql.Int, biddingId)
           .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                   db.division, db.batch,max_seats 
                   FROM [${slug}].division_batches db 
                   INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                   INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                   INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                   WHERE db.active = 1 AND db.bidding_session_lid = @biddingId`)
        })
    }

    static getCountOfDivisionBatches(slug, biddingId){
        return poolConnection.then(pool=>{
            return pool.request() 
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id WHERE db.active = 1 AND db.bidding_session_lid = @biddingId`)
        })
    } 

    static getProgramList(slug, biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('bidding_session_lid', sql.Int, biddingId)
            .query(`SELECT p.program_id, program_name 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_id = db.course_id 
                    INNER JOIN [${slug}].programs p ON c.program_id = p.program_id WHERE p.bidding_session_lid = @bidding_session_lid AND db.bidding_session_lid = @bidding_session_lid GROUP BY p.program_id, p.program_name`)
        })
    }

    static search(slug, biddingId, letterSearch, userId, showEntry, pageNo){
        if(pageNo){
            return poolConnection.then(pool =>{
                return pool.request()
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .input('last_modified_by', sql.Int, userId)
                .input('biddingId', sql.Int, biddingId)
                .input('pageNo', sql.Int, pageNo)
                .query(`SELECT db.id, p.program_name, ad.acad_session, c.course_name, db.division, 
                        db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
            })
        }else{
            return poolConnection.then(pool =>{
                return pool.request()
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .input('last_modified_by', sql.Int, userId)
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                        WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE  @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE @letterSearch )`);
            })
        }
    }

    static getCountSearch(slug, biddingId, letterSearch, userId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
            .input('last_modified_by', sql.Int, userId)
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id 
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND (p.program_name LIKE  @letterSearch OR ad.acad_session LIKE @letterSearch OR c.course_name LIKE @letterSearch OR db.division LIKE @letterSearch OR db.batch LIKE @letterSearch OR db.max_seats LIKE  @letterSearch)`)
        })
    }

    static showEntryDivisionBatchesList(slug, biddingId, showEntry, pageNo){
        if(pageNo){
            return poolConnection.then(pool=>{
            return pool.request() 
            .input('biddingId', sql.Int, biddingId)
            .input('pageNo', sql.Int, pageNo)
            .query(`SELECT db.id,p.program_name,ad.acad_session, c.course_name, db.division,
                    db.batch, max_seats 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE c.active = 1 AND c.bidding_session_lid = @biddingId
                    ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
            })
        }
        else{
            return poolConnection.then(pool=>{
                return pool.request() 
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name,
                        db.division, db.batch, max_seats 
                        FROM [${slug}].division_batches db 
                        INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                        INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
            })
        }
    }
    static getCounts(slug, biddingId){
        return poolConnection.then(pool=>{
        return pool.request() 
        .input('biddingId',sql.Int, biddingId)
        .query(`SELECT COUNT(*) 
                FROM [${slug}].division_batches db 
                INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
        })
    }

    static getProgramList(slug, biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('bidding_session_lid', sql.Int, biddingId)
            .query(`SELECT p.program_name, p.program_id 
                    FROM [${slug}].courses c
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id WHERE c.active = 1 AND p.bidding_session_lid = @bidding_session_lid GROUP BY p.program_id, program_name`)
        })
    }

    static filterByProgramId(slug, biddingId, programId, showEntry){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                    db.division, db.batch, max_seats 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId ORDER BY db.id`)
        })
    }

    static getCountfilterByProgramId(slug, biddingId, programId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId`)
        })
    }

    static sessionByProgramId(slug, biddingId, programId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .query(`SELECT c.sap_acad_session_id, c.acad_session 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id WHERE db.bidding_session_lid = @biddingId AND db.active = 1 AND program_id = @programId  GROUP BY c.sap_acad_session_id, c.acad_session ORDER BY c.sap_acad_session_id`);
        })
    }

    static filterBySessionId(slug, biddingId, programId, sessionId, showEntry){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .input('sessionId', sql.Int, sessionId)
            .query(`SELECT TOP ${showEntry} db.id, p.program_name, ad.acad_session, c.course_name, 
                    db.division, db.batch, max_seats 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @sessionId ORDER BY db.id`)
        })
    }

    static getCountFilterBySessionId(slug, biddingId, programId, sessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('programId', sql.Int, programId)
            .input('sessionId', sql.Int, sessionId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].division_batches db 
                    INNER JOIN [${slug}].courses c ON db.course_lid = c.id  
                    INNER JOIN [${slug}].programs p ON p.program_id = c.program_id AND p.bidding_session_lid = @biddingId
                    INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                    WHERE db.active = 1 AND db.bidding_session_lid = @biddingId AND p.program_id = @programId AND c.sap_acad_session_id = @sessionId`)
        })
    }
    static getBiddingCourse(slug, biddingId){

            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                        c.sap_acad_session_id, c.credits, db.max_seats, RTRIM(LTRIM(db.division)) as division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                        d.day_name 
                        FROM [${slug}].timetable t 
                        INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                        INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                        INNER JOIN [dbo].days d ON d.id = t.day_lid
                        WHERE t.bidding_session_lid = @biddingId`)
            })
    }
    
    static getAreaList(slug, biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT DISTINCT area_name 
                    FROM [${slug}].timetable t 
                    INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                    INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                    INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                    INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                    INNER JOIN [dbo].days d ON d.id = t.day_lid 
                    WHERE t.bidding_session_lid = @biddingId`)
        })
    }

    static getBiddingCourseByAcadSession(slug, biddingId, acadSessionId){
     
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('acadSessionId', sql.Int, acadSessionId)
            .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                    c.credits, db.max_seats, db.division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time,
                    100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, d.day_name, c.sap_acad_session_id  
                    FROM [${slug}].timetable t 
                    INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                    INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                    INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                    INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                    INNER JOIN [dbo].days d ON d.id = t.day_lid
                    WHERE c.sap_acad_session_id = @acadSessionId AND t.bidding_session_lid = @biddingId`)
        })
    }

    static getBiddingCourseByCourseId(slug, biddingId, acadSessionId, courseId){
      if(acadSessionId){

            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .input('courseId', sql.Int, courseId)
                .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, c.credits, 
                        db.max_seats, db.division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, d.day_name, c.sap_acad_session_id  
                        FROM [${slug}].timetable t 
                        INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                        INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                        INNER JOIN [dbo].days d ON d.id = t.day_lid 
                        WHERE c.sap_acad_session_id = @acadSessionId AND c.course_id = @courseId AND t.bidding_session_lid = @biddingId`)
            })
        }
        else{
            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('courseId', sql.Int, courseId)
                .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, c.credits, 
                        db.max_seats, db.division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, d.day_name, c.sap_acad_session_id  
                        FROM [${slug}].timetable t 
                        INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                        INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                        INNER JOIN [dbo].days d ON d.id = t.day_lid 
                        WHERE c.course_id = @courseId AND t.bidding_session_lid = @biddingId`)
            })
        }
    }

    static getBiddingCourseByAreaName(slug, biddingId, acadSessionId, areaName){
        if(acadSessionId){
  
              return poolConnection.then(pool =>{
                  return pool.request()
                  .input('biddingId', sql.Int, biddingId)
                  .input('acadSessionId', sql.Int, acadSessionId)
                  .input('areaName', sql.NVarChar, `%${areaName}%`)
                  .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, 
                          c.acad_session, c.credits, db.max_seats, db.division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, d.day_name, c.sap_acad_session_id  
                          FROM [${slug}].timetable t 
                          INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                          INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                          INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                          INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                          INNER JOIN [dbo].days d ON d.id = t.day_lid 
                          WHERE c.area_name LIKE @areaName AND c.area_name LIKE @areaName AND t.bidding_session_lid = @biddingId`)
              })
          }
          else{
              return poolConnection.then(pool =>{
                  return pool.request()
                  .input('biddingId', sql.Int, biddingId)
                  .input('areaName', sql.NVarChar, `%${areaName}%`)
                  .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, c.credits, 
                          db.max_seats, db.division, t.faculty_id, t.faculty_name, CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, d.day_name, c.sap_acad_session_id  
                          FROM [${slug}].timetable t 
                          INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                          INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                          INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid 
                          INNER JOIN [${slug}].courses c ON c.id = db.course_lid
                          INNER JOIN [dbo].days d ON d.id = t.day_lid 
                          WHERE c.area_name LIKE @areaName AND t.bidding_session_lid = @biddingId`)
              })
          }
      }

    static getCourseNameForFilter(slug, biddingId, acadSessionId){
        if(acadSessionId){ 
            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('acadSessionId', sql.Int, acadSessionId)
                .query(`SELECT c.course_id, c.course_name FROM [${slug}].timetable t
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId 
                        AND c.sap_acad_session_id = @acadSessionId`);
            });
        }
        else{
            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT c.course_id, c.course_name FROM [${slug}].timetable t
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId `);
            });
        }    
    }

    static getCourseNameAreaWiseFilter(slug, biddingId, acadSessionId, areaName){
        if(acadSessionId){ 
            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('areaName', sql.NVarChar, `%${areaName}%`)
                .query(`SELECT DISTINCT c.course_id, c.course_name FROM [${slug}].timetable t
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId 
                        AND c.area_name LIKE @areaName`);
            });
        }
        else{
            return poolConnection.then(pool =>{
                return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('areaName', sql.NVarChar, `%${areaName}%`)
                .query(`SELECT DISTINCT c.course_id, c.course_name FROM [${slug}].timetable t
                        INNER JOIN [${slug}].division_batches db ON db.id = t.division_batch_lid
                        INNER JOIN [${slug}].courses c ON c.id = db.course_lid WHERE t.active = 1 AND db.active = 1 AND c.active = 1 AND t.bidding_session_lid = @biddingId AND c.area_name LIKE @areaName`);
            });
        }    
    }

    static addFavourite(slug, userid, biddingId, favJson) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('input_json', sql.NVarChar(sql.MAX), favJson)
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_add_favourite]`)
        })
    } 
}
