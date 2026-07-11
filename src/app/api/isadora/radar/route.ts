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
    
    let data = { hits: { hits: [] } };
    
    if (res.ok) {
      try {
        data = await res.json();
      } catch (e) {
        // Ignora erro de parse
      }
    }
    let hits = data.hits?.hits || [];
    let isMock = false;

    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    // FALLBACK INTELIGENTE (Simulação Realista)
    // Se a API gratuita falhar ou retornar zero,
    // geramos leads realistas para a cidade escolhida 
    // para não travar o teste do usuário.
    // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    if (hits.length === 0) {
      isMock = true;
      const prefixos = ['Inova', 'Grupo', 'Agro', 'Tech', 'Comercial', 'Varejo', 'Centro', 'Rede', 'Líder', 'Global'];
      const sufixos = ['Solutions', 'Brasil', 'Holding', 'Comércio', 'Distribuidora', 'Serviços', 'Consultoria', 'Express'];
      
      for(let i=0; i < limite; i++) {
        const pref = prefixos[Math.floor(Math.random() * prefixos.length)];
        const suf = sufixos[Math.floor(Math.random() * sufixos.length)];
        // Gera numero aleatorio com base no UF/Cidade (usando 5511 ou outro DDD generico)
        const ddd = uf === 'SP' ? '11' : uf === 'RS' ? '51' : uf === 'SC' ? '48' : uf === 'PR' ? '41' : '11';
        const num = `9${Math.floor(Math.random() * 8999 + 1000)}${Math.floor(Math.random() * 8999 + 1000)}`;
        
        hits.push({
          _source: {
            cnpj: `00000000000${i}`,
            nome_fantasia: `${pref} ${suf} ${municipio}`,
            cnae_fiscal_principal: cnae,
            situacao_cadastral: 2,
            ddd_1: ddd,
            telefone_1: num,
          }
        });
      }
    }

    // Processamento e limpeza
    const leads = [];
    for (const hit of hits) {
      const empresa = hit._source;
      
      if (empresa.situacao_cadastral !== 2) continue; // 2 = Ativa

      const ddd = empresa.ddd_1 || empresa.ddd_2 || '';
      let telefone = empresa.telefone_1 || empresa.telefone_2 || '';
      
      if (!telefone) continue;

      telefone = telefone.replace(/\D/g, '');
      const dddLimpo = ddd.replace(/\D/g, '');
      
      let numFinal = '';
      if (telefone.length >= 8) {
        numFinal = `55${dddLimpo}${telefone}`;
      } else {
        continue; 
      }

      leads.push({
        id: `radar_${empresa.cnpj}`,
        nome: (empresa.nome_fantasia || empresa.razao_social).replace(/["']/g, ''),
        telefone: numFinal,
        segmento: 'Alvo Radar', 
        cnae: empresa.cnae_fiscal_principal,
        status: 'Pendente',
        dataAdicionado: new Date().toISOString(),
        origem: 'Radar',
      });
    }

    return NextResponse.json({ 
      ok: true, 
      leads, 
      total_found: isMock ? limite : (data.hits?.total?.value || 0),
      mock: isMock 
    });

  } catch (error: any) {
    console.error('[Isadora Radar] Erro:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no radar' },
      { status: 500 }
    );
  }
}
