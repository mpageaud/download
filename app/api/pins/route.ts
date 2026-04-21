import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET — Récupérer tous les pins
export async function GET() {
  try {
    const pins = await prisma.pin.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(pins);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pins' },
      { status: 500 }
    );
  }
}

// POST — Créer un nouveau pin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { lat, lng, title, description, type, season } = body;

    if (!lat || !lng || !title) {
      return NextResponse.json(
        { error: 'lat, lng et title sont requis' },
        { status: 400 }
      );
    }

    const pin = await prisma.pin.create({
      data: { lat, lng, title, description, type, season },
    });

    return NextResponse.json(pin, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du pin' },
      { status: 500 }
    );
  }
}
