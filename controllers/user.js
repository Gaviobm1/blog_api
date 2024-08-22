const db = require("../db");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

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

const validateNewPassword = [
  body("new_password")
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

exports.getUser = async (req, res) => {
  const user = await db.user.getUser(req.params.id);
  res.json({
    user,
  });
};

exports.changePassword = [
  validateNewPassword,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }
    const { password } = await db.user.getUser(req.user.id);
    const isMatch = bcrypt.compare(req.body.password, password);
    if (!isMatch) {
      return res.json({
        message: "Wrong password",
      });
    }
    bcrypt.hash(req.body.new_password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.status(401).json({
          message: "Password change failed",
        });
      }
      await db.user.updatePassword(req.user.id, hashedPassword);
      res.redirect(`/users/${req.user.id}`);
    });
  },
];

exports.makeAdmin = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.json({
      message: "Only admins may create admins",
    });
  }
  const updated = await db.user.createAdmin(req.body.username);
  res.json({
    user: updated,
  });
};

exports.removeAdmin = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.json({
      message: "Only admins can remove admins",
    });
  }
  const updated = await db.user.removeAdmin(req.body.username);
  res.json({
    user: updated,
  });
};

exports.deleteUser = async (req, res) => {
  if (!req.user) {
    return res.json({
      message: "No user",
    });
  }
  const deleted = await db.user.deleteUser(req.params.id);
  res.json({
    deleted,
  });
};
