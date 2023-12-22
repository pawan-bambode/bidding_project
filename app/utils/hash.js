const crypto = require("crypto")
require('dotenv').config()

module.exports = {

    hashPassword:(password) => {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString("hex")
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(salt + ":" + derivedKey.toString('hex'))
            });
        })
    },

   verifyPassword: (password, hash) => {
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":")
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(key == derivedKey.toString('hex'))
            });
        })
    },
    getCountOfCourses:async (slug) => {
        return new Promise((resolve, reject) => {
          resolve(result);
        });
      }
}
