const { PrismaClient, Prisma } = require("@prisma/client");
const db = require("./index");

const prisma = new PrismaClient();

class User {
  async createUser(user) {
    try {
      const newUser = await prisma.user.create({
        data: {
          username: user.username,
          password: user.password,
        },
      });
      return newUser;
    } catch (err) {
      return err;
    }
  }
  async getUser(id) {
    try {
      return await prisma.user.findUnique({
        where: {
          id,
        },
      });
    } catch (err) {
      return err;
    }
  }
  async updatePassword(id, newPassword) {
    try {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          password: newPassword,
        },
      });
    } catch (err) {
      return err;
    }
  }
  async createAdmin(username) {
    try {
      const admin = await prisma.user.update({
        where: {
          username,
        },
        data: {
          role: "ADMIN",
        },
      });
      return admin;
    } catch (err) {
      return err;
    }
  }
  async removeAdmin(username) {
    try {
      const notAdmin = await prisma.user.update({
        where: {
          username,
        },
        data: {
          role: "USER",
        },
      });
      return notAdmin;
    } catch (err) {
      return err;
    }
  }
  async deleteUser(id) {
    try {
      await db.post.deleteAllUserPosts(id);
      const deleted = await prisma.user.delete({
        where: {
          id,
        },
      });
      if (!deleted) {
        throw new Error("User doesn't exist");
      }
      return deleted;
    } catch (err) {
      return err;
    }
  }
}

const user = new User();

module.exports = user;
