const express = require('express');
const app = express();
require('dotenv').config()
const http = require('http');
const https = require("https");

const setRouter = require("./router");
const biddingResponse = require('./app/controllers/student/bidding/biddingProcess');
const {
    verifySubdomain
} = require('./app/middlewares/domain')
const {
    v4: uuidv4
} = require('uuid');


//redis
const {
    RedisStore,
    redisClient,
    session
} = require('./config/redis')
const device = require('express-device');

app.use(express.json({
    limit: '50mb'
}));
app.use(
    express.urlencoded({
        extended: false,
        limit: '50mb'
    })
);

app.use(express.static('./public'));
app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(
    session({
        store: new RedisStore({
            client: redisClient,
            ttl: 260
        }),
        saveUninitialized: false,
        genid: function (req) {
            return uuidv4() // use UUIDs for session IDs
        },
        secret: process.env.COOKIE_SECRET,
        resave: false,
        name: 'token',
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, //24 hours
            httpOnly: false,
            sameSite: false,
            path: '/'
        }
    })
)

app.use('/set-token', (req, res) => {
    req.session.name = "Kapil Sharma"
    res.send('Token set')
})

get_breadcrumbs = function (url) {
    var rtn = [],
        acc = "", // accumulative url
        arr = url.substring(1).split("/");

    for (i = 0; i < arr.length; i++) {
        acc = i != arr.length - 1 ? acc + "/" + arr[i] : null;
        if (acc == '/management') {
            acc = '/management/dashboard'
        }
        if (acc == '/admin') {
            acc = '/admin/dashboard'
        }
        rtn[i] = {
            name: arr[i].toUpperCase(),
            url: acc
        };
        if (acc == '/management/dashboard') {
            acc = '/management'
        }
        if (acc == '/admin/dashboard') {
            acc = '/admin'
        }
    }
    return rtn;
};

app.use(function (req, res, next) {
    req.breadcrumbs = get_breadcrumbs(req.originalUrl);
    next();
});



app.use((req, res, next) => {
    if (!req.session) {
        return next(new Error('No session found!')) 
    }
    next() 
})

app.use(verifySubdomain);
app.use(device.capture());

setRouter(app)


require('dotenv').config();

if (process.env.APP_ENV === 'PRODUCTION' || process.env.APP_ENV === 'DEV') {
    const server = https.createServer(sslOptions, app).listen(process.env.APP_PORT);
}

else {
      const server = http.createServer(app).listen(process.env.APP_PORT);
      global.io = require("socket.io")(server);
      global.io.on("connection", biddingResponse.respond)
}