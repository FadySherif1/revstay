import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { BOOTSTRAP_ADMIN_EMAILS } from "../src/lib/admin.ts";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  for (const email of BOOTSTRAP_ADMIN_EMAILS) {
    const res = await prisma.user.updateMany({
      where: { email: email.toLowerCase() },
      data: { role: "ADMIN" },
    });
    if (res.count > 0) {
      console.log(`promoted to ADMIN: ${email}`);
    } else {
      console.log(`no account yet for ${email} — will be promoted on sign-in`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
