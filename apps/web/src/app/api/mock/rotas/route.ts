import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    { from: [-9.1393, 38.7223], to: [-38.5124, -12.9714], volume: 5000, origem: 'Lisboa', destino: 'Salvador' },
    { from: [13.2343, -8.8390], to: [-38.5124, -12.9714], volume: 12000, origem: 'Luanda', destino: 'Salvador' },
    { from: [-9.1393, 38.7223], to: [-43.1729, -22.9068], volume: 8000, origem: 'Lisboa', destino: 'Rio de Janeiro' },
    { from: [2.0833, 6.3667], to: [-34.8770, -8.0476], volume: 6000, origem: 'Ouidah', destino: 'Recife' },
  ];

  return NextResponse.json(data);
}
