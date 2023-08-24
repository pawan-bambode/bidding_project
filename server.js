const express = require('express');
const app = express();
require('dotenv').config()
const http = require('http');
const https = require("https");
const path = require('path');
const soap = require('soap');
const axios = require('axios');

const timetablesocket = require("../17JulyInfra_Project/infra_v2/app/controllers/admin/timeTableSimulation/timetablesocket");

const setRouter = require("./router")
//test
const {
    verifySubdomain
} = require('./app/middlewares/domain')
const {
    v4: uuidv4
} = require('uuid');

const {
    existsSync,
    mkdirSync,
    accessSync,
    readFileSync,
    constants,
    appendFile,
    writeFile
} = require('fs');




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
    // console.log('rtnnnn', rtn)
    return rtn;
};

app.use(function (req, res, next) {
    req.breadcrumbs = get_breadcrumbs(req.originalUrl);
    next();
});



app.use((req, res, next) => {
    if (!req.session) {
        return next(new Error('No session found!')) // handle error
    }
    next() // otherwise continue
})

app.use(verifySubdomain);
app.use(device.capture());

setRouter(app)

const sql = require('mssql')
const {
    poolConnection
} = require('./config/db');
require('dotenv').config();

if (process.env.APP_ENV === 'PRODUCTION' || process.env.APP_ENV === 'DEV') {
    const server = https.createServer(sslOptions, app).listen(process.env.APP_PORT);
}

else {
      const server = http.createServer(app).listen(process.env.APP_PORT);
//       const io = require('socket.io-client');
//       const socket = io('http://asmsoc-mum.localhost:3000');
     
//       socket.on('connection', socket => {
//       console.log('Client connected');
//       socket.emit('InfraProjectSocket', 'Hello from Project A');
//       socket.on('disconnect', () => {
//       console.log('Client disconnected');
//   });
// });
}