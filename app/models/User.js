const { sql, poolConnection } = require('../../config/db');

module.exports = class User {
    static getUserDetails(requestBody, slug, biddingId) {
      
        let username = requestBody.username;

        return poolConnection.then(pool => {
            return pool.request()
                .input('username', sql.VarChar, username)
                .query(`SELECT role_lid FROM [${slug}].users WHERE username = @username`);
        }).then(result => {
            let role_lid = result.recordset[0].role_lid;
           
            return poolConnection.then(pool => {

                if (role_lid) {
                    return pool.request()
                        .input('role_lid', sql.Int, role_lid)
                        .query(`SELECT role_name FROM [dbo].user_roles WHERE id = @role_lid`);
                } else {
                    return Promise.resolve(null);
                }
            }).then(adminRoleResult => {

                let roleName = adminRoleResult.recordset[0].role_name;
               
                if (roleName == 'student') {
                    return poolConnection.then(pool => {
                        return pool.request()
                            .input('username', sql.VarChar, username)
                            .input('biddingId', sql.Int, biddingId)
                            
                            .query(`SELECT u.*, ur.role_name, sd.sap_id, sd.id AS student_lid 
                                     FROM [${slug}].users u 
                                     INNER JOIN [dbo].user_roles ur ON ur.id = u.role_lid
                                     INNER JOIN [${slug}].student_data sd ON sd.email = u.username 
                                     WHERE username = @username AND u.active = 1 AND sd.active = 1 
                                     AND sd.bidding_session_lid = @biddingId`);
                    });
                } else if(roleName == 'admin') {
                    return poolConnection.then(pool => {
                        return pool.request()
                            .input('username', sql.VarChar, username)
                            .query(`SELECT u.*, ur.role_name 
                                     FROM [${slug}].users u 
                                     INNER JOIN [dbo].user_roles ur ON ur.id  = u.role_lid
                                     WHERE username = @username AND u.active = 1`);
                    });
                }
            });
        });
    }
    
};
