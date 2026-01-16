import { NextResponse } from 'next/server'

// Simple in-memory storage for rate limiting
// In production with multiple instances, use Redis or similar
const ipRequests = new Map<string, { count: number; windowStart: number }>()

interface RateLimitConfig {
    windowMs: number
    max: number
}

// Default: 20 requests per minute
const DEFAULT_CONFIG: RateLimitConfig = {
    windowMs: 60 * 1000,
    max: 20
}

export function rateLimit(ip: string, config: RateLimitConfig = DEFAULT_CONFIG) {
    const now = Date.now()
    const record = ipRequests.get(ip)

    if (!record) {
        ipRequests.set(ip, { count: 1, windowStart: now })
        return { success: true }
    }

    if (now - record.windowStart > config.windowMs) {
        // Reset window
        ipRequests.set(ip, { count: 1, windowStart: now })
        return { success: true }
    }

    if (record.count >= config.max) {
        return { success: false }
    }

    record.count++
    return { success: true }
}

// Sanitization helper
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return ''
    // Remove basic HTML tags and script injection attempts
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim()
}
