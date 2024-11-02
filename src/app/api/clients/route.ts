// app/api/clients/route.ts

import { NextResponse } from 'next/server';

const BASE_URL = 'http://localhost:8080/api';

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/clients`);
    const clients = await res.json();
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const clientData = await request.json();

    const res = await fetch(`${BASE_URL}/cad-client`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });

    const client = await res.json();
    return NextResponse.json(client, { status: res.ok ? 201 : res.status });
  } catch (error) {
    console.error('Error registering client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
