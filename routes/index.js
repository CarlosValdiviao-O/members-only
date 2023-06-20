var express = require('express');
var router = express.Router();

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get('/', message_controller.index);

router.get('/log-in', user_controller.log_in_get);

router.post('/log-in', user_controller.log_in_post);

router.get('/log-out', user_controller.log_out);

module.exports = router;
