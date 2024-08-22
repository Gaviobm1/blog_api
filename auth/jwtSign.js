const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function jwtSign(req, res, next) {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
    include: {
      posts: true,
      comments: true,
    },
  });
  if (!user) {
    const err = new Error("Invalid username");
    err.status = 401;
    return next(err);
  }
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid password");
    err.status = 401;
    return next(err);
  }
  const { password, ...payload } = user;
  jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: "60m" },
    (err, token) => {
      if (err) {
        res.json(err);
      }
      res.json({ token });
    }
  );
}

module.exports = jwtSign;
