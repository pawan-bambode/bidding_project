const express = require('express');
const app = express();
require('dotenv').config();
const http = require('http');
const https = require("https");
const socketIo = require('socket.io');

const setRouter = require("./router");
const socketResponse = require('./app/controllers/student/socket/socket');
const { verifySubdomain } = require('./app/middlewares/domain');
const { v4: uuidv4 } = require('uuid');

const { RedisStore, redisClient, session } = require('./config/redis');
const device = require('express-device');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use(express.static('./public'));
app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(session({
    store: new RedisStore({
        client: redisClient,
        ttl: 3600
    }),
    saveUninitialized: false,
    genid: function (req) {
        return uuidv4(); 
    },
    secret: process.env.COOKIE_SECRET,
    resave: false,
    name: 'token',
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: false,
        sameSite: false,
        path: '/'
    }
}));

app.use('/set-token', (req, res) => {
    req.session.name = "Kapil Sharma";
    res.send('Token set');
});

get_breadcrumbs = function (url) {
    var rtn = [],
        acc = "", // Accumulative URL
        arr = url.substring(1).split("/");

    for (i = 0; i < arr.length; i++) {
        acc = i != arr.length - 1 ? acc + "/" + arr[i] : null;

        if (acc == '/admin') {
            // acc = '/admin/dashboard'
        }
        rtn[i] = {
            name: arr[i].toUpperCase(),
            url: acc
        };

        if (acc == '/admin/dashboard') {
            acc = '/admin';
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
        return next(new Error('No session found!'));
    }
    next();
});

app.use(verifySubdomain);
app.use(device.capture());
app.use((req, res, next) => {
    req.sidebarActive = req.originalUrl;
    next();
});

setRouter(app);

require('dotenv').config();

if (process.env.APP_ENV === 'PRODUCTION' || process.env.APP_ENV === 'DEV') {
    const server = https.createServer(sslOptions, app).listen(process.env.APP_PORT);
} else {
    const server = http.createServer(app).listen(process.env.APP_PORT);

    const io = socketIo(server, {
        reconnection: true, // Enable reconnection
        reconnectionAttempts: Infinity, // Number of reconnection attempts (-1 for infinity)
        reconnectionDelay: 1000, // Initial delay before attempting reconnection (ms)
        reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts (ms)
        randomizationFactor: 0.5 // Randomization factor to add randomness to the reconnection delay
    });

    // Define a Socket.IO connection
    io.on('connection', (socket) => {
        socketResponse.respond(socket, io); // Pass both 'socket' and 'io' objects to the event handler
    });
}    