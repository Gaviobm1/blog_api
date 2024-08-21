const { PrismaClient } = require("@prisma/client");

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
  async deletePost(post) {
    const deleted = await prisma.post.delete({
      where: {
        id: post.id,
      },
    });
    return deleted;
  }
}

const post = new Post();

module.exports = post;
