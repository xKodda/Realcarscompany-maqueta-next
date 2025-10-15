// Hook personalizado para manejar pagos con Khipu
// Sistema de compra de tickets para sorteos

import { useState } from 'react'
import {
  pagosService,
  type CompraTicketData,
  type OrdenCompra,
  type TicketSorteo,
} from '@/lib/api/services/pagos.service'

export function useComprarTickets() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orden, setOrden] = useState<OrdenCompra | null>(null)

  const comprar = async (data: CompraTicketData) => {
    setLoading(true)
    setError(null)
    setOrden(null)

    try {
      // MODO DEMO: Simular respuesta para presentación
      console.log('🎯 MODO DEMO - Datos de compra:', data)
      console.log('💰 Total a pagar:', data.cantidad * 3000) // Precio de ejemplo
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Crear orden simulada
      const ordenSimulada: OrdenCompra = {
        id: `demo-orden-${Date.now()}`,
        sorteoId: data.sorteoId,
        cantidad: data.cantidad,
        total: data.cantidad * 3000,
        comprador: data.comprador,
        tickets: Array.from({ length: data.cantidad }, (_, i) => `ticket-${Date.now()}-${i + 1}`),
        estado: 'pendiente',
        fechaCreacion: new Date().toISOString(),
      }

      setOrden(ordenSimulada)
      
      // Simular redirección a Khipu
      const simularRedireccionKhipu = () => {
        const ventanaSimulacion = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes')
        
        if (ventanaSimulacion) {
          ventanaSimulacion.document.write(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Khipu - Pago Seguro</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #333;
                }
                .container {
                  background: white;
                  border-radius: 20px;
                  padding: 40px;
                  box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                  max-width: 500px;
                  width: 90%;
                  text-align: center;
                }
                .logo {
                  width: 120px;
                  height: 120px;
                  background: linear-gradient(135deg, #667eea, #764ba2);
                  border-radius: 50%;
                  margin: 0 auto 30px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 48px;
                  color: white;
                  font-weight: bold;
                }
                h1 { 
                  color: #333; 
                  margin-bottom: 20px; 
                  font-size: 28px;
                  font-weight: 600;
                }
                .amount {
                  background: #f8f9fa;
                  padding: 20px;
                  border-radius: 15px;
                  margin: 20px 0;
                  border: 2px solid #e9ecef;
                }
                .amount-value {
                  font-size: 36px;
                  font-weight: bold;
                  color: #28a745;
                  margin-bottom: 10px;
                }
                .amount-label {
                  color: #6c757d;
                  font-size: 14px;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                }
                .details {
                  background: #f8f9fa;
                  padding: 20px;
                  border-radius: 15px;
                  margin: 20px 0;
                  text-align: left;
                }
                .detail-row {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
                  padding: 5px 0;
                  border-bottom: 1px solid #e9ecef;
                }
                .detail-row:last-child { border-bottom: none; }
                .detail-label { color: #6c757d; }
                .detail-value { font-weight: 600; color: #333; }
                .status {
                  background: #fff3cd;
                  color: #856404;
                  padding: 15px;
                  border-radius: 10px;
                  margin: 20px 0;
                  border: 1px solid #ffeaa7;
                }
                .buttons {
                  display: flex;
                  gap: 15px;
                  margin-top: 30px;
                }
                .btn {
                  flex: 1;
                  padding: 15px 25px;
                  border: none;
                  border-radius: 10px;
                  font-size: 16px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.3s ease;
                }
                .btn-success {
                  background: #28a745;
                  color: white;
                }
                .btn-success:hover {
                  background: #218838;
                  transform: translateY(-2px);
                }
                .btn-secondary {
                  background: #6c757d;
                  color: white;
                }
                .btn-secondary:hover {
                  background: #5a6268;
                }
                .loading {
                  display: inline-block;
                  width: 20px;
                  height: 20px;
                  border: 3px solid #f3f3f3;
                  border-top: 3px solid #667eea;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">K</div>
                <h1>Pago Seguro</h1>
                <p style="color: #6c757d; margin-bottom: 30px;">RealCars Company - Sorteo de Moto</p>
                
                <div class="amount">
                  <div class="amount-value">$${(data.cantidad * 3000).toLocaleString('es-CL')}</div>
                  <div class="amount-label">Pesos Chilenos</div>
                </div>
                
                <div class="details">
                  <div class="detail-row">
                    <span class="detail-label">Comprador:</span>
                    <span class="detail-value">${data.comprador.nombre}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${data.comprador.email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Teléfono:</span>
                    <span class="detail-value">${data.comprador.telefono}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Tickets:</span>
                    <span class="detail-value">${data.cantidad} x $3.000</span>
                  </div>
                </div>
                
                <div class="status">
                  <strong>🎯 MODO DEMO:</strong><br>
                  Simulación de redirección a Khipu<br>
                  <small>En producción, aquí se procesaría el pago real</small>
                </div>
                
                <div class="buttons">
                  <button class="btn btn-success" onclick="simularPagoExitoso()">
                    <span class="loading" id="loading" style="display: none;"></span>
                    <span id="btn-text">Simular Pago Exitoso</span>
                  </button>
                  <button class="btn btn-secondary" onclick="window.close()">
                    Cancelar
                  </button>
                </div>
              </div>
              
              <script>
                function simularPagoExitoso() {
                  document.getElementById('loading').style.display = 'inline-block';
                  document.getElementById('btn-text').textContent = 'Procesando...';
                  
                  setTimeout(() => {
                    alert('✅ ¡Pago procesado exitosamente!\\n\\nEn el sistema real, el usuario sería redirigido de vuelta a la aplicación con el pago confirmado.');
                    window.close();
                  }, 3000);
                }
              </script>
            </body>
            </html>
          `)
        } else {
          // Si no se puede abrir ventana, mostrar alerta
          alert(`
🎯 SIMULACIÓN KHIPU - Pago Demostrativo

✅ Orden creada: ${ordenSimulada.id}
💰 Total: $${(data.cantidad * 3000).toLocaleString('es-CL')} CLP
👤 Comprador: ${data.comprador.nombre}
📧 Email: ${data.comprador.email}
📱 Teléfono: ${data.comprador.telefono}
🎫 Tickets: ${data.cantidad} x $3.000

🔗 En producción: Aquí se redirigiría a Khipu
📱 El usuario completaría el pago y regresaría
✅ El webhook confirmaría el pago automáticamente

💡 Esta simulación muestra el flujo completo del sistema.
          `)
        }
      }
      
      // Ejecutar simulación después de un breve delay
      setTimeout(simularRedireccionKhipu, 500)

      return {
        orden: ordenSimulada,
        pago: null,
      }
    } catch (err) {
      setError('Error al procesar la compra')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setOrden(null)
    setLoading(false)
  }

  return {
    comprar,
    loading,
    error,
    orden,
    reset,
  }
}

export function useVerificarPago(paymentId: string | null) {
  const [verificando, setVerificando] = useState(false)
  const [estado, setEstado] = useState<
    'pending' | 'verified' | 'done' | 'expired' | null
  >(null)
  const [error, setError] = useState<string | null>(null)

  const verificar = async () => {
    if (!paymentId) return

    setVerificando(true)
    setError(null)

    try {
      const response = await pagosService.verificarPago(paymentId)

      if (response.success && response.data) {
        setEstado(response.data.status)
        return response.data
      } else {
        setError(response.error || 'Error al verificar el pago')
        return null
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return null
    } finally {
      setVerificando(false)
    }
  }

  return {
    verificar,
    verificando,
    estado,
    error,
  }
}

export function useMisTickets() {
  const [tickets, setTickets] = useState<TicketSorteo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarTickets = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await pagosService.obtenerMisTickets(email)

      if (response.success && response.data) {
        setTickets(response.data)
        return response.data
      } else {
        setError(response.error || 'Error al cargar los tickets')
        return []
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }

  const reenviarEmail = async (ordenId: string) => {
    try {
      const response = await pagosService.reenviarEmail(ordenId)
      return response.success
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return {
    tickets,
    loading,
    error,
    cargarTickets,
    reenviarEmail,
  }
}

export function useOrden(ordenId: string | null) {
  const [orden, setOrden] = useState<OrdenCompra | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarOrden = async () => {
    if (!ordenId) return

    setLoading(true)
    setError(null)

    try {
      const response = await pagosService.obtenerOrden(ordenId)

      if (response.success && response.data) {
        setOrden(response.data)
        return response.data
      } else {
        setError(response.error || 'Error al cargar la orden')
        return null
      }
    } catch (err) {
      setError('Error al conectar con el servidor')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    orden,
    loading,
    error,
    cargarOrden,
  }
}

