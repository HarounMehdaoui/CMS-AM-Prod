import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { queryOne } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type AdminUserRow = {
  id: string;
  email: string;
  password_hash: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const user = await queryOne<AdminUserRow>(
    `select id, email, password_hash from admin_users where email = $1`,
    [email.toLowerCase().trim()]
  );

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  await setSessionCookie({ sub: user.id, email: user.email });
  return NextResponse.json({ ok: true });
}
