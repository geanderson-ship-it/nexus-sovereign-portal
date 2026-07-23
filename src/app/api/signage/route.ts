import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';


// Helper function to get the path to the JSON database
const getDataFilePath = () => {
  return path.join(process.cwd(), 'data', 'signage.json');
};

// GET: Retorna os dados atuais da vitrine
export async function GET() {
  try {
    const filePath = getDataFilePath();
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao ler os dados da vitrine:', error);
    return NextResponse.json({ error: 'Falha ao carregar os dados da vitrine' }, { status: 500 });
  }
}

// POST: Atualiza os dados da vitrine (Salva no JSON)
export async function POST(request: Request) {
  try {
    const newData = await request.json();
    const filePath = getDataFilePath();
    
    // Sobrescreve o arquivo JSON com os novos dados
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: 'Vitrine atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar os dados da vitrine:', error);
    return NextResponse.json({ error: 'Falha ao salvar os dados' }, { status: 500 });
  }
}
