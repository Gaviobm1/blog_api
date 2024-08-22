const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class Comment {
  async createComment(comment, postId, authorId) {
    try {
      const newComment = await prisma.comment.create({
        data: {
          text: comment.text,
          postId,
          authorId,
        },
      });
      return newComment;
    } catch (err) {
      throw err;
    }
  }
  async getPostComments(postId) {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
      });
      return comments;
    } catch (err) {
      throw err;
    }
  }
  async getUserComments(authorId) {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          authorId,
        },
      });
      return comments;
    } catch (err) {
      throw err;
    }
  }
  async getComment(id) {
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });
      return comment;
    } catch (err) {
      throw err;
    }
  }
  async updateComment(comment) {
    try {
      const comment = await prisma.comment.update({
        where: {
          id: comment.id,
        },
        data: {
          text: comment.text,
        },
      });
      return comment;
    } catch (err) {
      throw err;
    }
  }
  async likePost(id) {
    try {
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
    } catch (err) {
      throw err;
    }
  }
  async dislikePost(id) {
    try {
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
    } catch (err) {
      throw err;
    }
  }
  async deleteComment(id) {
    try {
      const deleted = await prisma.comment.delete({
        where: {
          id,
        },
      });
      return deleted;
    } catch (err) {
      throw err;
    }
  }
  async deleteAllPostComments(postId) {
    try {
      const deleted = await prisma.comment.deleteMany({
        where: {
          postId,
        },
      });
      return deleted;
    } catch (err) {
      throw err;
    }
  }
  async deleteAllUserComments(authorId) {
    try {
      const deleted = await prisma.comment.deleteMany({
        where: {
          authorId,
        },
      });
      return deleted;
    } catch (err) {
      throw err;
    }
  }
}

const comment = new Comment();

module.exports = comment;
