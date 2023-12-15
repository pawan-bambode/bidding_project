const {sql,poolConnection} = require('../../../../config/db')

module.exports = class AcadSession{
    static getAllAcadSession(){
        return poolConnection.then(pool =>{
            return pool.request()
            .query(`SELECT sap_acad_session_id, acad_session FROM [dbo].acad_sessions`);
        })
    }
}