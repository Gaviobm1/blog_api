const { Router } = require("express");
const router = Router();
const auth = require("../auth");
const controller = require("../controllers");

router.get("/", controller.post.getPublishedPosts);
router.get("/:id", controller.post.getPost);
router.get("/:id/comments", controller.comment.getPostComments);
router.get("/:id/comments/:commentId", controller.comment.getComment);
router.post("/", auth.passportAuth, controller.post.createPost);
router.put("/:id", auth.passportAuth, controller.post.editPost);
router.patch("/:id", controller.post.likePost);
router.delete("/:id", auth.passportAuth, controller.post.deletePost);

module.exports = router;
