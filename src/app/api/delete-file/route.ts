import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Database } from '@/types/supabase'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = cookies()
    console.log(cookies)
    const supabase = createRouteHandlerClient<Database>({ 
      cookies: () => cookieStore 
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const transferId = searchParams.get('transferId')

    if (!transferId) {
      return NextResponse.json({ error: 'Transfer ID required' }, { status: 400 })
    }

    // Get transfer details
    const { data: transfer, error: fetchError } = await supabase
      .from('transfers')
      .select('*')
      .eq('id', transferId)
      .eq('sender_id', user.id)
      .single()

    if (fetchError || !transfer) {
      return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
    }

    // Delete from Cloudinary if it has a cloudinary public_id
    if (transfer.metadata && transfer.metadata.cloudinary_public_id) {
      try {
        await deleteFromCloudinary(
          transfer.metadata.cloudinary_public_id,
          transfer.metadata.cloudinary_resource_type || 'image'
        )
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError)
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('transfers')
      .delete()
      .eq('id', transferId)

    if (deleteError) {
      throw deleteError
    }

    return NextResponse.json({ success: true })

  } catch (error: unknown) {
   const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}