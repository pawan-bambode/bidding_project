const {
    append
} = require('express/lib/response');
const {
    sql,
    poolConnection,
    execPreparedStmt
} = require('../../config/db')

const {
    currentAcadYear
} = require('../utils/util')

module.exports = {
    verifySubdomain: (req, res, next) => {
        let checkArr = ['map', 'png', 'jpg', 'jpeg', 'css', 'js', 'ico']
        let isUrl = 1;
        let splitedDomain = req.url.split('.')
        for (let item of checkArr) {
            if (splitedDomain[splitedDomain.length - 1] == item) {
                isUrl = 0;
                break;
            }
        }

        if (isUrl) {
            let subDomain = req.headers.host.split(".")[0];

            if (subDomain === 'timetable') 
                return next()
            
                res.locals.slug = subDomain;
                res.locals.organizationId = 24
                res.locals.campusId = 10
                res.locals.campusIdSap = '50070078'
                res.locals.organizationIdSap = '00004533'
                res.locals.acadmicYear = 2023
                res.locals.page_filter = JSON.parse(process.env.PAGE_FILTER)
            
                poolConnection.then(async pool => {
                    let slug = res.locals.slug;
                    const recordCount = await pool.request()
                    .query(`SELECT COUNT(*) AS count FROM [${slug}].bidding_session WHERE status = 1`);
                
                if (recordCount.recordset[0].count > 0) {
                    return pool.request()
                        .query(`SELECT bidding_name, id, status FROM [${slug}].bidding_session WHERE active = 1 AND status = 1`);
                } else {
                    return pool.request()
                        .query(`SELECT bidding_name, id, status FROM [${slug}].bidding_session WHERE active = 1`);
                }
                }).then(result => {
                     res.locals.biddingId = result.recordset[0].id
                     res.locals.biddingName = result.recordset[0].bidding_name
                     res.locals.status = result.recordset[0].status

                     next();
                }).catch(error =>{
                    next();
                })
                
              
        } else {
            console.log('in else condition')
            next();
        }



    },
}