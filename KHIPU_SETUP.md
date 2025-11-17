# Configuración de Khipu - Pasarela de Pagos

## Variables de Entorno Necesarias

Agrega estas variables a tu archivo `.env.local` o `.env`:

```env
# Credenciales de Khipu (obtenerlas desde https://khipu.com)
KHIPU_RECEIVER_ID=tu_receiver_id
KHIPU_SECRET=tu_secret_key

# URL base de Khipu API (por defecto: https://khipu.com/api/2.0)
# Solo cambiar si usas un entorno de pruebas específico
KHIPU_BASE_URL=https://khipu.com/api/2.0

# URL donde Khipu enviará las notificaciones de webhook
# IMPORTANTE: Esta debe ser una URL pública accesible desde internet
KHIPU_NOTIFY_URL=https://tudominio.com/api/pagos/khipu/webhook

# URL pública de tu sitio (para construir return/cancel URLs)
NEXT_PUBLIC_SITE_URL=https://tudominio.com
# o
SITE_URL=https://tudominio.com
```

## Pasos para Configurar Khipu

### 1. Crear cuenta en Khipu
1. Registrarse en [https://khipu.com](https://khipu.com)
2. Completar el proceso de verificación
3. Crear una cuenta de "Cobrador"

### 2. Obtener Credenciales
1. Acceder al panel de Khipu
2. Ir a "Opciones de la cuenta" o "Integración"
3. Copiar el **Receiver ID** (Id de cobrador)
4. Copiar el **Secret** (Llave secreta)

### 3. Configurar Webhook
1. En el panel de Khipu, ir a configuración de webhooks
2. Configurar la URL: `https://tudominio.com/api/pagos/khipu/webhook`
3. La verificación de firma está habilitada automáticamente en producción

### 4. Probar la Integración
1. Usar credenciales de prueba (sandbox) si están disponibles
2. Realizar una compra de prueba
3. Verificar que el webhook recibe las notificaciones
4. Revisar los logs del servidor

## Flujo de Pago

1. **Cliente crea orden** → `/api/pagos/tickets/orden` (POST)
2. **Sistema inicia pago** → `/api/pagos/khipu/iniciar` (POST)
3. **Redirección a Khipu** → Cliente completa el pago
4. **Khipu notifica** → `/api/pagos/khipu/webhook` (POST)
5. **Sistema actualiza orden** → Estado cambia a "pagado"

## Verificación Manual de Pago

Para verificar el estado de un pago manualmente:

```
GET /api/pagos/khipu/verificar/[paymentId]
```

## Estados de Pago

- `pending` - Pago pendiente
- `verified` - Pago verificado (completado)
- `done` - Pago realizado
- `expired` - Pago expirado
- `cancelled` - Pago cancelado

## Seguridad

- ✅ Verificación de firma HMAC SHA256 en webhooks (producción)
- ✅ Validación de tokens de notificación
- ✅ Protección contra replay attacks
- ✅ Transacciones atómicas en base de datos

## Troubleshooting

### Error: "Faltan variables de entorno KHIPU_RECEIVER_ID o KHIPU_SECRET"
- Verifica que las variables estén configuradas en `.env.local`
- Reinicia el servidor de desarrollo después de agregar variables

### Error: "Firma de webhook inválida"
- Verifica que `KHIPU_SECRET` sea correcto
- En desarrollo, la verificación de firma está deshabilitada
- En producción, asegúrate de que el secret coincida con el de Khipu

### El webhook no se recibe
- Verifica que la URL sea pública y accesible
- Usa herramientas como ngrok para desarrollo local
- Revisa los logs del servidor para errores

### El pago no se marca como completado
- Verifica que el webhook esté configurado correctamente en Khipu
- Revisa los logs del webhook
- Usa la verificación manual del pago si es necesario

## Modo Desarrollo vs Producción

### Desarrollo
- La verificación de firma del webhook está deshabilitada
- Puedes usar credenciales de prueba si están disponibles
- Considera usar ngrok para exponer localhost públicamente

### Producción
- La verificación de firma está habilitada automáticamente
- Usa credenciales reales de Khipu
- Asegúrate de que la URL del webhook sea HTTPS
- Monitorea los logs regularmente

## Soporte

Para problemas con Khipu:
- Documentación: https://khipu.com/page/guia-de-implementacion/
- Soporte: soporte@khipu.com

