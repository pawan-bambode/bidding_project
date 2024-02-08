const { sql, poolConnection } = require('../../config/db');

module.exports = class User {
    static getUserDetails(requestBody, slug) {
        let username = requestBody.username;
        let roleTypeId = requestBody.userTypeId;

        return poolConnection.then(pool => {
            if (roleTypeId === '2') {
                return pool.request()
                    .input('username', sql.VarChar, username)
                    .query(`SELECT u.*, ur.role_name, sd.sap_id, sd.id AS student_lid 
                            FROM [${slug}].users u 
                            INNER JOIN [dbo].user_roles ur ON ur.id = u.role_lid
                            INNER JOIN [${slug}].student_data sd ON sd.email = u.username 
                            WHERE username = @username AND u.active = 1`);
            } else {
                return pool.request()
                    .input('username', sql.VarChar, username)
                    .query(`SELECT u.*, ur.role_name 
                            FROM [${slug}].users u 
                            INNER JOIN [dbo].user_roles ur ON ur.id  = u.role_lid
                            WHERE username = @username AND u.active = 1`);
            }
        });
    }
};
