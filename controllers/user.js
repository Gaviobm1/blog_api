const db = require("../db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const validateUser = [
  body("username").trim().isLength({ min: 1 }).isAlphanumeric().escape(),
  body("password")
    .trim()
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .escape(),
  body("confirm_password")
    .trim()
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    })
    .escape(),
];

exports.createUser = [
  validateUser,
  (req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      const user = {
        username: req.body.username,
        password: hashedPassword,
      };
      if (!errors.isEmpty()) {
        res.json({
          user,
          errors: errors.array(),
        });
      }
      await db.user.createUser(user);
      next();
    });
  },
];
