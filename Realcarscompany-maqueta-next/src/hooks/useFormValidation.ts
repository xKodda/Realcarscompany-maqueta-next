// Hook personalizado para validación de formularios
// Integra las utilidades de validación con React

import { useState, useCallback } from 'react'
import { 
  validateContactForm, 
  validateAutoForm, 
  sanitizeFormData,
  validateRateLimit,
  validateContent,
  type FormValidationResult
} from '@/lib/validations'
import type { ContactoForm } from '@/lib/types'

export interface UseFormValidationOptions {
  enableRateLimit?: boolean
  rateLimitWindow?: number
  maxAttempts?: number
}

export interface UseFormValidationReturn<T> {
  errors: Record<string, string>
  isValid: boolean
  isSubmitting: boolean
  validateField: (field: keyof T, value: any) => boolean
  validateForm: (data: T) => boolean
  submitForm: (data: T, onSubmit: (data: T) => Promise<void> | void) => Promise<boolean>
  clearErrors: () => void
  setError: (field: keyof T, message: string) => void
}

export function useFormValidation<T extends Record<string, any>>(
  options: UseFormValidationOptions = {}
): UseFormValidationReturn<T> {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    enableRateLimit = true,
    rateLimitWindow = 60000, // 1 minuto
    maxAttempts = 5
  } = options

  const validateField = useCallback((field: keyof T, value: any): boolean => {
    // Validación básica de contenido malicioso
    if (typeof value === 'string') {
      const contentValidation = validateContent(value)
      if (!contentValidation.isValid) {
        setErrors(prev => ({
          ...prev,
          [field as string]: 'El contenido contiene elementos no permitidos'
        }))
        return false
      }
    }

    // Limpiar error del campo si es válido
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field as string]
      return newErrors
    })
    
    return true
  }, [])

  const validateForm = useCallback((data: T): boolean => {
    // Sanitizar datos primero
    const sanitizedData = sanitizeFormData(data)
    
    // Validar contenido malicioso
    for (const [key, value] of Object.entries(sanitizedData)) {
      if (typeof value === 'string') {
        const contentValidation = validateContent(value)
        if (!contentValidation.isValid) {
          setErrors(prev => ({
            ...prev,
            [key]: 'El contenido contiene elementos no permitidos'
          }))
          return false
        }
      }
    }

    // Validaciones específicas según el tipo de formulario
    let validationResult: FormValidationResult

    // Detectar tipo de formulario por estructura
    if ('nombre' in data && 'email' in data && 'telefono' in data && 'mensaje' in data) {
      validationResult = validateContactForm(data as unknown as ContactoForm)
    } else if ('marca' in data && 'modelo' in data && 'año' in data && 'precio' in data) {
      validationResult = validateAutoForm(data as any)
    } else {
      // Validación genérica
      validationResult = { isValid: true, errors: {} }
    }

    setErrors(validationResult.errors)
    return validationResult.isValid
  }, [])

  const submitForm = useCallback(async (
    data: T, 
    onSubmit: (data: T) => Promise<void> | void
  ): Promise<boolean> => {
    if (isSubmitting) return false

    // Verificar rate limiting
    if (enableRateLimit && !validateRateLimit('form_submit', maxAttempts, rateLimitWindow)) {
      setErrors({
        general: 'Has enviado demasiados formularios. Espera un momento antes de intentar nuevamente.'
      })
      return false
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      // Validar formulario
      if (!validateForm(data)) {
        return false
      }

      // Sanitizar datos antes de enviar
      const sanitizedData = sanitizeFormData(data)
      
      // Ejecutar función de envío
      await onSubmit(sanitizedData)
      
      return true
    } catch (error) {
      console.error('Error al enviar formulario:', error)
      setErrors({
        general: 'Ha ocurrido un error. Por favor, intenta nuevamente.'
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }, [isSubmitting, validateForm, enableRateLimit, maxAttempts, rateLimitWindow])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const setError = useCallback((field: keyof T, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field as string]: message
    }))
  }, [])

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    isSubmitting,
    validateField,
    validateForm,
    submitForm,
    clearErrors,
    setError
  }
}
