const { json, request } = require('express');
const {sql,poolConnection} = require('../../../../config/db')
const pool = require('mssql');

module.exports = class DashboardCount{
    static async getCouresCount(slug){
      
        try {
            let courseCount = 0
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].courses WHERE active = 1`);
            courseCount = result.recordset[0]['']; 
            return courseCount;
        } catch (error) {
            console.error('Error:', error);
            throw error; 
        }
    }
    static async getProgramCount(slug){
        try {
           
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].programs WHERE active = 1`);
            const programCount = result.recordset[0]['']; 
            return programCount;
        } catch (error) {
            console.error('Error:', error);
            throw error; 
        }
    }
    static async getProgramSessionCount(slug){
        try{
            let programSessionCount = 0;
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].program_sessions WHERE active = 1`);
            programSessionCount  = result.recordset[0][''];
            return programSessionCount;
        }catch(error) {
            console.log('Error::',error);
            throw error;
        }
    }
    static async getAreaCount(slug){
        try{
            let  areaCount = 0;
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].areas WHERE active = 1`);
             areaCount  = result.recordset[0][''];
            return areaCount;
        }catch(error) {
            console.log('Error::',error);
            throw error;
        }
    }
    static async getConcentrationCount(slug){
        try{
            let  concentrationCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].concentration WHERE active = 1`);
            concentrationCount  = result.recordset[0][''];
            return concentrationCount;
        }catch(error) {
            console.log('Error::',error);
            throw error;
        }
    }

    static async getConcentrationSettingsCount(slug){
        try{
            let  concentrationSettingsCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].concentration_settings WHERE active = 1`);
            concentrationSettingsCount  = result.recordset[0][''];
            return concentrationSettingsCount;
        }catch(error) {
            console.log('Error::',error);
            throw error;
        }
    }
    static async getStudentCount(slug){
        try{
            let  studentCount  = 0;
            const pool = await poolConnection;
            const result = await pool.request().query(`SELECT COUNT(*) FROM [${slug}].student_data WHERE active = 1`);
            studentCount  = result.recordset[0][''];
            return studentCount;
        }catch(error) {
            console.log('Error::',error);
            throw error;
        }
    }
}