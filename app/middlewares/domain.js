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
                // console.log('subDomain1', subDomain)
 
                res.locals.slug = subDomain;
                res.locals.organizationId = 24
                res.locals.campusId = 10
                res.locals.campusIdSap = '50070078'
                res.locals.organizationIdSap = '00004533'
                res.locals.acadmicYear = 2023
                res.locals.page_filter = JSON.parse(process.env.PAGE_FILTER)
                //console.log('LOCALS:::::::', res.locals)

                
                next();
              
        } else {
            console.log('in else condition')
            next();
        }



    },
}