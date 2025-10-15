'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { autos } from '@/lib/data'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('autos')
  const [autosList, setAutosList] = useState(autos)

  const handleToggleDestacado = (id: string) => {
    setAutosList(prev => prev.map(auto => 
      auto.id === id ? { ...auto, destacado: !auto.destacado } : auto
    ))
  }

  const handleDeleteAuto = (id: string) => {
    setAutosList(prev => prev.filter(auto => auto.id !== id))
  }

  const stats = {
    totalAutos: autosList.length,
    autosDestacados: autosList.filter(auto => auto.destacado).length,
    autosNuevos: autosList.filter(auto => auto.kilometraje === 0).length,
    autosSeminuevos: autosList.filter(auto => auto.kilometraje > 0).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#161b39]">Panel de Administración</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Admin</span>
              <button className="bg-[#802223] text-white px-4 py-2 rounded-lg text-sm">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-2xl font-bold text-[#161b39]">{stats.totalAutos}</div>
            <div className="text-sm text-gray-600">Total Autos</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-2xl font-bold text-[#802223]">{stats.autosDestacados}</div>
            <div className="text-sm text-gray-600">Destacados</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-2xl font-bold text-[#161b39]">{stats.autosNuevos}</div>
            <div className="text-sm text-gray-600">Nuevos</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="text-2xl font-bold text-[#161b39]">{stats.autosSeminuevos}</div>
            <div className="text-sm text-gray-600">Seminuevos</div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'autos', label: 'Gestión de Autos' },
                { id: 'sorteos', label: 'Sorteos' },
                { id: 'usuarios', label: 'Usuarios' },
                { id: 'config', label: 'Configuración' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-[#802223] text-[#802223]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'autos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#161b39]">Gestión de Autos</h2>
                  <button className="bg-[#802223] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6b1d1e] transition-colors">
                    Agregar Auto
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {autosList.map((auto) => (
                        <tr key={auto.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-xs text-gray-500">IMG</span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {auto.marca} {auto.modelo}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {auto.año} • {auto.kilometraje.toLocaleString('es-CL')} km
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${auto.precio.toLocaleString('es-CL')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              auto.destacado 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {auto.destacado ? 'Destacado' : 'Normal'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleToggleDestacado(auto.id)}
                              className={`px-3 py-1 rounded text-xs ${
                                auto.destacado
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                              }`}
                            >
                              {auto.destacado ? 'Quitar Destacado' : 'Destacar'}
                            </button>
                            <button
                              onClick={() => handleDeleteAuto(auto.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'sorteos' && (
              <div>
                <h2 className="text-xl font-semibold text-[#161b39] mb-6">Gestión de Sorteos</h2>
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">Funcionalidad de sorteos en desarrollo</p>
                  <button className="bg-[#802223] text-white px-4 py-2 rounded-lg text-sm">
                    Crear Nuevo Sorteo
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div>
                <h2 className="text-xl font-semibold text-[#161b39] mb-6">Gestión de Usuarios</h2>
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">Funcionalidad de usuarios en desarrollo</p>
                  <button className="bg-[#802223] text-white px-4 py-2 rounded-lg text-sm">
                    Ver Usuarios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div>
                <h2 className="text-xl font-semibold text-[#161b39] mb-6">Configuración</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración General</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Sitio
                        </label>
                        <input
                          type="text"
                          defaultValue="RealCars Company"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#802223]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email de Contacto
                        </label>
                        <input
                          type="email"
                          defaultValue="contacto@realcarscompany.cl"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#802223]"
                        />
                      </div>
                    </div>
                    <button className="mt-4 bg-[#802223] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#6b1d1e] transition-colors">
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

