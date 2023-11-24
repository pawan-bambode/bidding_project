const {sql, poolConnection} = require('../../config/db');
const user = require('../controllers/user');

module.exports = class User {
    static getUserDetails (username,slug) {
        console.log('values of username',username);
        console.log('values of slug',slug);
        return poolConnection.then(pool => {
            return pool.request()
            .input('username', sql.VarChar, username)
            .query(`SELECT u.*,ur.role_name FROM [${slug}].users u INNER JOIN [${slug}].user_roles ur ON ur.id  = u.role_lid
             WHERE username = @username AND active = 1`)
        })
    }
}