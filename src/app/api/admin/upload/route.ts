import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import path from 'path'
import fs from 'fs/promises'

export async function POST(request: Request) {
  try {
    await requireAuth()

    const form = await request.formData()

    // Intentar obtener archivos de ambas formas: 'file' (singular) y 'files' (plural)
    const singleFile = form.get('file') as File | null
    const multipleFiles = form.getAll('files') as File[]

    const files = singleFile ? [singleFile] : multipleFiles

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No se enviaron archivos' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const urls: string[] = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const safeName = (file.name || 'image')
        .replace(/[^a-zA-Z0-9.\-_]/g, '_')
        .toLowerCase()
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`

      const filePath = path.join(uploadDir, uniqueName)
      await fs.writeFile(filePath, buffer)

      urls.push(`/uploads/${uniqueName}`)
    }

    // Si fue un solo archivo, devolver { url }, si fueron varios, devolver { urls }
    if (singleFile) {
      return NextResponse.json({ success: true, url: urls[0] })
    } else {
      return NextResponse.json({ success: true, urls })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}
