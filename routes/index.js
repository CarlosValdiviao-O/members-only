var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

router.get('/', message_controller.index);


router.get('/log-in', user_controller.log_in_get);

router.post('/log-in', user_controller.log_in_post);

router.get('/log-out', user_controller.log_out);

router.get('/sign-in', user_controller.sign_in_get);

router.post('/sign-in', user_controller.sign_in_post);

router.get('/member', user_controller.member_get);

router.post('/member', user_controller.member_post);

//router.get('/admin', user_controller.admin_get);

//router.post('/admin', user_controller.admin_post);

module.exports = router;
