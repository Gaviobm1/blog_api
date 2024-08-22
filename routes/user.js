const { Router } = require("express");
const auth = require("../auth");
const controller = require("../controllers");
const router = Router();

router.post("/login", auth.jwtSign);
router.post("/signup", controller.user.createUser, auth.jwtSign);
router.get("/:id", auth.passportAuth, controller.user.getUser);
router.get("/:id/posts", auth.passportAuth, controller.post.getUserPosts);
router.get(
  "/:id/comments",
  auth.passportAuth,
  controller.comment.getUserComments
);
router.post("/:id", auth.passportAuth, controller.user.changePassword);
router.put("/:id/admin", auth.passportAuth, controller.user.makeAdmin);
router.put("/:id/remove-admin", auth.passportAuth, controller.user.removeAdmin);
router.delete("/:id", auth.passportAuth, controller.user.deleteUser);

module.exports = router;
