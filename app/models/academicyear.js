const s = require('connect-redis');
const{sql, poolConnection} = require('../../config/db');

const pool = require('mssql');

module.exports = class academicYear{
   
    static save(academicdetails) {
        return poolConnection.then(pool => {
            let request = pool.request()
            .input('product_name',sql.NVarChar,academicdetails.product)
            .input('customer_name',sql.NVarChar,academicdetails.customer)
            .input('academic_year',sql.NVarChar,academicdetails.academic_year)
            .input('bidding_cycle',sql.NVarChar,academicdetails.biding_cycle)
            .input('ftp_folder_name',sql.NVarChar,academicdetails.ftp_folder_name)
            return request.query(`insert into [dbo].academic_year(product_name,customer_name,academic_year,bidding_cycle,ftp_folder_name) values(@product_name,@customer_name,@academic_year,@bidding_cycle,@ftp_folder_name)`)
        })
    }
}