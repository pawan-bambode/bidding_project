const {
    RedisStore,
    redisClient,
    session
} = require('../../config/redis')

let store = new RedisStore({
    client: redisClient,
    ttl: 60
})

module.exports = {

    isLoggedIn: (req, res, next) => {
        let sessionId = req.sessionID;

        if (req.sessionID) {
            store.get(req.sessionID, async (err, result) => {
              
                if(err){
                    res.redirect('/user/login')
                }
                if (!result) {
                    res.redirect('/user/login')
                } else {
                    res.locals.userId = result.userId
                    res.locals.firstName = result.firstName
                    res.locals.username = result.username
                    res.locals.fullName = result.fullName
                    res.locals.useSapId = result.studentSapId
                    res.locals.studentId = result.studentId
                    next();
                }
            })
        } else {
            res.redirect('/user/login')
        }
    },

    redirectIfLoggedIn: (req, res, next) => {
        let sessionId = req.sessionID;
    
        if (!req.sessionID) {
            return next();
        }

        store.get(req.sessionID, async (err, result) => {
           
            if (!result) {
              // return res.redirect('/user/login')
               return next();
            }

            if (result.modules.length > 0) {
                res.redirect(`/${result.modules[0].name}/dashboard`);
            } else {
                res.render('denied')
            }
        })
    },

    checkPermission: (req, res, next) => {
        let UserPermission = store.get(req.sessionID, async (err, result) => {
            if (result.permissions) {
                return next(); 
            }
        })
    },
    checkSession : (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('/user/login');
        } else {
            next();
        }
    }
}