const { faker } = require("@faker-js/faker");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const prisma = new PrismaClient();

const users = Array.from({ length: 10 }).map((user) => ({
  username: faker.internet.userName(),
  password: faker.internet.password(),
}));
console.log(users);

async function populateDb(arr) {
  for await (const user of arr) {
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      }
      await prisma.user.create({
        data: {
          username: user.username,
          password: hashedPassword,
        },
      });
    });
  }
  const newUsers = await prisma.user.findMany();
  console.log(newUsers);
}

async function deleteUsers() {
  await prisma.user.deleteMany();
}

populateDb(users);
