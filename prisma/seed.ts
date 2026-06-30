import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { categories } from "./data/categories";
import { products } from "./data/products";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("La variable DATABASE_URL no está configurada");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

const productsWithPrice = products.map((product) => ({
  ...product,
  price: product.price ?? 0,

}));

async function main() {
  try {
    await prisma.category.createMany({
      data: categories,
    });

    await prisma.product.createMany({
      data: products,
    });

    console.log("Seed ejecutado correctamente");
  } catch (error) {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })