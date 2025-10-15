// Componente de textarea seguro con validaciones y sanitización
// Protección contra XSS y validaciones en tiempo real

'use client'

import { useState, useRef } from 'react'
import { sanitizeString, validateContent } from '@/lib/validations'

export interface SecureTextareaProps {
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  placeholder?: string
  required?: boolean
  maxLength?: number
  minLength?: number
  rows?: number
  disabled?: boolean
  className?: string
  label?: string
  error?: string
  showCharacterCount?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  id?: string
}

export default function SecureTextarea({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  maxLength = 1000,
  minLength = 0,
  rows = 4,
  disabled = false,
  className = '',
  label,
  error,
  showCharacterCount = true,
  resize = 'none',
  id,
}: SecureTextareaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [localError, setLocalError] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sanitizar valor al cambiar
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value

    // Sanitización general
    newValue = sanitizeString(newValue)

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

    // Validar longitud mínima
    if (minLength > 0 && newValue.length > 0 && newValue.length < minLength) {
      setLocalError(`Debe tener al menos ${minLength} caracteres`)
    } else if (minLength > 0 && newValue.length === 0 && !required) {
      setLocalError('')
    }

    onChange(newValue)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    const sanitizedValue = sanitizeString(e.target.value)
    
    if (onBlur) {
      onBlur(sanitizedValue)
    }

    // Validaciones adicionales en blur
    if (required && !sanitizedValue.trim()) {
      setLocalError('Este campo es requerido')
    } else {
      setLocalError('')
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setLocalError('')
  }

  const displayError = error || localError
  const textareaId = id || name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium tracking-wider uppercase text-gray-600 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          rows={rows}
          disabled={disabled}
          className={`w-full px-4 py-3 border transition-all duration-200 ${
            displayError
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : isFocused
              ? 'border-[#802223] focus:border-[#802223] focus:ring-[#802223]'
              : 'border-gray-200 focus:border-[#802223] focus:ring-[#802223]'
          } focus:outline-none focus:ring-2 focus:ring-opacity-20 resize-${resize} ${
            disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
          } ${className}`}
          aria-invalid={!!displayError}
          aria-describedby={displayError ? `${textareaId}-error` : undefined}
        />
        
        {/* Indicador de seguridad */}
        {value && !displayError && (
          <div className="absolute right-3 top-3">
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
        <p id={`${textareaId}-error`} className="mt-1 text-sm text-red-600">
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
      {value && !displayError && (
        <div className="mt-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Contenido verificado</span>
          </div>
        </div>
      )}
    </div>
  )
}
