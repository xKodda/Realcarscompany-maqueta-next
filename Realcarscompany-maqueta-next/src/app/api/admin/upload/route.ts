import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    const urls: string[] = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const safeName = (file.name || 'image')
        .replace(/[^a-zA-Z0-9.\-_]/g, '_')
        .toLowerCase()
      // Generate a unique file path
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`

      // Use the admin client if available to bypass RLS policies
      // (This is safe because the route is protected by requireAuth)
      // Import dynamically to avoid issues if using 'supabase' from lib
      const { supabaseAdmin } = await import('@/lib/supabase')
      const storageClient = supabaseAdmin || supabase

      const bucketName = 'VehiclesImage'
      let uploadError = null
      let uploadData = null

      // Try uploading to 'VehiclesImage'
      const { data, error } = await storageClient.storage
        .from(bucketName)
        .upload(uniqueName, buffer, {
          contentType: file.type,
          upsert: false
        })

      if (error) {
        // If the error is related to the bucket not being found, try lowercase 'vehiclesimage'
        // Common issue where Supabase/Postgres identifiers are case sensitive or normalized
        console.warn(`Failed to upload to '${bucketName}', trying lowercase 'vehiclesimage'. Error: ${error.message}`)

        const { data: dataLow, error: errorLow } = await storageClient.storage
          .from(bucketName.toLowerCase())
          .upload(uniqueName, buffer, {
            contentType: file.type,
            upsert: false
          })

        if (errorLow) {
          uploadError = errorLow
        } else {
          uploadData = dataLow
        }
      } else {
        uploadData = data
      }

      if (uploadError) {
        console.error('Supabase upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      // Use the bucket name that succeeded (or default if we didn't track it perfectly, but valid path relies on it)
      const successfulBucket = uploadData?.path ? (uploadData.path.includes('/') ? bucketName : bucketName) : bucketName
      // Note: getPublicUrl just constructs a string, it doesn't validate existence. 
      // We should use the bucket name we successfully uploaded to.
      // If we retried with lowercase, we should use lowercase.
      const finalBucketName = (!data && uploadData) ? bucketName.toLowerCase() : bucketName

      const { data: { publicUrl } } = storageClient.storage
        .from(finalBucketName)
        .getPublicUrl(uploadData!.path)

      urls.push(publicUrl)
    }

    // Si fue un solo archivo, devolver { url }, si fueron varios, devolver { urls }
    if (singleFile) {
      return NextResponse.json({ success: true, url: urls[0] })
    } else {
      return NextResponse.json({ success: true, urls })
    }
  } catch (error: any) {
    console.error('Upload error details:', {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
      fullError: error
    })
    return NextResponse.json(
      { error: `Error al subir archivo a Storage: ${error.message || 'Error desconocido'}` },
      { status: 500 }
    )
  }
}
