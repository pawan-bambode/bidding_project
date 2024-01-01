const {
    RedisStore,
    redisClient
} = require('../../config/redis')
const {
    body,
    validationResult
} = require('express-validator');

let store = new RedisStore({
    client: redisClient,
    ttl: 260
})
const OrganizationSlug = require('../models/OrganizationSlug')


module.exports = {

    renderLoginPage: (req, res, next) => {

        OrganizationSlug.fetchAll().then(result => {
            res.render('login')
        })
        
    },

    postLogin: (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false, 
                errors: errors.array()
            });
        }


        req.session.username = req.body.username
        req.session.email = 'bkapilsharma@gmail.com'
        req.session.fName = 'Kapil'

        store.get(req.sessionID, async function (err, data) {
            let result = await data;
        })
        res.redirect('/login')
    }
}