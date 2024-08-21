const db = require("../db");
const { body, validationResult } = require("express-validator");

const validatePost = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("text").trim().isLength({ min: 1 }).escape(),
];

exports.createPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);
    const post = {
      title: req.body.title,
      text: req.body.text,
    };
    if (!errors.isEmpty()) {
      res.json({
        post,
        errors: errors.array(),
      });
    }
    const newPost = await db.post.createPost(post, req.user);
    res.json({
      post: newPost,
    });
  },
];

exports.getPublishedPosts = async (req, res) => {
  const posts = await db.post.getAllPosts();
  if (!posts) {
    res.json({
      message: "No posts",
    });
  }
  res.json({
    posts,
  });
};

exports.getUserPosts = async (req, res) => {
  if (!req.user) {
    res.json({
      message: "Must be a valid user and signed in",
    });
  }
  const userPosts = await db.post.getAllUserPosts(req.user);
  if (!userPosts) {
    res.json({
      message: "No posts yet",
    });
  }
  res.json({
    userPosts,
  });
};
