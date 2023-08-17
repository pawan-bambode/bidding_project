const {sql, poolConnection} = require('../../config/db');

module.exports = class User {
    static getUserDetails (username) {
        return poolConnection.then(pool => {
            return pool.request().query(`SELECT * FROM users WHERE username = '${username}'`)
        })
    }
}