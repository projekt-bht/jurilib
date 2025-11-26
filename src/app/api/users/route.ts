import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { ApiError, handleApiError } from "@/lib/errors";
import {
  MIN_PASSWORD_LENGTH,
  isValidEmail,
  sanitizeString,
} from "@/lib/validation";
import { Prisma } from "~/generated/prisma/client";
import { UserType } from "~/generated/prisma/enums";

const scrypt = promisify(scryptCallback);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  // Store salt + hash together so the salt is available for verification later.
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    try {
      payload = await req.json();
    } catch {
      throw new ApiError("Invalid JSON payload", 400);
    }

  const { name, email, password } = (payload ?? {}) as Record<
    string,
    unknown
  >;

  const sanitizedName = sanitizeString(name);
  const sanitizedEmail = sanitizeString(email).toLowerCase();
  const sanitizedPassword = sanitizeString(password);

    if (!sanitizedName) {
      throw new ApiError("Name is required", 400);
    }

    if (!sanitizedEmail || !isValidEmail(sanitizedEmail)) {
      throw new ApiError("Valid email is required", 400);
    }

    if (!sanitizedPassword || sanitizedPassword.length < MIN_PASSWORD_LENGTH) {
      throw new ApiError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
        400,
      );
    }

    const passwordHash = await hashPassword(sanitizedPassword);

    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: passwordHash,
        type: UserType.USER,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return handleApiError(new ApiError("Email already registered", 409), "Email already registered");
    }

    return handleApiError(error, "Internal server error");
  }
}
