const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { PrismaClient } = require("@prisma/client");
const db = require("../db");
require("dotenv").config();

const prisma = new PrismaClient();

const verifyCallback = async (jwt_payload, done) => {
  try {
    const user = await db.user.getUser(jwt_payload.id);
    if (!user) return done(null, false, { message: "Invalid user" });
    return done(null, jwt_payload);
  } catch (err) {
    return done(err, false);
  }
};

const strategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
  },
  verifyCallback
);

passport.use(strategy);

module.exports = passport.authenticate("jwt", { session: false });
