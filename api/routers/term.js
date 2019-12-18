const express = require("express");
const router = express.Router();

const {
  body
} = require("express-validator");
const validate = require("../middlewares/validation-req");

//Khai báo Controller để tiếp nhận yêu cầu
const TermController = require("../controllers/term");
const CheckAuthMiddleWare = require("../middlewares/check-auth");

router.get(
  "/get-all-terms",
  CheckAuthMiddleWare.isAdmin,
  TermController.get_all_term
);

router.get(
  "/get-one-term/:id",
  CheckAuthMiddleWare.isAdmin,
  TermController.get_one_term
);

router.get(
  "/get-all-terms-active",
  CheckAuthMiddleWare.isAdmin,
  TermController.get_all_term_active
);

router.post(
  "/modify/:id",
  CheckAuthMiddleWare.isAdmin,
  TermController.modify_term
);

router.post(
  "/add-one-term",
  [
    body(['from', 'to']).isNumeric().isLength({max: 10}),
    body('name').isString().trim()
  ],
  validate.check,
  CheckAuthMiddleWare.isAdmin,
  TermController.add_one_term
);

// router

module.exports = router;
