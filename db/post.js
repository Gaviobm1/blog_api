const { PrismaClient } = require("@prisma/client");
const db = require("./index");

const prisma = new PrismaClient();

class Post {
  async createPost(post, user) {
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        text: post.text,
        authorId: user.id,
      },
    });
    return newPost;
  }
  async getAllPosts() {
    return await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
    });
  }
  async getAllUserPosts(user) {
    return await prisma.post.findMany({
      where: {
        authorId: user.id,
      },
    });
  }
  async getPost(id) {
    return await prisma.post.findUnique({
      where: {
        id,
      },
    });
  }
  async updatePost(post) {
    const updatedPost = await prisma.post.update({
      where: {
        id,
      },
      data: {
        title: post.title,
        text: post.text,
      },
    });
    return updatedPost;
  }
  async deletePost(id) {
    await db.comment.deleteAllPostComments(id);
    const deleted = await prisma.post.delete({
      where: {
        id,
      },
    });
    return deleted;
  }
  async deleteAllUserPosts(id) {
    const toBeDeleted = await prisma.post.findMany({
      where: {
        id,
      },
    });
    for await (const post of toBeDeleted) {
      await this.deletePost(post.id);
    }
  }
  async likePost(id) {
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
  }
}

const post = new Post();

module.exports = post;
