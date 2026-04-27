import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { tickets: true }
  });
  console.log(JSON.stringify(orders, null, 2));
}

checkOrders().catch(console.error).finally(() => prisma.$disconnect());
