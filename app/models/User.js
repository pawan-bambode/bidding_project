const {sql, poolConnection} = require('../../config/db');
const user = require('../controllers/user');

module.exports = class User {
    static getUserDetails (username,slug) {
        return poolConnection.then(pool => {
            return pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT  u.*,ur.role_name,sd.sap_id  FROM [${slug}].users u 
            INNER JOIN [${slug}].user_roles ur ON ur.id  = u.role_lid
            INNER JOIN [${slug}].student_data sd ON sd.email = u.username WHERE username = @username AND u.active = 1`)
        })
    }
}