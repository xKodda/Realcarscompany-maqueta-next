/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { PrismaClient, AutoEstado, AdminRol } = require('@prisma/client')

const prisma = new PrismaClient()

const autosFilePath = path.join(__dirname, 'seed-data', 'autos.json')

function toSlug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function seedAutos() {
  if (!fs.existsSync(autosFilePath)) {
    console.warn('⚠️  No se encontró el archivo de autos para seed.')
    return
  }

  const fileContent = fs.readFileSync(autosFilePath, 'utf-8')
  const autos = JSON.parse(fileContent)

  for (const auto of autos) {
    const slug = toSlug(`${auto.marca}-${auto.modelo}-${auto.anio}`)

    await prisma.auto.upsert({
      where: { slug },
      update: {
        marca: auto.marca,
        modelo: auto.modelo,
        anio: auto.anio,
        precio: auto.precio,
        kilometraje: auto.kilometraje,
        transmision: auto.transmision,
        combustible: auto.combustible,
        color: auto.color,
        imagen: auto.imagen,
        descripcion: auto.descripcion,
        caracteristicas: auto.caracteristicas ?? [],
        imagenes: auto.imagenes ?? [],
        estado: AutoEstado[auto.estado] ?? AutoEstado.disponible,
        destacado: Boolean(auto.destacado),
      },
      create: {
        slug,
        marca: auto.marca,
        modelo: auto.modelo,
        anio: auto.anio,
        precio: auto.precio,
        kilometraje: auto.kilometraje,
        transmision: auto.transmision,
        combustible: auto.combustible,
        color: auto.color,
        imagen: auto.imagen,
        descripcion: auto.descripcion,
        caracteristicas: auto.caracteristicas ?? [],
        imagenes: auto.imagenes ?? [],
        estado: AutoEstado[auto.estado] ?? AutoEstado.disponible,
        destacado: Boolean(auto.destacado),
      },
    })
  }

  console.log(`✅ Seeding de autos completado (${autos.length})`)
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@realcarscompany.cl'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!'
  const adminName = process.env.ADMIN_NAME || 'Administrador RealCars'

  const passwordHash = await hashPassword(adminPassword)

  // Create User model (new auth)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      role: 'admin',
      isActive: true,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'admin',
      isActive: true,
    },
  })

  console.log(`✅ Admin User seed completado (${adminEmail})`)

  // Keep old AdminUser for backward compatibility
  const adminNombre = adminName
  const oldPasswordHash = require('crypto').scryptSync(adminPassword, require('crypto').randomBytes(16).toString('hex'), 64).toString('hex')
  
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      nombre: adminNombre,
      passwordHash: `old:${oldPasswordHash}`,
    },
    create: {
      nombre: adminNombre,
      email: adminEmail,
      passwordHash: `old:${oldPasswordHash}`,
      role: AdminRol.SUPERADMIN,
    },
  })

  console.log(`✅ AdminUser (legacy) seed completado (${adminEmail})`)
}

async function main() {
  try {
    await seedAutos()
    await seedAdmin()
  } catch (error) {
    console.error('❌ Error ejecutando seed:', error)
    process.exitCode = 1
  } finally {
    await prisma.$disconnect()
  }
}

main()

