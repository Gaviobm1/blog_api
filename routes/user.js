const { Router } = require("express");
const auth = require("../auth");
const controller = require("../controllers");
const router = Router();

router.post("/login", auth.jwtSign);
router.post("/signup", controller.user.createUser, auth.jwtSign);
router.get("/", auth.passportAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
