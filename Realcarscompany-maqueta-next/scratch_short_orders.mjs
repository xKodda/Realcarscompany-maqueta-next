import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 2 })
  .then(orders => console.log(orders.map(o => ({ id: o.id, estado: o.estado, created: o.createdAt }))))
  .finally(() => prisma.$disconnect());
