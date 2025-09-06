import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Database } from "@/types/supabase";

export async function GET(
  request: Request,
  { params }: { params: { transferId: string } },
) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get transfer
    const { data: transfer, error } = await supabase
      .from("transfers")
      .select("*")
      .eq("id", params.transferId)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .single();

    if (error || !transfer) {
      return NextResponse.json(
        { error: "Transfer not found" },
        { status: 404 },
      );
    }

    if (!transfer.file_url) {
      return NextResponse.json(
        { error: "No file associated with this transfer" },
        { status: 400 },
      );
    }

    // Get file from Supabase Storage
    const fileUrl = transfer.file_url;
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await response.arrayBuffer();

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${
          transfer.file_name || "download"
        }"`,
        "Content-Length": fileBuffer.byteLength.toString(),
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
