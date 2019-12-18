const express = require('express');
const router = express.Router();
const {
    body
} = require("express-validator");
const validate = require("../middlewares/validation-req");
//Khai báo Controller để tiếp nhận yêu cầu
const DKMHController = require('../controllers/dkthi');

const CheckAuthMiddleWare = require('../middlewares/check-auth');

router.get('/get-sessions-for-user/:id', CheckAuthMiddleWare.belongUser, DKMHController.show_session_for_student);

router.post('/booked-room/:id', [
    body(['uid', 'room_id', 'course_id']).isString().trim(),
],
validate.check, CheckAuthMiddleWare.belongUser, CheckAuthMiddleWare.isStudent, DKMHController.booked_room);

module.exports = router; 