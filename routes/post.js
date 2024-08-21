const { Router } = require("express");
const router = Router();
const controller = require("../controllers");

router.get("/", controller.post.getPublishedPosts);
router.post("/", controller.post.createPost);

module.exports = router;
