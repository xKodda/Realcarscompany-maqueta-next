#!/usr/bin/env node

// Script para generar el cliente de Prisma
// Establece DATABASE_URL dummy si no está disponible (necesario para builds en Vercel)

// Establecer DATABASE_URL antes de que Prisma lo lea
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy'
  console.log('⚠️  DATABASE_URL not set, using dummy URL for Prisma client generation')
}

const { execSync } = require('child_process')

try {
  // Ejecutar prisma generate con la variable de entorno establecida explícitamente
  const env = { ...process.env }
  if (!env.DATABASE_URL) {
    env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy'
  }
  
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: env
  })
  console.log('✅ Prisma client generated successfully')
} catch (error) {
  // En Vercel, si falla, no debería detener el build completo
  // pero en desarrollo local sí queremos ver el error
  if (process.env.VERCEL) {
    console.warn('⚠️  Prisma generate failed, but continuing build...')
    process.exit(0)
  } else {
    console.error('❌ Error generating Prisma client:', error.message)
    process.exit(1)
  }
}
