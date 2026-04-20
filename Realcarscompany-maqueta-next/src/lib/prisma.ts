import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var, vars-on-top
  var prisma: PrismaClient | undefined
}

// Crear instancia de Prisma con manejo de errores mejorado
let prismaInstance: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // En producción, crear nueva instancia cada vez (serverless)
  prismaInstance = new PrismaClient({
    log: ['error'],
  })
} else {
  // En desarrollo, reutilizar la instancia global
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prismaInstance = global.prisma
}

// Manejar desconexión graceful
if (process.env.NODE_ENV !== 'production') {
  process.on('beforeExit', async () => {
    await prismaInstance.$disconnect()
  })
}

export const prisma = prismaInstance


