import { PrismaClient } from "@prisma/client";
import "./userData.json";

import * as fs from "fs";
import * as path from "path";
import { hashPassword } from "../utils/password.util";

const prisma = new PrismaClient();

async function main() {
  const usersData = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "userData.json"), "utf-8")
  );
  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        email: userData.email,
        firstName: userData.firstName,
        lastName:userData.lastName,
        password: await hashPassword(userData.password),
        role: userData.role,
      },
    });
  }
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });