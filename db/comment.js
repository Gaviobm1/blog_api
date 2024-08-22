const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Comment {
  async createComment(comment, postId, authorId) {
    const newComment = await prisma.comment.create({
      data: {
        text: comment.text,
        postId,
        authorId,
      },
    });
    return newComment;
  }
  async getPostComments(postId) {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
      },
    });
    return comments;
  }
  async getUserComments(authorId) {
    const comments = await prisma.comment.findMany({
      where: {
        authorId,
      },
    });
    return comments;
  }
  async getComment(id) {
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });
    return comment;
  }
  async updateComment(comment) {
    const comment = await prisma.comment.update({
      where: {
        id: comment.id,
      },
      data: {
        text: comment.text,
      },
    });
    return comment;
  }
  async likePost(id) {
    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
    return comment;
  }
  async dislikePost(id) {
    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: {
        likes: {
          decrement: 1,
        },
      },
    });
    return comment;
  }
  async deleteComment(id) {
    const deleted = await prisma.comment.delete({
      where: {
        id,
      },
    });
    return deleted;
  }
  async deleteAllPostComments(postId) {
    const deleted = await prisma.comment.deleteMany({
      where: {
        postId,
      },
    });
    return deleted;
  }
  async deleteAllUserComments(authorId) {
    const deleted = await prisma.comment.deleteMany({
      where: {
        authorId,
      },
    });
    return deleted;
  }
}

const comment = new Comment();

module.exports = comment;
