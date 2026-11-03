const fs = require('fs');

const logoB64 = 'data:image/jpeg;base64,' + fs.readFileSync('c:/Users/geand/Gitclone/nexus-sovereign-portal/public/nexus-logo-cover.jpg').toString('base64');
const humanAiB64 = 'data:image/jpeg;base64,' + fs.readFileSync('c:/Users/geand/Gitclone/nexus-sovereign-portal/public/nexus-human-ai-cover.jpg').toString('base64');

let html = fs.readFileSync('c:/Users/geand/Gitclone/nexus-sovereign-portal/public/catalogo-solucoes-enterprise-nexus.html', 'utf8');

const startMarker = '<!-- ==================== PÁGINA 1: CAPA INSTITUCIONAL ==================== -->';
const endMarker = '<!-- ==================== PÁGINA 1: VISÃO GERAL DA SUÍTE ==================== -->';

const coverPage = `${startMarker}
  <div class="page cover" style="justify-content: space-between; align-items: center; text-align: center; padding: 14mm 18mm 12mm 18mm; background: #ffffff;">
    
    <!-- IMAGEM 1: LOGO NEXUS HOLDING GROUP NO TOPO -->
    <div style="width: 100%; max-height: 84mm; display: flex; justify-content: center; align-items: center; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; background: #070d19; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
      <img src="${logoB64}" style="width: 100%; height: 84mm; object-fit: cover; object-position: center; display: block;" alt="Nexus Holding Group Logo" />
    </div>

    <!-- TÍTULO & IDENTIFICAÇÃO EXECUTIVA -->
    <div style="width: 100%; padding: 6px 0;">
      <div style="display: inline-block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #475569; border-bottom: 2px solid #0f172a; padding-bottom: 2px; margin-bottom: 6px;">
        PORTFÓLIO DE ENGENHARIA COGNITIVA &amp; SOLUÇÕES ENTERPRISE
      </div>
      <h1 style="font-family: Georgia, Cambria, 'Times New Roman', serif; font-size: 22px; font-weight: 700; color: #0f172a; line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 4px;">
        Catálogo Executivo de Soluções Soberanas
      </h1>
      <div style="font-size: 11px; color: #475569; font-weight: 400; line-height: 1.4; max-width: 160mm; margin: 0 auto;">
        Arquitetura de Missão Crítica para Indústria Têxtil &amp; Moda, Revenda Automotiva/Náutica, Vitrines Phygital, Televisão e Rádio.
      </div>
    </div>

    <!-- IMAGEM 2: HOMEM E IA CONVERSANDO (NEXUS SIMBIOSE) -->
    <div style="width: 100%; max-height: 96mm; display: flex; justify-content: center; align-items: center; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; background: #030712; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
      <img src="${humanAiB64}" style="width: 100%; height: 96mm; object-fit: cover; object-position: center; display: block;" alt="Nexus Simbiose - A união do ser humano com a IA a serviço da humanidade" />
    </div>

    <!-- RODAPÉ DA CAPA -->
    <div style="width: 100%; border-top: 1px solid #cbd5e1; padding-top: 8px;">
      <div style="font-family: Georgia, Cambria, serif; font-size: 11px; font-style: italic; color: #0f172a; font-weight: 600; margin-bottom: 3px;">
        "A união do ser humano com a IA a serviço da humanidade."
      </div>
      <div style="font-size: 9.5px; color: #64748b; font-weight: 500; display: flex; justify-content: space-between; align-items: center;">
        <span>NEXUS HOLDING GROUP • Mato Leitão - RS - Brasil</span>
        <span>EDIÇÃO EXECUTIVA 2026 / 2027</span>
        <span>www.nexusholdinggroup.com.br</span>
      </div>
    </div>

  </div>\n\n`;

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  html = html.substring(0, startIndex) + coverPage + html.substring(endIndex);
  fs.writeFileSync('c:/Users/geand/Gitclone/nexus-sovereign-portal/public/catalogo-solucoes-enterprise-nexus.html', html, 'utf8');
  console.log('REPLACED COVER SUCCESSFULLY WITH NEXUS SIMBIOSE!');
} else {
  console.log('Markers not found! Start:', startIndex, 'End:', endIndex);
}
