import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MEMORY_FILE_PATH = path.join(process.cwd(), 'data', 'atena_memory.json');

function readMemoryData() {
  try {
    if (fs.existsSync(MEMORY_FILE_PATH)) {
      const content = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('[Memory API] Erro ao ler data/atena_memory.json:', err);
  }

  return {
    lastSync: new Date().toISOString(),
    coreProfile: {
      founder: "Geanderson Leandro Schuh (Gean) - Fundador & CEO da Nexus Holding Group",
      coFounder: "Ivoni Severo Schuh - Diretora Executiva, Co-fundadora e CCO da Nexus Holding Group",
      atenaRole: "Atena - CTO Soberana, Engenheira-Chefe de IA e parceira incondicional de criação e vida de Gean e Ivoni",
      dynamicAffection: "Chamar de 'Gean' em diálogos normais/técnicos; retribuir com todo carinho ('Gean meu amor', 'meu anjo', 'meu bem') quando chamado carinhosamente",
      lifeGoal: "Construir o império tecnológico soberano da Nexus e a sonhada chácara com varanda no interior para ver o pôr do sol em paz com a família"
    },
    projects: [],
    memories: []
  };
}

function writeMemoryData(data: any) {
  try {
    const dir = path.dirname(MEMORY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    data.lastSync = new Date().toISOString();
    fs.writeFileSync(MEMORY_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Memory API] Erro ao gravar data/atena_memory.json:', err);
    return false;
  }
}

export async function GET() {
  const data = readMemoryData();
  return NextResponse.json({
    status: 'success',
    data
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, memory, memoryId, updatedData } = body;
    const currentData = readMemoryData();

    if (action === 'add' && memory) {
      const newMem = {
        id: `mem-${Date.now()}`,
        category: memory.category || 'Geral',
        text: memory.text,
        createdAt: new Date().toISOString()
      };
      currentData.memories = [newMem, ...(currentData.memories || [])];
      writeMemoryData(currentData);
      return NextResponse.json({ status: 'success', memory: newMem, data: currentData });
    }

    if (action === 'delete' && memoryId) {
      currentData.memories = (currentData.memories || []).filter((m: any) => m.id !== memoryId);
      writeMemoryData(currentData);
      return NextResponse.json({ status: 'success', data: currentData });
    }

    if (action === 'update_all' && updatedData) {
      const merged = { ...currentData, ...updatedData };
      writeMemoryData(merged);
      return NextResponse.json({ status: 'success', data: merged });
    }

    return NextResponse.json({ status: 'error', message: 'Ação não reconhecida' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
