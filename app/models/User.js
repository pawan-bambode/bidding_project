const {sql, poolConnection} = require('../../config/db');

module.exports = class User {
    static getUserDetails (username) {
        return poolConnection.then(pool => {
            return pool.request()
            .input('username', sql.VarChar, username)
           .query('SELECT * FROM [sbm-mum].users WHERE username = @username');
            
        })
    }
}