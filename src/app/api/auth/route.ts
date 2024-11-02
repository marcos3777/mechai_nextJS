// app/api/auth/route.ts

import { NextResponse } from 'next/server';

const BASE_URL = 'http://localhost:8080/api/auth';

export async function POST(request: Request) {
  try {
    const loginData = await request.json();

    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (!res.ok) {
      return NextResponse.json({ message: 'Invalid login or password' }, { status: 401 });
    }

    const user = await res.json();
    return NextResponse.json({ message: 'Login successful', user }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
