const db = require("../db");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const validateComment = [body("text").trim().isLength({ min: 1 }).escape()];

exports.createComment = [
  validateComment,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const comment = {
      text: req.body.text,
    };
    if (!errors.isEmpty()) {
      return res.json({
        comment,
        errors: errors.array(),
      });
    }
    const newComment = await db.comment.createComment(
      comment,
      req.params.id,
      req.user.id
    );
    res.json({
      comment: newComment,
    });
  }),
];
exports.getComment = async (req, res, next) => {
  const comment = await db.comment.getComment(req.params.commentId);
  if (!comment) {
    const err = new Error("Comment not found");
    err.status = 401;
    return next(err);
  }
  res.json({
    comment,
  });
};
exports.getPostComments = asyncHandler(async (req, res) => {
  const comments = await db.comment.getPostComments(req.params.id);
  res.json({
    comments,
  });
});

exports.getUserComments = asyncHandler(async (req, res) => {
  const comments = await db.comment.getUserComments(req.user.id);
  res.json({
    comments,
  });
});

exports.updateComment = asyncHandler(async (req, res) => {
  const comment = {
    id: req.body.id,
    text: req.body.text,
  };
  const updatedComment = await db.comment.updateComment(comment);
  res.json({
    comment: updatedComment,
  });
});

exports.likeComment = asyncHandler(async (req, res) => {
  const comment = await db.comment.likePost(req.body.id);
  res.json({
    comment,
  });
});

exports.dislikeComment = asyncHandler(async (req, res) => {
  const comment = await db.comment.dislikePost(req.body.id);
  res.json({
    comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await db.comment.deleteComment(req.body.id);
  res.json({
    comment,
  });
});
