const express = require("express");
const router = express.Router();
const {
  body
} = require("express-validator");
const validate = require("../middlewares/validation-req");
//Khai báo Controller để tiếp nhận yêu cầu
const UserControllers = require("../controllers/user");
const CheckAuthMiddleWare = require("../middlewares/check-auth");


router.get(
  "/get-all-students",
  CheckAuthMiddleWare.isAdmin,
  UserControllers.get_all_students
);

router.post(
  "/add-students",
  [
    body("data.*.username").isLength({
      min: 3,
      max: 100
    }).trim().escape(),
    body("data.*.password")
    .isLength({
      min: 6,
      max: 15
    })
    .withMessage('Mật khẩu phải tối thiểu 6 kí tự')
    .trim()
    .escape(),
    body("data.*.email")
    .isEmail()
    .withMessage("Sai định dạng email")
    .trim()
    .escape()
    .normalizeEmail(),
    body("data.*.gender")
    .isNumeric().isLength({max:1}).withMessage('0: Ko xác định, 1: Nam, 2: Nữ')
    .trim()
    .escape(),
    body("data.*.birthday").isString().isLength({max: 10}),
    body(['data.*.homeTown', 'data.*.cmnd', "data.*.fullName" ]).isString().trim().escape(),
    body('data.*.mssv').isString().isLength({min: 8}),
  ],
  validate.check,
  CheckAuthMiddleWare.isAdmin,
  UserControllers.add_students
);

router.get('/get-email', UserControllers.get_email)
// router.post('/login', UserControllers.user_login);

// router.post('/logout', UserControllers.user_logout)

// router.get('/:signed_id', UserControllers.user_info )

module.exports = router;