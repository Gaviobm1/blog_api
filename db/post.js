const { PrismaClient } = require("@prisma/client");
const db = require("./index");

const prisma = new PrismaClient();

class Post {
  async createPost(post, user) {
    try {
      const newPost = await prisma.post.create({
        data: {
          title: post.title,
          text: post.text,
          authorId: user.id,
        },
      });
      return newPost;
    } catch (err) {
      return err;
    }
  }
  async getAllPosts() {
    try {
      const posts = await prisma.post.findMany({
        where: {
          status: "PUBLISHED",
        },
        include: {
          comments: true,
          user: true,
        },
      });
      return posts;
    } catch (err) {
      return err;
    }
  }
  async getAllUserPosts(user) {
    try {
      return await prisma.post.findMany({
        where: {
          authorId: user.id,
        },
        include: {
          comments: true,
        },
      });
    } catch (err) {
      return err;
    }
  }
  async getPost(id) {
    try {
      return await prisma.post.findUnique({
        where: {
          id,
        },
      });
    } catch (err) {
      return err;
    }
  }
  async updatePost(post, authorId) {
    try {
      const updatedPost = await prisma.post.update({
        where: {
          id: post.id,
          authorId,
        },
        data: {
          title: post.title,
          text: post.text,
        },
      });
      return updatedPost;
    } catch (err) {
      return err;
    }
  }
  async deletePost(id, authorId) {
    try {
      await db.comment.deleteAllPostComments(id, authorId);
      const deleted = await prisma.post.delete({
        where: {
          id,
          authorId,
        },
      });
      return deleted;
    } catch (err) {
      return err;
    }
  }
  async deleteAllUserPosts(id) {
    try {
      const toBeDeleted = await prisma.post.findMany({
        where: {
          id,
        },
      });
      for await (const post of toBeDeleted) {
        await this.deletePost(post.id);
      }
    } catch (err) {
      return err;
    }
  }
  async likePost(id) {
    try {
      const post = await prisma.post.update({
        where: {
          id,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
      return post;
    } catch (err) {
      return err;
    }
  }
}

const post = new Post();

module.exports = post;
