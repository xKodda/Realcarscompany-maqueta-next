// Utilidades de validación y sanitización para RealCars Company
// Sistema completo de validaciones de seguridad y campos

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface FormValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Sanitización de strings
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover caracteres HTML básicos
    .replace(/javascript:/gi, '') // Remover javascript: protocol
    .replace(/on\w+=/gi, '') // Remover event handlers
    .slice(0, 1000) // Limitar longitud
}

// Validación de email
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = []
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!email) {
    errors.push('El email es requerido')
  } else if (!emailRegex.test(email)) {
    errors.push('El formato del email no es válido')
  } else if (email.length > 254) {
    errors.push('El email es demasiado largo')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación de teléfono chileno
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = []
  const cleanPhone = phone.replace(/\D/g, '') // Solo números
  
  if (!phone) {
    errors.push('El teléfono es requerido')
  } else if (cleanPhone.length < 8 || cleanPhone.length > 12) {
    errors.push('El teléfono debe tener entre 8 y 12 dígitos')
  } else if (!/^[+]?[0-9]+$/.test(cleanPhone)) {
    errors.push('El teléfono solo puede contener números')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación de nombre
export function validateName(name: string): ValidationResult {
  const errors: string[] = []
  const sanitizedName = sanitizeString(name)
  
  if (!name) {
    errors.push('El nombre es requerido')
  } else if (sanitizedName.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  } else if (sanitizedName.length > 100) {
    errors.push('El nombre es demasiado largo')
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(sanitizedName)) {
    errors.push('El nombre solo puede contener letras y espacios')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación de mensaje
export function validateMessage(message: string): ValidationResult {
  const errors: string[] = []
  const sanitizedMessage = sanitizeString(message)
  
  if (!message) {
    errors.push('El mensaje es requerido')
  } else if (sanitizedMessage.length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres')
  } else if (sanitizedMessage.length > 1000) {
    errors.push('El mensaje es demasiado largo (máximo 1000 caracteres)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación de precio
export function validatePrice(price: number): ValidationResult {
  const errors: string[] = []
  
  if (typeof price !== 'number') {
    errors.push('El precio debe ser un número')
  } else if (price < 0) {
    errors.push('El precio no puede ser negativo')
  } else if (price > 999999999) {
    errors.push('El precio es demasiado alto')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación de año
export function validateYear(year: number): ValidationResult {
  const errors: string[] = []
  const currentYear = new Date().getFullYear()
  
  if (typeof year !== 'number') {
    errors.push('El año debe ser un número')
  } else if (year < 1990) {
    errors.push('El año no puede ser anterior a 1990')
  } else if (year > currentYear + 1) {
    errors.push('El año no puede ser posterior al año actual')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación de kilometraje
export function validateMileage(mileage: number): ValidationResult {
  const errors: string[] = []
  
  if (typeof mileage !== 'number') {
    errors.push('El kilometraje debe ser un número')
  } else if (mileage < 0) {
    errors.push('El kilometraje no puede ser negativo')
  } else if (mileage > 999999) {
    errors.push('El kilometraje es demasiado alto')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Validación completa de formulario de contacto
export function validateContactForm(formData: {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}): FormValidationResult {
  const errors: Record<string, string> = {}
  
  // Validar nombre
  const nameValidation = validateName(formData.nombre)
  if (!nameValidation.isValid) {
    errors.nombre = nameValidation.errors[0]
  }
  
  // Validar email
  const emailValidation = validateEmail(formData.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors[0]
  }
  
  // Validar teléfono
  const phoneValidation = validatePhone(formData.telefono)
  if (!phoneValidation.isValid) {
    errors.telefono = phoneValidation.errors[0]
  }
  
  // Validar mensaje
  const messageValidation = validateMessage(formData.mensaje)
  if (!messageValidation.isValid) {
    errors.mensaje = messageValidation.errors[0]
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validación de formulario de auto
export function validateAutoForm(formData: {
  marca: string
  modelo: string
  año: number
  precio: number
  kilometraje: number
  imagen: string
}): FormValidationResult {
  const errors: Record<string, string> = {}
  
  // Validar marca
  if (!formData.marca || sanitizeString(formData.marca).length < 2) {
    errors.marca = 'La marca es requerida'
  }
  
  // Validar modelo
  if (!formData.modelo || sanitizeString(formData.modelo).length < 2) {
    errors.modelo = 'El modelo es requerido'
  }
  
  // Validar año
  const yearValidation = validateYear(formData.año)
  if (!yearValidation.isValid) {
    errors.año = yearValidation.errors[0]
  }
  
  // Validar precio
  const priceValidation = validatePrice(formData.precio)
  if (!priceValidation.isValid) {
    errors.precio = priceValidation.errors[0]
  }
  
  // Validar kilometraje
  const mileageValidation = validateMileage(formData.kilometraje)
  if (!mileageValidation.isValid) {
    errors.kilometraje = mileageValidation.errors[0]
  }
  
  // Validar imagen (URL básica)
  if (!formData.imagen || !isValidUrl(formData.imagen)) {
    errors.imagen = 'La URL de la imagen no es válida'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Validación de URL
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

// Sanitización de datos de formulario
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized: any = {}
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized as T
}

// Validación de rate limiting (simulada para frontend)
export function validateRateLimit(
  action: string,
  limit: number = 5,
  windowMs: number = 60000
): boolean {
  const key = `rate_limit_${action}`
  const now = Date.now()
  const stored = localStorage.getItem(key)
  
  if (!stored) {
    localStorage.setItem(key, JSON.stringify([now]))
    return true
  }
  
  try {
    const timestamps: number[] = JSON.parse(stored)
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < windowMs
    )
    
    if (validTimestamps.length >= limit) {
      return false
    }
    
    validTimestamps.push(now)
    localStorage.setItem(key, JSON.stringify(validTimestamps))
    return true
  } catch {
    localStorage.removeItem(key)
    return true
  }
}

// Validación de contenido malicioso
export function validateContent(content: string): ValidationResult {
  const errors: string[] = []
  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /<meta/gi,
    /<style/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi,
  ]
  
  for (const pattern of maliciousPatterns) {
    if (pattern.test(content)) {
      errors.push('El contenido contiene elementos no permitidos')
      break
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Función helper para mostrar errores de validación
export function getFirstError(result: ValidationResult): string {
  return result.errors[0] || 'Error de validación'
}
