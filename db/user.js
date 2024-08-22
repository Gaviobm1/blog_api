const { PrismaClient, Prisma } = require("@prisma/client");
const db = require("./index");

const prisma = new PrismaClient();

class User {
  async createUser(user) {
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        password: user.password,
      },
    });
    return newUser;
  }
  async getUser(user) {
    return await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
  }
  async createAdmin(user) {
    try {
      const admin = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: "ADMIN",
        },
      });
      return admin.role;
    } catch (err) {
      return err;
    }
  }
  async removeAdmin(user) {
    const admin = await this.getUser(user.id);
    if (!admin) {
      throw new Error("User doesn't exist");
    }
    if (admin.role === "USER" || admin.role === "GUEST") {
      return { message: "User is not admin" };
    }
    const notAdmin = await prisma.user.update({
      where: {
        id: admin.id,
      },
      data: {
        role: "USER",
      },
    });
    return notAdmin;
  }
  async deleteUser(user) {
    await db.post.deleteAllUserPosts(user.id);
    const deleted = await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    if (!deleted) {
      throw new Error("User doesn't exist");
    }
    return deleted;
  }
}

const user = new User();

module.exports = user;
