const {sql,poolConnection} = require('../../../../config/db')

module.exports = class DemandEstimation
{
    static getDemandEstimationRoundList(slug, biddingId) {
        return poolConnection.then(pool => {
            return pool.request()
                .input('biddingId', sql.Int, biddingId)
                .input('demand', sql.NChar, 'DEMAND_ESTIMATION_ROUND')
                .query(`SELECT id, SUBSTRING(round_name, CHARINDEX('-', round_name) + 1, 
                        LEN(round_name)) AS DemandEstimation
                        FROM [${slug}].round_settings WHERE active = 1 AND bidding_session_lid = @biddingId AND round_name LIKE '%' + @demand + '%'`);
        });
    }

    static saveSelectedCourse(slug, biddingId, userid, student_lid, round_lid, selectedCourseJson){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(selectedCourseJson))
            .input('student_lid', sql.Int, student_lid)
            .input('round_lid', sql.Int, round_lid)
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_add_demand]`)
        })
    } 

    static getCourseListByAcadSession(slug, biddingId, showEntry, acadSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .input('acadSessionId',sql.Int,acadSessionId)
            .query(`SELECT TOP ${showEntry} c.*, p.program_name 
                    FROM [${slug}].courses c 
                    INNER JOIN [${slug}].programs p  ON c.program_id = p.program_id WHERE
                    c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND c.active = 1`)     
        })
    }

    static getCourseCountByAcadSession(slug, biddingId, acadSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('acadSessionId', sql.Int, acadSessionId)
            .query(`SELECT COUNT(*) AS count 
                    FROM [${slug}].courses c 
                    INNER JOIN [${slug}].programs p  ON c.program_id = p.program_id WHERE
                    c.bidding_session_lid = @biddingId AND c.sap_acad_session_id = @acadSessionId AND c.active = 1`)     
        })
    }
    
    static getAreaList(slug, biddingId, acadSessionId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('acadSessionId', sql.Int, acadSessionId)    
            .query(`SELECT DISTINCT area_name 
                    FROM [${slug}].courses WHERE bidding_session_lid = @biddingId AND sap_acad_session_id = @acadSessionId  AND active = 1`);
        })
    }

    static getCourseListByAreaName(slug, biddingId, showEntry, acadSessionId, areaName){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('acadSessionId', sql.Int, acadSessionId)
            .input('areaName', sql.NVarChar, `%${areaName}%`)
            .query(`SELECT TOP ${showEntry} c.*, p.program_name 
                    FROM [${slug}].courses c 
                    INNER JOIN [${slug}].programs p ON c.program_id = p.program_id WHERE c.sap_acad_session_id = @acadSessionId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND c.area_name LIKE @areaName`)     
        })
    }

    static getCountOfCourseListByAreaName(slug, biddingId, acadSessionId, areaName){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('acadSessionId', sql.Int, acadSessionId)
            .input('areaName', sql.NVarChar, `%${areaName}%`)
            .query(`SELECT COUNT(*) AS count 
                    FROM [${slug}].courses c 
                    INNER JOIN [${slug}].programs p  ON c.program_id = p.program_id WHERE c.sap_acad_session_id = @acadSessionId AND c.active = 1 AND c.bidding_session_lid = @biddingId AND c.area_name LIKE @areaName`)     
        })
    }
    static getFavCourseList(slug, biddingId, studentId){
     
       return poolConnection.then(pool =>{
        return pool.request()
        .input('biddingId', sql.Int, biddingId)
        .input('studentLid', sql.Int, studentId)
        .query(`SELECT t.division_batch_lid, c.area_name, c.course_name, c.course_id, c.acad_session, 
                c.sap_acad_session_id, c.credits, db.max_seats ,db.available_seats, RTRIM(LTRIM(db.division)) AS division,
                t.faculty_id, t.faculty_name, d.day_name, c.id AS course_lid,
                CONVERT(VARCHAR, sit.start_time, 100) AS StartTime, 
                CONVERT(VARCHAR, sit1.end_time, 100) AS EndTime, 
                IIF(sem.is_favourite IS NULL,0, sem.is_favourite) AS is_favourite
                FROM [${slug}].timetable t 
                INNER JOIN [dbo].slot_interval_timings sit ON t.start_slot_lid = sit.id
                INNER JOIN [dbo].slot_interval_timings sit1 ON t.end_slot_lid = sit1.id
                INNER JOIN [sbm-mum].division_batches db ON db.id = t.division_batch_lid 
                INNER JOIN [sbm-mum].courses c ON c.id = db.course_lid
                INNER JOIN [dbo].days d ON d.id = t.day_lid 
                LEFT JOIN [${slug}].student_elective_mapping sem ON sem.div_batch_lid = db.id AND sem.student_lid = @studentLid 
                LEFT JOIN [${slug}].student_elective_bidding seb ON t.division_batch_lid = seb.div_batch_lid AND seb.student_lid = @studentLid AND seb.bidding_session_lid = @biddingId AND seb.active = 1 ORDER BY sem.is_favourite DESC`)
       }) 
    }
    static searchByLetter(slug, biddingId, letterSearch, pageNo, showEntry, acadSessionId, area) {
        if(pageNo){
            if(acadSessionId && area){
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('area', sql.NVarChar, `%${area}%`)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction, c.sap_acad_session_id
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND c.sap_acad_session_id = @acadSessionId AND c.area_name LIKE @area AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY
                            `);
                })
            }
            else if(acadSessionId){
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('acadSessionId', sql.Int, acadSessionId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                                area_name, min_demand_criteria, year_of_introduction ,c.sap_acad_session_id
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                                WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND c.sap_acad_session_id = @acadSessionId AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                })
            }else{
                return poolConnection.then(pool => {
                    return pool.request()
                        .input('pageNo', sql.Int, pageNo)
                        .input('bidding_session_lid', sql.Int, biddingId)
                        .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                        .query(`SELECT c.id, course_name, credits, program_id, 
                                ad.acad_session, area_name, min_demand_criteria, year_of_introduction, 
                                c.sap_acad_session_id
                                FROM [${slug}].courses c
                                INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch) ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`);
                })
            }
        }
        else{
            return poolConnection.then(pool => {
                return pool.request()
                    .input('bidding_session_lid', sql.Int, biddingId)
                    .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                    .query(`SELECT c.id, course_name, credits, program_id, ad.acad_session, 
                            area_name, min_demand_criteria, year_of_introduction, c.sap_acad_session_id
                            FROM [${slug}].courses c
                            INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id WHERE c.bidding_session_lid = @bidding_session_lid AND active = '1' AND (course_name LIKE @letterSearch OR credits LIKE  @letterSearch OR program_id LIKE @letterSearch OR ad.acad_session LIKE @letterSearch OR area_name LIKE @letterSearch OR year_of_introduction LIKE @letterSearch OR min_demand_criteria LIKE @letterSearch)
                    `);
            })
        }
    }

    static showEntryCouresList(slug, biddingId, showEntry, pageNo){

        if(pageNo){
            return poolConnection.then(pool=>{
              return pool.request() 
              .input('biddingId', sql.Int, biddingId)
              .input('pageNo', sql.Int, pageNo)
              .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, ad.acad_session, 
                      area_name, min_demand_criteria, year_of_introduction
                      FROM [${slug}].courses c
                      INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                      WHERE c.active = 1 AND c.bidding_session_lid = @biddingId ORDER BY c.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
            })
        }
        else{
            return poolConnection.then(pool=>{
                return pool.request() 
                .input('biddingId', sql.Int, biddingId)
                .query(`SELECT TOP ${showEntry} c.id, course_name, credits, program_id, 
                        ad.acad_session, area_name, min_demand_criteria, year_of_introduction
                        FROM [${slug}].courses c
                        INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                        WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
              })
        }
    }

    static getCounts(slug, biddingId){
        return poolConnection.then(pool=>{
          return pool.request() 
          .input('biddingId', sql.Int, biddingId)
          .query(`SELECT COUNT(*)
                  FROM [${slug}].courses c
                  INNER JOIN [dbo].acad_sessions ad ON ad.sap_acad_session_id = c.sap_acad_session_id
                  WHERE c.active = 1 AND c.bidding_session_lid = @biddingId`)
        })
    }
    
    static getSelectedCourses(slug, biddingId, studentId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentId', sql.Int, studentId)
            .query(`SELECT c.id, c.area_name, c.course_name, c.acad_session, c.credits,
                    c.sap_acad_session_id 
                    FROM [${slug}].demand_estimation de 
                    INNER JOIN [${slug}].courses c ON c.id = de.course_lid WHERE de.student_lid =@studentId AND de.active = 1 AND c.active = 1`)
        })
    }

    static getFavouriteCourseList(slug, biddingId, studentId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('studentId', sql.Int, studentId)
            .query(`SELECT sem.*, db.course_id FROM [${slug}].student_elective_mapping sem
                    INNER JOIN [${slug}].division_batches db ON sem.div_batch_lid = db.id
                    WHERE sem.student_lid = @studentId AND sem.bidding_session_lid = @biddingId AND is_favourite = 1`);

        })
    }

}