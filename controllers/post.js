const db = require("../db");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const helpers = require("../helpers");

const validatePost = [
  body("title").trim().isLength({ min: 1 }).escape(),
  body("text").trim().isLength({ min: 1 }).escape(),
];

exports.createPost = [
  validatePost,
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "ADMIN") {
      const err = new Error("Posts can only be created by authorised users");
      err.status = 401;
      return next(err);
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
  }),
];

exports.getPost = asyncHandler(async (req, res) => {
  const post = await db.post.getPost(req.params.id);
  res.json({
    post,
  });
});

exports.getPublishedPosts = asyncHandler(async (req, res, next) => {
  let posts = await db.post.getAllPosts();
  posts = helpers.extractPassword(posts);
  res.json({
    posts,
  });
});

exports.getUserPosts = asyncHandler(async (req, res) => {
  const userPosts = await db.post.getAllUserPosts(req.user);
  res.json({
    userPosts,
  });
});

exports.editPost = [
  validatePost,
  asyncHandler(async (req, res) => {
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
  }),
];

exports.deletePost = asyncHandler(async (req, res) => {
  const deleted = await db.post.deletePost(req.params.id, req.user.id);
  if (!deleted) {
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }
  res.json({
    post: deleted,
  });
});

exports.likePost = asyncHandler(async (req, res) => {
  const post = await db.post.likePost(req.params.id);
  if (!post) {
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }
  res.json({
    post,
  });
});
