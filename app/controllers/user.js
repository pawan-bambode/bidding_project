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
const User = require('../models/User');
const USerPermission = require('../models/USerPermission');
const Settings = require('../models/Settings');
const {
    AccountVerification,
    SigninWithNewDevice
} = require('../utils/emailTemplate');
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
const UserPermission = require('../models/USerPermission');
const Client = require('../models/Clients');
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

    registerUser: (req, res, next) => {
        // const hash = bcrypt.hashSync(req.body.password, saltRounds);
        // req.body.password = hash
        hash.hashPassword(req.body.password).then(result => {
            console.log('PAss:>:::', result)
            req.body.password = result
            console.log('haspass', result)
            User.addUser(req.body)
            res.redirect('/user/register')
        })


    },


    getProfile: (req, res, next) => {
        User.fetchUserById('session se id nikalo')
            .then(result => {
                // console.log(result)
                res.render("/management/room/index.ejs", {
                    userList: result.recordset
                })
            }).catch(err => {
                console.log(err)
            })
    },

    getUserById: (req, res, next) => {
        User.fetchUserById(req.body.id).then(result => {
            res.json({
                status: 200,
                message: 'User details are ready.',
                userData: result.recordset
            })
        })
    },

    updateUser: (req, res, next) => {
        User.updateUserById(req.body).then(result => {
            res.json({
                status: 200,
            })
        })
    },

    addUser: (req, res, next) => {
        // console.log('reqBody', req.body)
        User.addUser(req.body)
        res.json({
            status: 200,
            message: 'Ok'
        })
    },

    deleteUser: (req, res, next) => {
        console.log('reqBodyId', req.body.id)
        User.deleteUser(req.body.id).then(result => {
            res.json({
                status: 200,
                message: 'delete successfully',
            })
        })
    },

    authenticate: async (req, res, next) => {

        try {

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