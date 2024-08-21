const { Router } = require("express");
const auth = require("../auth");
const router = Router();

router.post("/login", auth.jwtSign);
router.get("/", auth.passportAuth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
