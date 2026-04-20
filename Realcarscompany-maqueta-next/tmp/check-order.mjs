import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const order = await prisma.order.findUnique({
        where: { id: 'RC-DUZIJ7RF0' },
        include: { tickets: true }
    });
    console.log(JSON.stringify(order, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
