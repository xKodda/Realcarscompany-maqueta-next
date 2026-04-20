import crypto from 'crypto'

interface FlowPaymentRequest {
    commerceOrder: string
    subject: string
    currency: string
    amount: number
    email: string
    urlConfirmation: string
    urlReturn: string
    optional?: string
}

interface FlowResponse {
    url: string
    token: string
    flowOrder: number
}

interface FlowStatusResponse {
    flowOrder: number
    commerceOrder: string
    requestDate: string
    status: number // 1: Pendiente, 2: Pagada, 3: Rechazada, 4: Anulada
    subject: string
    currency: string
    amount: number
    payer: string
    optional?: string
    pending_info?: any
    paymentData?: any
    merchantId: string
}

export class FlowService {
    private apiKey: string
    private secretKey: string
    private apiUrl: string

    constructor() {
        this.apiKey = process.env.FLOW_API_KEY || ''
        this.secretKey = process.env.FLOW_SECRET_KEY || ''
        // Default to Sandbox if not specified
        this.apiUrl = process.env.FLOW_API_URL || 'https://sandbox.flow.cl/api'
    }

    private sign(params: Record<string, any>): string {
        // 1. Sort keys alphabetically
        const keys = Object.keys(params).sort()

        // 2. Concatenate values
        const toSign = keys.map(key => `${key}${params[key]}`).join('')

        // 3. HMAC SHA256
        return crypto.createHmac('sha256', this.secretKey).update(toSign).digest('hex')
    }

    private async request(endpoint: string, method: 'POST' | 'GET', data: Record<string, any> = {}) {
        if (!this.apiKey || !this.secretKey) {
            throw new Error('Flow API Keys not configured')
        }

        const params: Record<string, any> = {
            apiKey: this.apiKey,
            ...data
        }

        const s = this.sign(params)
        const url = `${this.apiUrl}${endpoint}`

        // For GET, append to URL
        // For POST, form-data or x-www-form-urlencoded
        const formData = new URLSearchParams()
        for (const k in params) {
            formData.append(k, params[k])
        }
        formData.append('s', s)

        try {
            const response = await fetch(method === 'GET' ? `${url}?${formData.toString()}` : url, {
                method,
                body: method === 'POST' ? formData : undefined,
                // Flow expects form-data for POST usually
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Flow API Error: ${response.status} - ${errorText}`)
            }

            return await response.json()
        } catch (error) {
            console.error('Flow Request Error:', error)
            throw error
        }
    }

    async createPayment(req: FlowPaymentRequest): Promise<FlowResponse> {
        return this.request('/payment/create', 'POST', req)
    }

    async getStatus(token: string): Promise<FlowStatusResponse> {
        return this.request('/payment/getStatus', 'GET', { token })
    }
}

export const flowService = new FlowService()
