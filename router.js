const router = require("express").Router();
const {
    isLoggedIn
} = require("./app/middlewares/user")


const AdminRoute =  require('./app/routers/admin/index')

function setRouter(app) {
    const homeRouter = require("./app/routers/home")
    const userRouter = require("./app/routers/user")
    app.use('/user', userRouter)
    app.use('/', homeRouter)

    //Admin Router
    AdminRoute(app)
}


module.exports = setRouter  