// const saltRounds = 10;
const express = require('express')
const session = require('express-session')
const {
    v4: uuidv4
} = require('uuid');
const {
    hashPassword,
    verifyPassword
} = require('../utils/hash')



const {
    encrypt,
    decrypt
} = require('../utils/crypto')

const {
    RedisStore,
    redisClient
} = require('../../config/redis')


const {
    body,
    validationResult
} = require('express-validator');
const hash = require('../utils/hash');

const User = require('../models/User')

let store = new RedisStore({
    client: redisClient,
    ttl: 260
})

module.exports = {

    renderLoginPage: (req, res, next) => {
        res.render('login.ejs');
    },


    renderRegisterPage: (req, res, next) => {
        res.render('register.ejs')
    },


    authenticate: async (req, res, next) => {

        try {
            const sess = req.session;
                let userData = await User.getUserDetails(req.body.username,res.locals.slug);
        
                  if( userData.recordset.length === 0 ){
                    console.log('inside the lengh',userData.recordset.length);
                    return res.render('login', {
                        message: "Login failed. Your account is inactive. Please contact an administrator."
                    })
                  }
                  else{
                if (req.body.username == '' ) {
                    console.log('inside teh req.body.username',req.body.username);
                    return res.render('login', {
                        message: "Invalid username or password"
                    })
                }

                if (req.body.password == '') {
                    console.log('values of password',req.body.password);
                    return res.render('login', {
                        message: "Invalid username or password"
                    })
                }
            }
                let isVerified = await hash.verifyPassword(req.body.password, userData.recordset[0].password)

                req.session.userId = userData.recordset[0].id;
                req.session.username = userData.recordset[0].username;
                req.session.firstName = userData.recordset[0].first_name;
                req.session.lastName = userData.recordset[0].last_name;
                req.session.fullName =  userData.recordset[0].first_name + ' ' +userData.recordset[0].last_name;
                req.session.email = userData.recordset[0].email;
                req.session.subDomain = req.headers.host.split('.')[0];
            
                req.session.permissions = userData.recordset[0].role_name;
                req.session.modules = userData.recordset[0].role_name;

                if (req.body.is_trusted == "on") {
                    req.session.usersecretkey = encrypt(uuidv4())
                        const headers = {
                            ip: req.ip,
                            platform: req.headers["user-agent"]
                        };
                    
                }
        
                if (req.body.username === userData.recordset[0].username && isVerified == true && userData.recordset[0].role_name === 'admin') {
                    res.redirect('/admin/dashboard');
                }
                else if(req.body.username === userData.recordset[0].username && isVerified == true && userData.recordset[0].role_name === 'student'){
                    res.redirect('/student/dashboard');
                }
                 else {
                    res.send('This user has no permissions.');
                }
            //}
          
            
        } catch (err) {
            console.log("Error catched: ", err);
        }
    },

    dashboard: (req, res, next) => {
        console.log('Dash', req.session)
        res.render('dashboard.ejs', {
            username: req.session.username
        })
    },

    logout: (req, res) => {
        req.session.destroy(function (err) {
            res.redirect('/user/login')
        })
    }

}