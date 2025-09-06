import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST() {
  try {
    const timestamp = Math.round(Date.now() / 1000)
    const paramsToSign = {
      timestamp,
      folder: 'data-transfer',
      resource_type: 'auto'
    }

    // Generate signature
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
      .join('&')

    const signature = crypto
      .createHash('sha1')
      .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
      .digest('hex')

    return NextResponse.json({
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    })
  } catch (error: unknown) {
   const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}