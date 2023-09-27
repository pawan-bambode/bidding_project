const {sql,poolConnection} = require('../../../config/db');
const pool = require('mssql');

module.exports =  class Program {
 static getAllProgram(req,res){
    return poolConnection.then(pool =>{
        return pool.request().input(`SELECT * FROM [dbo].programs`);
    })
 }

}