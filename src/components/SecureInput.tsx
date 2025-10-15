// Componente de input seguro con validaciones y sanitización
// Protección contra XSS y validaciones en tiempo real

'use client'

import { useState, useRef, useEffect } from 'react'
import { sanitizeString, validateContent } from '@/lib/validations'

export interface SecureInputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url'
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  placeholder?: string
  required?: boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  disabled?: boolean
  className?: string
  label?: string
  error?: string
  showCharacterCount?: boolean
  autoComplete?: string
  id?: string
}

export default function SecureInput({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  maxLength = 1000,
  minLength = 0,
  pattern,
  disabled = false,
  className = '',
  label,
  error,
  showCharacterCount = false,
  autoComplete,
  id,
}: SecureInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [localError, setLocalError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Sanitizar valor al cambiar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Sanitizar según el tipo
    if (type === 'email') {
      newValue = newValue.toLowerCase().trim()
    } else if (type === 'tel') {
      // Solo números, espacios, +, -, (, )
      newValue = newValue.replace(/[^0-9\s+\-()]/g, '')
    } else if (type === 'number') {
      // Solo números
      newValue = newValue.replace(/[^0-9]/g, '')
    } else {
      // Sanitización general
      newValue = sanitizeString(newValue)
    }

    // Validar longitud
    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    // Validar contenido malicioso
    const contentValidation = validateContent(newValue)
    if (!contentValidation.isValid) {
      setLocalError('El contenido contiene elementos no permitidos')
      return
    } else {
      setLocalError('')
    }

    // Validar patrón si existe
    if (pattern && newValue && !new RegExp(pattern).test(newValue)) {
      setLocalError('El formato no es válido')
    } else if (pattern && !newValue && !required) {
      setLocalError('')
    }

    // Validar longitud mínima
    if (minLength > 0 && newValue.length > 0 && newValue.length < minLength) {
      setLocalError(`Debe tener al menos ${minLength} caracteres`)
    } else if (minLength > 0 && newValue.length === 0 && !required) {
      setLocalError('')
    }

    onChange(newValue)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    const sanitizedValue = sanitizeString(e.target.value)
    
    if (onBlur) {
      onBlur(sanitizedValue)
    }

    // Validaciones adicionales en blur
    if (required && !sanitizedValue.trim()) {
      setLocalError('Este campo es requerido')
    } else if (type === 'email' && sanitizedValue) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(sanitizedValue)) {
        setLocalError('El formato del email no es válido')
      } else {
        setLocalError('')
      }
    } else if (type === 'tel' && sanitizedValue) {
      const cleanPhone = sanitizedValue.replace(/\D/g, '')
      if (cleanPhone.length < 8 || cleanPhone.length > 12) {
        setLocalError('El teléfono debe tener entre 8 y 12 dígitos')
      } else {
        setLocalError('')
      }
    } else {
      setLocalError('')
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setLocalError('')
  }

  const displayError = error || localError
  const inputId = id || name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type={type}
          id={inputId}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 border transition-all duration-200 ${
            displayError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFocused
              ? 'border-[#802223] focus:border-[#802223] focus:ring-[#802223]'
              : 'border-gray-200 focus:border-[#802223] focus:ring-[#802223]'
          } focus:outline-none focus:ring-2 focus:ring-opacity-20 ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          } ${className}`}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${inputId}-error` : undefined}
        />
        
        {/* Indicador de seguridad */}
        {value && !displayError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Mensaje de error */}
      {displayError && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {displayError}
        </p>
      )}
      
      {/* Contador de caracteres */}
      {showCharacterCount && (
        <div className="flex justify-between items-center mt-1">
          <div></div>
          <p className="text-xs text-gray-500">
            {value.length}/{maxLength}
          </p>
        </div>
      )}
      
      {/* Información de seguridad */}
      {type === 'password' && value && (
        <div className="mt-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Contraseña segura</span>
          </div>
        </div>
      )}
    </div>
  )
}
