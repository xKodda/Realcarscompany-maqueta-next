#!/usr/bin/env node

/**
 * Script para validar y corregir las URLs de conexión de Supabase
 * Ejecuta: node scripts/validate-env.js
 */

require('dotenv').config({ path: '.env.local' })

function urlEncodePassword(url) {
  // Extraer la contraseña de la URL y hacer encoding de caracteres especiales
  const passwordMatch = url.match(/:\/\/[^:]+:([^@]+)@/)
  if (!passwordMatch) return url

  const password = passwordMatch[1]
  const encodedPassword = encodeURIComponent(password)
  
  return url.replace(`:${password}@`, `:${encodedPassword}@`)
}

function validateDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL
  const directDatabaseUrl = process.env.DIRECT_DATABASE_URL

  console.log('\n🔍 Validando configuración de Supabase...\n')

  // Validar DATABASE_URL (Connection Pooling)
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL no está configurada')
    return false
  }

  console.log('📋 DATABASE_URL encontrada')
  
  // Verificar que use connection pooling (puerto 6543)
  if (!databaseUrl.includes(':6543')) {
    console.warn('⚠️  ADVERTENCIA: DATABASE_URL debería usar el puerto 6543 (connection pooling)')
  }

  // Verificar que tenga pgbouncer
  if (!databaseUrl.includes('pgbouncer=true')) {
    console.warn('⚠️  ADVERTENCIA: DATABASE_URL debería incluir ?pgbouncer=true')
  }

  // Verificar formato del usuario
  if (databaseUrl.includes('postgres.') && databaseUrl.includes('pooler')) {
    console.error('❌ ERROR: DATABASE_URL (connection pooling) debe usar solo "postgres" como usuario, NO "postgres.[PROJECT_REF]"')
    console.log('\n📝 Corrección necesaria:')
    console.log('   Cambia: postgresql://postgres.[PROJECT_REF]:password@...')
    console.log('   Por:     postgresql://postgres:password@...')
    return false
  }

  // Verificar encoding de contraseña
  const passwordMatch = databaseUrl.match(/:\/\/[^:]+:([^@]+)@/)
  if (passwordMatch) {
    const password = passwordMatch[1]
    const decodedPassword = decodeURIComponent(password)
    if (password !== decodedPassword || password.includes('*') || password.includes('@') || password.includes('#')) {
      console.warn('⚠️  ADVERTENCIA: La contraseña puede necesitar URL encoding')
      console.log('   Contraseña actual:', password)
      console.log('   Contraseña encoded:', encodeURIComponent(decodedPassword))
    }
  }

  // Validar DIRECT_DATABASE_URL
  if (!directDatabaseUrl) {
    console.warn('⚠️  DIRECT_DATABASE_URL no está configurada (necesaria para migrations)')
  } else {
    console.log('📋 DIRECT_DATABASE_URL encontrada')
    
    // Verificar que use conexión directa (puerto 5432)
    if (!directDatabaseUrl.includes(':5432')) {
      console.warn('⚠️  ADVERTENCIA: DIRECT_DATABASE_URL debería usar el puerto 5432 (conexión directa)')
    }

    // Verificar que tenga el formato correcto con postgres.[PROJECT_REF]
    if (!directDatabaseUrl.includes('postgres.') || !directDatabaseUrl.includes('db.')) {
      console.warn('⚠️  ADVERTENCIA: DIRECT_DATABASE_URL debería usar el formato: postgresql://postgres.[PROJECT_REF]:password@db.[PROJECT_REF].supabase.co:5432/postgres')
    }
  }

  console.log('\n✅ Validación completada\n')
  return true
}

function generateCorrectUrls() {
  console.log('\n📝 Generando URLs correctas...\n')
  
  console.log('Para obtener las URLs correctas:')
  console.log('1. Ve a Supabase Dashboard > Settings > Database')
  console.log('2. Para DATABASE_URL:')
  console.log('   - Busca "Connection Pooling"')
  console.log('   - Copia la URL')
  console.log('   - Asegúrate de que el usuario sea solo "postgres" (NO "postgres.[PROJECT_REF]")')
  console.log('   - Debe incluir ?pgbouncer=true&connection_limit=1')
  console.log('   - Debe usar el puerto 6543')
  console.log('')
  console.log('3. Para DIRECT_DATABASE_URL:')
  console.log('   - Busca "Connection string"')
  console.log('   - Selecciona "URI"')
  console.log('   - Copia la URL completa')
  console.log('   - Debe usar el formato: postgresql://postgres.[PROJECT_REF]:password@db.[PROJECT_REF].supabase.co:5432/postgres')
  console.log('   - Debe usar el puerto 5432')
  console.log('')
  console.log('4. Si tu contraseña tiene caracteres especiales (*, @, #, etc.), haz URL encoding:')
  console.log('   - * → %2A')
  console.log('   - @ → %40')
  console.log('   - # → %23')
  console.log('   - etc.')
  console.log('')
}

// Ejecutar validación
if (validateDatabaseUrl()) {
  console.log('✅ La configuración parece correcta')
  console.log('   Si aún tienes errores, verifica:')
  console.log('   1. Que las URLs sean exactamente las de Supabase')
  console.log('   2. Que la contraseña esté URL-encoded si tiene caracteres especiales')
  console.log('   3. Que DATABASE_URL use solo "postgres" como usuario')
  console.log('   4. Que hayas reiniciado el servidor después de cambiar .env.local')
} else {
  console.log('\n❌ Se encontraron problemas en la configuración')
  generateCorrectUrls()
  process.exit(1)
}







