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

            let userData = await User.getUserDetails('rahulb@gmail.com');

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

           
            req.session.userId = 10;
            req.session.username = '32200039';
            req.session.firstName = 'Testing';
            req.session.lastName = 'Test';
            req.session.email = 'testing@gmail.com';
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

            if (req.body.username == 'admin' && req.body.password == '123') {
                res.redirect('/admin/dashboard');
            } else {
                res.send('This user has no permissions.');
            }
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