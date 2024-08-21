const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function jwtSign(req, res) {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (!user) res.status(401).json({ message: "Invalid user" });
  const isMatch = await bcrypt.compare(req.body.password, user.password);
  if (!isMatch) res.status(401).json({ message: "Invalid password" });
  const { password, ...payload } = user;
  jwt.sign(
    payload,
    process.env.SECRET_KEY,
    { expiresIn: "120s" },
    (err, token) => {
      if (err) {
        res.json(err);
      }
      res.json({ token });
    }
  );
}

module.exports = jwtSign;
