const db = require("../db");
const asyncHandler = require("express-async-handler");
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
  asyncHandler((req, res, next) => {
    const errors = validationResult(req);
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
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
  }),
];

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await db.user.getUser(req.params.id);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  res.json({
    user,
  });
});

exports.changePassword = [
  validateNewPassword,
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }
    const { password } = await db.user.getUser(req.user.id);
    const isMatch = bcrypt.compare(req.body.password, password);
    if (!isMatch) {
      const err = new Error("Passwords don't match");
      err.status = 401;
      return next(err);
    }
    bcrypt.hash(req.body.new_password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      await db.user.updatePassword(req.user.id, hashedPassword);
      res.redirect(`/users/${req.user.id}`);
    });
  }),
];

exports.makeAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    const err = new Error("Only admins may create admins");
    err.status = 401;
    return next(err);
  }
  const updated = await db.user.createAdmin(req.body.username);
  res.json({
    user: updated,
  });
});

exports.removeAdmin = asyncHandler(async (req, res) => {
  if (req.user.role !== "ADMIN") {
    const err = new Error("Only admins may remove admins");
    err.status = 401;
    return next(err);
  }
  const updated = await db.user.removeAdmin(req.body.username);
  res.json({
    user: updated,
  });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    const err = new Error("Unauthenticated user");
    err.status = 401;
    return next(err);
  }
  const deleted = await db.user.deleteUser(req.params.id);
  res.json({
    deleted,
  });
});
