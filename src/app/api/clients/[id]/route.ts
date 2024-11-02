// app/api/clients/[id]/route.ts

import { NextResponse } from 'next/server';

const BASE_URL = 'http://localhost:8080/api/clients';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE_URL}/${params.id}`);
    if (!res.ok) throw new Error('Client not found');
    const client = await res.json();
    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json({ message: 'Client not found' }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedData = await request.json();
    const res = await fetch(`${BASE_URL}/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const updatedClient = await res.json();
    return NextResponse.json(updatedClient, { status: res.ok ? 200 : res.status });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(`${BASE_URL}/${params.id}`, {
      method: 'DELETE',
    });
    const message = await res.json();
    return NextResponse.json(message, { status: res.ok ? 200 : res.status });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
