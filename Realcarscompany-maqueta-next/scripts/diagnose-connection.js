#!/usr/bin/env node

/**
 * Script de diagnóstico para verificar la configuración de conexión a Supabase
 */

require('dotenv').config({ path: '.env.local' })

console.log('\n🔍 Diagnóstico de Conexión a Supabase\n')
console.log('=' .repeat(60))

// Verificar si DATABASE_URL existe
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL no está configurada en .env.local')
  console.log('\n📝 Solución:')
  console.log('   1. Crea o edita el archivo .env.local')
  console.log('   2. Agrega: DATABASE_URL="postgresql://..."')
  process.exit(1)
}

console.log('✅ DATABASE_URL encontrada\n')

// Analizar la URL
try {
  const url = new URL(databaseUrl)
  
  console.log('📋 Análisis de la URL:')
  console.log(`   Protocolo: ${url.protocol}`)
  console.log(`   Usuario: ${url.username}`)
  console.log(`   Host: ${url.hostname}`)
  console.log(`   Puerto: ${url.port}`)
  console.log(`   Base de datos: ${url.pathname.replace('/', '')}`)
  
  // Verificar formato para conexión directa
  console.log('\n🔍 Verificaciones:')
  
  let hasErrors = false
  
  // Verificar que sea PostgreSQL
  if (!databaseUrl.startsWith('postgresql://')) {
    console.error('❌ ERROR: El protocolo debe ser postgresql://')
    hasErrors = true
  } else {
    console.log('✅ Protocolo correcto (postgresql://)')
  }
  
  // Verificar usuario
  if (!url.username) {
    console.error('❌ ERROR: No se encontró usuario en la URL')
    hasErrors = true
  } else if (url.username.includes('postgres.')) {
    console.log('✅ Usuario correcto (postgres.[PROJECT_REF])')
  } else if (url.username === 'postgres') {
    console.warn('⚠️  ADVERTENCIA: Usuario es solo "postgres"')
    console.warn('   Para conexión directa, debería ser "postgres.[PROJECT_REF]"')
  } else {
    console.warn(`⚠️  ADVERTENCIA: Usuario inusual: ${url.username}`)
  }
  
  // Verificar host
  if (url.hostname.includes('pooler')) {
    console.error('❌ ERROR: Estás usando connection pooling (pooler)')
    console.error('   Para conexión directa, el host debe ser: db.[PROJECT_REF].supabase.co')
    console.error('   NO: aws-0-[REGION].pooler.supabase.com')
    hasErrors = true
  } else if (url.hostname.includes('db.') && url.hostname.includes('.supabase.co')) {
    console.log('✅ Host correcto (db.[PROJECT_REF].supabase.co)')
  } else {
    console.warn(`⚠️  ADVERTENCIA: Host inusual: ${url.hostname}`)
    console.warn('   Debería ser: db.[PROJECT_REF].supabase.co')
  }
  
  // Verificar puerto
  if (url.port === '5432') {
    console.log('✅ Puerto correcto (5432 - conexión directa)')
  } else if (url.port === '6543') {
    console.error('❌ ERROR: Estás usando el puerto de connection pooling (6543)')
    console.error('   Para conexión directa, debe ser 5432')
    hasErrors = true
  } else {
    console.warn(`⚠️  ADVERTENCIA: Puerto inusual: ${url.port}`)
    console.warn('   Para conexión directa, debería ser 5432')
  }
  
  // Verificar parámetros
  if (url.search.includes('pgbouncer')) {
    console.error('❌ ERROR: La URL contiene parámetros de pgbouncer')
    console.error('   Para conexión directa, NO debe tener ?pgbouncer=true')
    hasErrors = true
  } else {
    console.log('✅ Sin parámetros de pgbouncer (correcto para conexión directa)')
  }
  
  // Verificar contraseña
  if (url.password) {
    const decodedPassword = decodeURIComponent(url.password)
    if (url.password !== decodedPassword) {
      console.log('✅ Contraseña está URL-encoded')
    } else if (url.password.includes('*') || url.password.includes('@') || url.password.includes('#')) {
      console.warn('⚠️  ADVERTENCIA: La contraseña contiene caracteres especiales sin encoding')
      console.warn('   Deberías hacer URL encoding de caracteres especiales')
      console.warn('   Ejemplo: * → %2A, @ → %40, # → %23')
    } else {
      console.log('✅ Contraseña configurada')
    }
  } else {
    console.error('❌ ERROR: No se encontró contraseña en la URL')
    hasErrors = true
  }
  
  console.log('\n' + '='.repeat(60))
  
  if (hasErrors) {
    console.log('\n❌ Se encontraron problemas en la configuración\n')
    console.log('📝 Formato correcto para conexión directa:')
    console.log('   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"')
    console.log('\n📝 Ejemplo:')
    console.log('   DATABASE_URL="postgresql://postgres.bgtthymbhuihucjkcpj:Realcarscompany2025%2A@db.bgtthymbhuihucjkcpj.supabase.co:5432/postgres"')
    console.log('\n💡 Cómo obtener la URL correcta:')
    console.log('   1. Ve a Supabase Dashboard > Settings > Database')
    console.log('   2. Busca "Connection string"')
    console.log('   3. Selecciona "URI" (NO Session mode ni Transaction mode)')
    console.log('   4. Copia la URL completa')
    console.log('   5. Si tu contraseña tiene *, haz encoding: * → %2A')
    process.exit(1)
  } else {
    console.log('\n✅ La configuración parece correcta')
    console.log('\n💡 Si aún tienes errores:')
    console.log('   1. Verifica que la contraseña sea correcta')
    console.log('   2. Verifica que el project reference sea correcto')
    console.log('   3. Reinicia el servidor: npm run dev')
    console.log('   4. Prueba la conexión: npx prisma db pull')
  }
  
} catch (error) {
  console.error('\n❌ ERROR al analizar la URL:')
  console.error(`   ${error.message}`)
  console.log('\n📝 Verifica que tu DATABASE_URL tenga el formato correcto:')
  console.log('   postgresql://usuario:contraseña@host:puerto/base_de_datos')
  process.exit(1)
}

console.log('')








