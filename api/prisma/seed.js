import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const password = await bcrypt.hash("admin1234", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@splash.dev" },
        update: {},
        create: {
            username: "admin",
            email: "admin@splash.dev",
            password,
            role: "ADMIN",
        },
    });

    console.log("Seeded admin user:", admin.email, "(password: admin1234)");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());