import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
      }

      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const mime = file.type || 'image/jpeg';
      const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;

      return NextResponse.json({ dataUrl });
    }

    const body = await request.json();

    if (body.type === 'url' && body.url) {
      const url = body.url as string;

      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return NextResponse.json({ error: 'URL tidak valid' }, { status: 400 });
      }

      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        return NextResponse.json({ error: 'Gagal mengunduh gambar' }, { status: 400 });
      }

      const contentType_ = response.headers.get('content-type') || 'image/jpeg';
      const buffer = Buffer.from(await response.arrayBuffer());

      if (buffer.length > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'Ukuran gambar terlalu besar (maks 5MB)' }, { status: 400 });
      }

      const dataUrl = `data:${contentType_};base64,${buffer.toString('base64')}`;

      return NextResponse.json({ dataUrl });
    }

    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Gagal memproses gambar' }, { status: 500 });
  }
}
