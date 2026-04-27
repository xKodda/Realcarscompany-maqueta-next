import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const pendingOrders = await prisma.order.findMany({
    where: {
      estado: 'pendiente'
    },
    include: {
      tickets: true
    }
  });

  console.log(`Found ${pendingOrders.length} pending orders.`);
  
  for (const order of pendingOrders) {
    console.log(`Updating order ${order.id} for ${order.nombreComprador} (${order.emailComprador}) - Cantidad: ${order.cantidad}`);
    
    const cantidadStickers = order.cantidad || 1;
    const ticketsData = [];
    
    for (let i = 0; i < cantidadStickers; i++) {
        const uniqueId = `RC-TKT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        ticketsData.push({
            numero: uniqueId,
            estado: 'activo'
        });
    }

    await prisma.order.update({
        where: { id: order.id },
        data: {
            estado: 'pagado',
            fechaPago: new Date(),
            tickets: {
                create: ticketsData
            }
        }
    });
    
    console.log(`✅ Order ${order.id} updated to pagado with ${cantidadStickers} tickets.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
