const router = require('express').Router();
const controller = require('../controllers/user');
const {
    isLoggedIn, 
    redirectIfLoggedIn
} = require("../middlewares/user");
const {check, body, validationResult } = require('express-validator');

// router.get('/user', controller.getProfile);
router.get('/register', controller.renderRegisterPage);

router.post('/authenticate',[
    body('email').isEmail(),
    check('username').isLength({ min: 3 }).trim().escape(),
    check('password').isLength({min: 6}).trim()], controller.authenticate);

router.get('/login', redirectIfLoggedIn, controller.renderLoginPage);
router.get('/logout', controller.logout)

module.exports = router;