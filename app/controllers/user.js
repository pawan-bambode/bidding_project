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


// const res = require('express/lib/response');
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

            //console.log('====>> ', req.ip);
            const sess = req.session;

            console.log('check user id ', sess.username)

            //try and error test
            // let checkId = '6eb1c551-7be0-41dd-8729-fe18a6ebcfc2';

            // redisClient.exists("key", checkId, (err, data) => {

            //     console.log('IF ERROR ==> ', err);
            //     console.log('IF NOT  ==> ', data)
            // })

            // if (sess.username === req.body.username) {

            //     // check also same IP or not 
            //     // check also same device or different device
            //     console.log('User already logged in -->> give msg like already your session going want to continue or Re-login again.');


            // } else {
                let userData = await User.getUserDetails(req.body.username);

                console.log('===>>>', userData.recordset[0].username)

                if (req.body.username == '') {
                    //return res.status(200).send('Invalid username or password..!');
                    return res.render('login', {
                        message: "Invalid username or password"
                    })
                }

                if (req.body.password == '') {
                    return res.render('login', {
                        message: "Invalid username or password"
                    })
                }

                let isVerified = await hash.verifyPassword(req.body.password, userData.recordset[0].password)
                console.log('check pass verify ', isVerified)

            
                req.session.userId = userData.recordset[0].id;
                req.session.username = userData.recordset[0].username;
                req.session.firstName = userData.recordset[0].firstname;
                req.session.lastName = userData.recordset[0].lastname;
                req.session.email = userData.recordset[0].email;
                req.session.subDomain = 'asmsoc-mum';
            
                req.session.permissions = 'admin';
                req.session.modules = 'admin';

                // IF CHECKED WITH DEVICE TRUSTED
                if (req.body.is_trusted == "on") {
                    req.session.usersecretkey = encrypt(uuidv4())
                    
                        console.log('is checked:::::::::::>>')
                        const headers = {
                            ip: req.ip,
                            platform: req.headers["user-agent"]
                        };
                    
                }

                if (req.body.username === userData.recordset[0].username && isVerified == true) {
                    res.redirect('/admin/dashboard');
                } else {
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