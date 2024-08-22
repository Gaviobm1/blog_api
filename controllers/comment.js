const db = require("../db");
const { body, validationResult } = require("express-validator");

const validateComment = [body("text").trim().isLength({ min: 1 }).escape()];

exports.createComment = [
  validateComment,
  async (req, res) => {
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
  },
];

exports.getPostComments = async (req, res) => {
  const comments = await db.comment.getPostComments(req.params.id);
  res.json({
    comments,
  });
};

exports.getUserComments = async (req, res) => {
  const comments = await db.comment.getUserComments(req.user.id);
  res.json({
    comments,
  });
};

exports.updateComment = async (req, res) => {
  const comment = {
    id: req.body.id,
    text: req.body.text,
  };
  const updatedComment = await db.comment.updateComment(comment);
  res.json({
    comment: updatedComment,
  });
};

exports.likeComment = async (req, res) => {
  const comment = await db.comment.likePost(req.body.id);
  res.json({
    comment,
  });
};

exports.dislikeComment = async (req, res) => {
  const comment = await db.comment.dislikePost(req.body.id);
  res.json({
    comment,
  });
};

exports.deleteComment = async (req, res) => {
  const comment = await db.comment.deleteComment(req.body.id);
  res.json({
    comment,
  });
};
