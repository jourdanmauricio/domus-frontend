import { NextRequest } from 'next/server';
import { BackendClient, createApiResponse } from '../utils/backend-client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const path = `/${pathSegments.join('/')}`;
  const response = await BackendClient.get(path);
  return createApiResponse(response);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const path = `/${pathSegments.join('/')}`;

  // Detectar si es FormData o JSON
  const contentType = request.headers.get('content-type') || '';

  let body;
  if (contentType.includes('multipart/form-data')) {
    // Es FormData (para subir archivos)
    body = await request.formData();
  } else {
    // Es JSON
    body = await request.json();
  }

  const response = await BackendClient.post(path, body);
  return createApiResponse(response);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const path = `/${pathSegments.join('/')}`;

  // Detectar si es FormData o JSON
  const contentType = request.headers.get('content-type') || '';

  let body;
  if (contentType.includes('multipart/form-data')) {
    // Es FormData (para subir archivos)
    body = await request.formData();
  } else {
    // Es JSON
    body = await request.json();
  }

  const response = await BackendClient.put(path, body);
  return createApiResponse(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const path = `/${pathSegments.join('/')}`;
  const response = await BackendClient.delete(path);
  return createApiResponse(response);
}
