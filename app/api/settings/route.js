import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Settings from "@/models/Settings";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }

    return successResponse(settings);
  } catch (error) {
    console.error("Fetch settings error:", error);
    return errorResponse("Failed to fetch settings");
  }
}

// Admin only: Update settings
export async function PUT(req) {
  try {
    // Note: In a real app, verify admin auth here
    const body = await req.json();
    await connectDB();
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(body);
    } else {
      Object.assign(settings, body);
    }
    
    await settings.save();
    return successResponse(settings, "Settings updated successfully");
  } catch (error) {
    console.error("Update settings error:", error);
    return errorResponse("Failed to update settings");
  }
}
