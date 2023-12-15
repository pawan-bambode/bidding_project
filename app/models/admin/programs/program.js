const {sql,poolConnection} = require('../../../../config/db');

module.exports =  class Program {
  
    static getAllProgram(req,res,slug,biddingId){
        let showEntry = 10;
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT TOP ${showEntry} id, RTRIM(LTRIM(program_name)) AS program_name,
                    RTRIM(LTRIM(abbr)) AS abbr, RTRIM(LTRIM(ISNULL(program_code,'NA'))) program_code  
                    FROM [${slug}].programs WHERE active = 1 AND bidding_session_lid = @biddingId`);
        })
    }
    
    static getCount(slug,biddingId){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT COUNT(*) 
                    FROM [${slug}].programs WHERE bidding_session_lid = @biddingId AND active = 1`)
        })
    }

    static getAllProgramFromDbo(req,res, slug, abbr, biddingId){
        abbr = 'SBM-NM-M';
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .input('abbr', sql.NVarChar, abbr)
            .query(`SELECT RTRIM(LTRIM(dboP.program_name))AS program_name, RTRIM(LTRIM(dboP.abbr)) as abbr,
                    dboP.program_id FROM [dbo].programs dboP  WHERE dboP.program_id NOT IN( SELECT program_id
                    FROM [${slug}].programs p
                    INNER JOIN [${slug}].bidding_session bs ON bs.id = p.bidding_session_lid WHERE p.active = 1 
                    AND bs.status =1 ) AND dboP.abbr = @abbr`);
        })
    }

    static save(inputJSON, slug, userid, biddingId) {
        return poolConnection.then(pool => {
            return pool.request().input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
                .input('last_modified_by', sql.Int, userid)
                .input('bidding_session_lid', sql.Int, biddingId)
                .output('output_json', sql.NVarChar(sql.MAX))
                .execute(`[${slug}].[sp_import_programs]`)
        })
    } 

    static update(inputJSON, slug, userid, biddingSessionId){
        return poolConnection.then(pool =>{
            return pool.request().input('input_json', sql.NVarChar(sql.MAX), JSON.stringify(inputJSON))
            .input('last_modified_by', sql.Int, userid)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_update_programs]`)
        })
    }
    static delete(programlid, slug, userId, biddingSessionId){
        return poolConnection.then(pool =>{
            return pool.request().input('input_program_lid', sql.Int, programlid).
            input('last_modified_by', sql.Int, userId)
            .input('bidding_session_lid', sql.Int, biddingSessionId)
            .output('output_json', sql.NVarChar(sql.MAX))
            .execute(`[${slug}].[sp_delete_programs]`)
        })
    }

    static search(slug, biddingId, pageNo, userId, letterSearch, showEntry){
        showEntry = showEntry?showEntry:10;
        if(pageNo){
            return poolConnection.then(pool =>{
                return pool.request()
                .input('pageNo', sql.Int, pageNo)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT id, RTRIM(LTRIM(program_name)) AS program_name, RTRIM(LTRIM(abbr)) AS abbr,
                        RTRIM(LTRIM(ISNULL(program_code,'NA'))) program_code 
                        FROM [${slug}].programs p WHERE p.active = 1 AND p.bidding_session_lid = @bidding_session_lid AND (p.program_name  LIKE @letterSearch OR p.abbr LIKE @letterSearch OR p.program_code LIKE @letterSearch ) ORDER BY p.id DESC OFFSET (@pageNo - 1) * ${showEntry} ROWS FETCH NEXT ${showEntry} ROWS ONLY`)
            })
        } else{
            return poolConnection.then(pool =>{
                return pool.request()
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT TOP ${showEntry} id, RTRIM(LTRIM(program_name)) AS program_name,
                        RTRIM(LTRIM(abbr)) AS abbr, RTRIM(LTRIM(ISNULL(program_code,'NA'))) program_code 
                        FROM [${slug}].programs p WHERE p.active = 1 AND p.bidding_session_lid = @bidding_session_lid AND (p.program_name LIKE @letterSearch OR p.abbr LIKE @letterSearch OR p.program_code LIKE @letterSearch)`)
            })
        }
    }

    static getCountOfSearch(slug, biddingId, pageNo, userId, letterSearch, showEntry){
        showEntry = showEntry?showEntry:10;

        if(pageNo){
            return poolConnection.then(pool =>{
                return pool.request()
                .input('pageNo', sql.Int, pageNo)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].programs p WHERE p.active = 1 AND p.bidding_session_lid = @bidding_session_lid AND (p.program_name LIKE @letterSearch AND p.abbr LIKE @letterSearch AND p.program_code LIKE @letterSearch)`)
            })
        } else{
            return poolConnection.then(pool =>{
                return pool.request()
                .input('pageNo', sql.Int, pageNo)
                .input('last_modified_by', sql.Int, userId)
                .input('bidding_session_lid', sql.Int, biddingId)
                .input('letterSearch', sql.NVarChar, `%${letterSearch}%`)
                .query(`SELECT COUNT(*) 
                        FROM [${slug}].programs p WHERE p.active = 1 AND p.bidding_session_lid = @bidding_session_lid AND (p.program_name LIKE @letterSearch OR p.abbr LIKE @letterSearch OR p.program_code LIKE @letterSearch)`)
            })
        }
    }

    static showEntryProgramList(slug, biddingId, showEntry){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId', sql.Int, biddingId)
            .query(`SELECT TOP ${showEntry} id, RTRIM(LTRIM(program_name)) AS program_name, 
                    RTRIM(LTRIM(abbr)) AS abbr, RTRIM(LTRIM(ISNULL(program_code,'NA'))) program_code  
                    FROM [${slug}].programs WHERE active = 1 AND bidding_session_lid = @biddingId`);
        })
    }
 
    static getCounts(slug, biddingId, showEntry){
        return poolConnection.then(pool =>{
            return pool.request()
            .input('biddingId',sql.Int,biddingId)
            .query(`SELECT COUNT(*)  
                    FROM [${slug}].programs WHERE active = 1 AND bidding_session_lid = @biddingId`);
        })
    }
}