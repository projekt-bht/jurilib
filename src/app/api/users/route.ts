import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/db";
import { Prisma } from "~/generated/prisma/client";
import { UserType } from "~/generated/prisma/enums";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const scrypt = promisify(scryptCallback);

const sanitizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  // Store salt + hash together so the salt is available for verification later.
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function POST(req: NextRequest) {
  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  const { name, email, password } = (payload ?? {}) as Record<
    string,
    unknown
  >;

  const sanitizedName = sanitizeString(name);
  const sanitizedEmail = sanitizeString(email).toLowerCase();
  const sanitizedPassword = sanitizeString(password);

  if (!sanitizedName) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!sanitizedEmail || !EMAIL_REGEX.test(sanitizedEmail)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 },
    );
  }

  if (!sanitizedPassword || sanitizedPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 },
    );
  }

  try {
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
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    console.error("Failed to register user", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

