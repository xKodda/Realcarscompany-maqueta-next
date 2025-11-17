# Pasos para Regenerar el Cliente de Prisma

## ⚠️ IMPORTANTE: Debes detener el servidor de desarrollo primero

1. **Detén el servidor de desarrollo** (presiona `Ctrl+C` en la terminal donde corre `npm run dev`)

2. **Regenera el cliente de Prisma:**
   ```bash
   npx prisma generate
   ```

3. **Crea la migración para agregar el modelo User:**
   ```bash
   npx prisma migrate dev --name add_user_model
   ```

4. **Ejecuta el seed para crear el usuario admin:**
   ```bash
   npm run prisma:seed
   ```
   O:
   ```bash
   node prisma/seed.js
   ```

5. **Reinicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## Nota sobre el error EPERM

Si ves un error `EPERM: operation not permitted` al ejecutar `npx prisma generate`, asegúrate de:
- Haber detenido completamente el servidor de desarrollo
- Cerrar cualquier editor de código que esté usando los archivos de Prisma
- Esperar unos segundos después de detener el servidor

## Verificar que funcionó

Después de regenerar, verifica que el modelo User existe:
- Deberías poder hacer login con:
  - Email: `admin@realcarscompany.cl`
  - Password: `Admin123!`

