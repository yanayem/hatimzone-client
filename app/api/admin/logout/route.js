import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { successResponse } from "@/lib/api-utils";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the adminToken cookie
    cookieStore.delete("adminToken");

    return successResponse(null, "Logged out successfully");
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
