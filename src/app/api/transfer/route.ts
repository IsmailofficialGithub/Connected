import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { detectCodeLanguage } from '@/utils/codeDetection'

type TransferInsert = Database['public']['Tables']['transfers']['Insert']

// GET - Fetch user's transfers
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sessionKey = searchParams.get('session_key')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let query = supabase
      .from('transfers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (sessionKey) {
      query = query.eq('session_key', sessionKey)
    } else {
      query = query.or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ transfers: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}

// POST - Create new transfer
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, type, receiver_id, session_key, metadata } = body

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Auto-detect code if type not specified
    let finalType = type
    let finalMetadata = metadata || {}

    if (!type && content) {
      const detection = detectCodeLanguage(content)
      finalType = detection.isCode ? 'code' : 'text'
      finalMetadata = {
        ...finalMetadata,
        language: detection.language,
        confidence: detection.confidence,
        auto_detected: true
      }
    }

    // Set expiry to 24 hours from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    const transferData: TransferInsert = {
      sender_id: user.id,
      receiver_id: receiver_id || null,
      type: finalType || 'text',
      content,
      session_key: session_key || null,
      metadata: finalMetadata,
      expires_at: expiresAt.toISOString()
    }

    const { data, error } = await supabase
      .from('transfers')
      .insert(transferData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ transfer: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}

// PATCH - Update transfer status
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { transfer_id, status } = body

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('transfers')
      .update({ status })
      .eq('id', transfer_id)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ transfer: data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}

// DELETE - Delete transfer
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const transferId = searchParams.get('id')

    if (!transferId) {
      return NextResponse.json({ error: 'Transfer ID required' }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('transfers')
      .delete()
      .eq('id', transferId)
      .eq('sender_id', user.id) // Only sender can delete

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}