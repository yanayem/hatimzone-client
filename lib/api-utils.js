import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

/**
 * Standard Success Response
 */
export const successResponse = (data, message = "Success", status = 200) => {
  return NextResponse.json({
    success: true,
    message,
    data,
  }, { status });
};

/**
 * Standard Error Response
 */
export const errorResponse = (message = "Error", status = 500, details = null) => {
  return NextResponse.json({
    success: false,
    message,
    details,
  }, { status });
};

/**
 * Check Admin Authentication
 */
export const checkAdminAuth = async (req) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("adminToken")?.value;

    if (!token) {
      return { valid: false, error: "Authentication required" };
    }

    const secret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secret);
    return { valid: true, admin: decoded };
  } catch (err) {
    return { valid: false, error: "Invalid or expired token" };
  }
};

/**
 * Pagination Helpers
 */
export const getPaginationParams = (req) => {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "12")));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationResponse = (items, total, page, limit) => {
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    }
  };
};

/**
 * Common Validators
 */
export const validators = {
  isValidString: (val, min = 1) => typeof val === "string" && val.trim().length >= min,
  isValidPrice: (val) => typeof val === "number" && val >= 0,
  isValidQuantity: (val) => Number.isInteger(val) && val >= 0,
  isValidEmail: (val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val),
  isValidImageArray: (val) => Array.isArray(val) && val.length > 0 && val.every(v => typeof v === "string"),
};
