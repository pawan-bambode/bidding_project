const {
    sql,
    poolConnection,
    execPreparedStmt
} = require('../../config/db')



function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

async function   currentAcadYear () {
    console.log('HERE:::::::::::::>>')
        let acadyear = await new Promise(async resolve => {
            return poolConnection.then(pool => {
                return pool.request().query(`SELECT input_acad_year FROM [dbo].academic_year WHERE is_locked = 1 AND name ='currrent_academic_year'`)
            })
            
        })
}

function isArray(array){
if (array.length > 0){

}
}
function convertExcelTimeToHHMMSS(excelTime) {
    if (typeof excelTime === 'number') {
        const hours = Math.floor(excelTime * 24);
        const minutes = Math.floor((excelTime * 24 - hours) * 60);
        const seconds = Math.floor(((excelTime * 24 - hours) * 60 - minutes) * 60);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        return excelTime;
    }
}


  
module.exports = {
    isJsonString,
    currentAcadYear,
    isArray,
    convertExcelTimeToHHMMSS
}