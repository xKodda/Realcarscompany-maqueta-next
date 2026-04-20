#!/usr/bin/env node

// Script postinstall para generar el cliente de Prisma
// Maneja el caso donde DATABASE_URL no está disponible durante el build

const { execSync } = require('child_process')

// Si DATABASE_URL no está disponible, usar una URL dummy solo para generar el cliente
// Prisma no necesita conectarse realmente a la DB para generar el cliente, solo valida el formato
const originalDatabaseUrl = process.env.DATABASE_URL
if (!process.env.DATABASE_URL) {
  // URL dummy válida para PostgreSQL (solo para generar tipos, no se conecta)
  process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/postgres'
  console.log('⚠️  DATABASE_URL not set during build, using dummy URL for Prisma client generation')
}

try {
  // Ejecutar prisma generate con la variable de entorno establecida
  execSync('npx prisma generate', {
    stdio: 'inherit',
    env: { 
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL
    },
    shell: true
  })
  console.log('✅ Prisma client generated successfully')
} catch (error) {
  // Si falla y no hay DATABASE_URL original, es esperado durante el build
  if (!originalDatabaseUrl) {
    console.warn('⚠️  Prisma generate failed during build (expected if DATABASE_URL not configured)')
    console.warn('⚠️  Make sure to set DATABASE_URL in Vercel environment variables for production')
    // No fallar el build, solo advertir
    process.exit(0)
  } else {
    console.error('❌ Error generating Prisma client:', error.message)
    process.exit(1)
  }
}
