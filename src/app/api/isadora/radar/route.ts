import { NextRequest, NextResponse } from 'next/server';

const MINHA_RECEITA_API = 'https://minhareceita.org/search';

export async function POST(req: NextRequest) {
  try {
    const { cnae, municipio, uf, limite = 10 } = await req.json();

    if (!cnae || !municipio || !uf) {
      return NextResponse.json(
        { error: 'Parâmetros obrigatórios: cnae, municipio, uf' },
        { status: 400 }
      );
    }

    // A API do Minha Receita permite buscar por CNAE e Município
    const url = `${MINHA_RECEITA_API}?cnae_fiscal_principal=${cnae}&municipio=${encodeURIComponent(municipio.toUpperCase())}&uf=${uf.toUpperCase()}&per_page=${limite}`;

    const res = await fetch(url);
    
    if (!res.ok) {
      // Se a API estiver instável, retornamos um erro claro
      throw new Error(`Erro na API Minha Receita: ${res.status}`);
    }

    const data = await res.json();
    const hits = data.hits?.hits || [];

    // Processamento e limpeza
    const leads = [];
    for (const hit of hits) {
      const empresa = hit._source;
      
      // Filtra inativas
      if (empresa.situacao_cadastral !== 2) continue; // 2 = Ativa

      const ddd = empresa.ddd_1 || empresa.ddd_2 || '';
      let telefone = empresa.telefone_1 || empresa.telefone_2 || '';
      
      if (!telefone) continue;

      // Pega só números
      telefone = telefone.replace(/\D/g, '');
      const dddLimpo = ddd.replace(/\D/g, '');
      
      // Tenta montar um número no padrão BR
      let numFinal = '';
      if (telefone.length >= 8) {
        numFinal = `55${dddLimpo}${telefone}`;
      } else {
        continue; // Telefone inválido
      }

      leads.push({
        id: `radar_${empresa.cnpj}`,
        nome: (empresa.nome_fantasia || empresa.razao_social).replace(/["']/g, ''),
        telefone: numFinal,
        segmento: 'Desconhecido', // O painel pode mapear
        cnae: empresa.cnae_fiscal_principal,
        status: 'Pendente',
        dataAdicionado: new Date().toISOString(),
        origem: 'Radar',
      });
    }

    return NextResponse.json({ ok: true, leads, total_found: data.hits?.total?.value || 0 });

  } catch (error: any) {
    console.error('[Isadora Radar] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no radar' },
      { status: 500 }
    );
  }
}
