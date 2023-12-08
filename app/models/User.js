const {sql, poolConnection} = require('../../config/db');
const user = require('../controllers/user');

module.exports = class User {
    static getUserDetails (requestBody,slug) {
        console.log('values of requestBody',requestBody);
        let username = requestBody.username;
        let roleTypeId = requestBody.userTypeId;
       
        return poolConnection.then(pool => {
            if(roleTypeId === '2'){
            return pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT  u.*,ur.role_name,sd.sap_id ,sd.id AS student_lid FROM [${slug}].users u 
            INNER JOIN [${slug}].user_roles ur ON ur.id  = u.role_lid
            INNER JOIN [${slug}].student_data sd ON sd.email = u.username WHERE username = @username AND u.active = 1`)
            }
            else{
                return pool.request()
                .input('username', sql.VarChar, username)
                .query(`SELECT  u.*,ur.role_name  FROM [${slug}].users u 
                INNER JOIN [${slug}].user_roles ur ON ur.id  = u.role_lid WHERE username = @username AND u.active = 1`)
            }
        })
    }
}