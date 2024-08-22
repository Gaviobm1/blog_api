const db = require("../db");
const { body, validationResult } = require("express-validator");
const helpers = require("../helpers");

const validatePost = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("text").trim().isLength({ min: 1 }).escape(),
];

exports.createPost = [
  validatePost,
  async (req, res) => {
    if (req.user.role !== "ADMIN") {
      return res.status(401).json({
        message: "Posts can only be created by authorised users",
      });
    }
    const errors = validationResult(req);
    const post = {
      title: req.body.title,
      text: req.body.text,
    };
    if (!errors.isEmpty()) {
      return res.json({
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

exports.getPost = async (req, res) => {
  const post = await db.post.getPost(req.params.id);
  res.json({
    post,
  });
};

exports.getPublishedPosts = async (req, res) => {
  let posts = await db.post.getAllPosts();
  if (!posts) {
    return res.json({
      message: "No posts",
    });
  }
  posts = helpers.extractPassword(posts);
  res.json({
    posts,
  });
};

exports.getUserPosts = async (req, res) => {
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

exports.editPost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);
    const post = {
      id: req.params.id,
      title: req.body.title,
      text: req.body.text,
    };
    if (!errors.isEmpty()) {
      return res.json({
        post,
        errors: errors.array(),
      });
    }
    const newPost = await db.post.updatePost(post, req.user.id);
    res.json({
      post: newPost,
    });
  },
];

exports.deletePost = async (req, res) => {
  const deleted = await db.post.deletePost(req.params.id, req.user.id);
  if (!deleted) {
    return res.json({
      message: "Post doesn't exist",
    });
  }
  res.json({
    post: deleted,
  });
};

exports.likePost = async (req, res) => {
  const post = await db.post.likePost(req.parama.id);
  if (!post) {
    return res.json({
      message: "Post like failed",
    });
  }
  res.json({
    post,
  });
};
