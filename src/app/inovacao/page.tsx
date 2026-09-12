import React from 'react';
import { 
  Shield, 
  Cpu, 
  TrendingUp, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  UserCheck
} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-black relative">
      {/* Background Premium Ambar Exclusive */}
      <div className="fixed inset-0 -z-20 bg-black pointer-events-none" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.75)_0%,rgba(245,158,11,0.22)_45%,rgba(0,0,0,1)_120%)] pointer-events-none" />

      {/* Top Header */}
      <header className="border-b border-amber-500/20 bg-black/75 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Cpu className="w-6 h-6 text-black font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                NEXUS
              </span>
              <span className="text-[11px] font-semibold tracking-widest text-amber-400 uppercase">
                Tecnologia & Inovação
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-200">
            <a href="#solucoes" className="hover:text-amber-400 transition">Soluções</a>
            <a href="#sobre" className="hover:text-amber-400 transition">Sobre Nós</a>
            <a href="#contato" className="hover:text-amber-400 transition">Contato</a>
          </nav>

          <a
            href="https://wa.me/5551999029371?text=Olá!%20Gostaria%20de%20conhecer%20as%20soluções%20da%20Nexus%20Tecnologia%20e%20Inovação."
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black text-sm font-extrabold hover:brightness-110 shadow-lg shadow-amber-500/25 transition flex items-center space-x-2"
          >
            <span>Falar com Diretoria</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-28 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold mb-8 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide uppercase text-[11px] font-bold">Ecossistema Nexus Holding Group • Nível Corporativo</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight drop-shadow-md">
            Inteligência, Tecnologia e <br className="hidden sm:inline" />
            <span>
              Inovação Comercial de Alto Impacto
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Potencializamos empresas através da capacitação gerencial de excelência, governança da informação, estruturação digital e aceleração comercial estratégica.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#solucoes"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-extrabold hover:brightness-110 transition shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 text-base"
            >
              <span>Conhecer Nossas Soluções</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </a>
            <a
              href="https://nexusholdinggroup.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-amber-500/30 bg-black/60 hover:bg-amber-950/30 text-amber-200 font-semibold transition flex items-center justify-center space-x-2 text-base backdrop-blur-sm"
            >
              <span>Conhecer a Holding</span>
              <ExternalLink className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Grid de Soluções Baseadas no Objeto Social */}
      <section id="solucoes" className="py-24 px-6 border-t border-amber-500/20 bg-black/40 backdrop-blur-sm relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-3">Eixos Estratégicos</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Soluções Desenhadas para Gerar Resultados Concretos
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-2xl border border-amber-500/30 bg-black/70 hover:border-amber-400/60 transition duration-300 flex flex-col justify-between group shadow-[0_0_45px_-10px_rgba(245,158,11,0.25)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Promoção Comercial & Vendas B2B</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Estratégias avançadas de relacionamento institucional, captação corporativa, expansão de carteiras e representação comercial de soluções de alto valor.
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-amber-500/20 pt-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Prospecção e qualificação executiva</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Alinhamento de valor e propostas B2B</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Promoção de vendas e eventos corporativos</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-2xl border border-amber-500/30 bg-black/70 hover:border-amber-400/60 transition duration-300 flex flex-col justify-between group shadow-[0_0_45px_-10px_rgba(245,158,11,0.25)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Treinamento & Desenvolvimento Gerencial</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Programas de capacitação para lideranças, formação em informática aplicada e ferramentas corporativas digitais com foco em produtividade real.
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-amber-500/20 pt-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Capacitação em sistemas e informática aplicada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Workshops de produtividade e liderança</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Adoção de métodos ágeis de gestão</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-2xl border border-amber-500/30 bg-black/70 hover:border-amber-400/60 transition duration-300 flex flex-col justify-between group shadow-[0_0_45px_-10px_rgba(245,158,11,0.25)]">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Governança & Apoio Administrativo</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Organização de fluxos de informação, estruturação de cadastros corporativos, saneamento de bases e suporte administrativo de retaguarda.
                </p>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 border-t border-amber-500/20 pt-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Estruturação e saneamento cadastral</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Serviços de apoio operacional e secretaria</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Preparação técnica de documentações</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre a Liderança */}
      <section id="sobre" className="py-24 px-6 border-t border-amber-500/20">
        <div className="max-w-5xl mx-auto bg-black/80 p-8 md:p-12 rounded-3xl border border-amber-500/40 flex flex-col md:flex-row items-center gap-10 shadow-[0_0_70px_-15px_rgba(245,158,11,0.35)] backdrop-blur-md">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-600/20 border border-amber-500/50 flex items-center justify-center flex-shrink-0 shadow-xl">
            <UserCheck className="w-16 h-16 text-amber-400" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-amber-400 uppercase block mb-2">
              Liderança Executiva
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              Ivoni Severo Schuh
            </h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
              À frente da <strong>Nexus Tecnologia e Inovação</strong> e Co-fundadora & CCO da <strong>Nexus Holding Group</strong>, lidera frentes dedicadas à expansão de mercado, relacionamento comercial com grandes contas e capacitação contínua de pessoas e negócios em todo o Brasil.
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
              <span className="px-3.5 py-1.5 rounded-lg bg-black/80 border border-amber-500/30 text-amber-300">CNPJ: 69.042.151/0001-09</span>
              <span className="px-3.5 py-1.5 rounded-lg bg-black/80 border border-amber-500/30 text-amber-300">Mato Leitão • Rio Grande do Sul</span>
              <span className="px-3.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-300">Empresa Ativa • Receita Federal</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="border-t border-amber-500/20 bg-black/90 py-16 px-6 text-sm text-slate-400 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <span className="text-lg font-bold text-white block mb-2">NEXUS TECNOLOGIA E INOVAÇÃO</span>
            <p className="text-xs text-amber-400/80 mb-4 font-mono">69.042.151 IVONI SEVERO SCHUH • CNPJ: 69.042.151/0001-09</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Empresa integrante da rede de inovação, capacitação e representação comercial da Nexus Holding Group.
            </p>
          </div>

          <div>
            <span className="text-sm font-semibold text-white block mb-4">Canais Oficiais de Atendimento</span>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-400" />
                <a href="mailto:ivonisevero4@gmail.com" className="hover:text-amber-400 transition text-slate-300">ivonisevero4@gmail.com</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-400" />
                <a href="https://wa.me/5551999029371" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition text-slate-300">(51) 99902-9371 (WhatsApp Oficial)</a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300">Rua Alceu Goerck, 1237, Centro, Mato Leitão - RS</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-sm font-semibold text-white block mb-4">Ecossistema & Domínio</span>
            <ul className="space-y-3 text-xs">
              <li>
                <a href="https://nexusholdinggroup.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition flex items-center space-x-1.5 text-slate-300">
                  <span>Portal Oficial Nexus Holding Group</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>
              </li>
              <li className="text-slate-300">
                Domínio Registrado: <span className="text-amber-400 font-mono font-medium">nexustecnologiaeinovacao.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <span>© 2026 Nexus Tecnologia e Inovação. Todos os direitos reservados.</span>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Padrão Nexus Exclusive • Ativo</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
