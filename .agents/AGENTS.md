# Diretrizes de Arquitetura da Nexus Holding

## Padrão de Domínio Único (Sovereign Portal)
Todas as novas aplicações, sistemas verticais (Pharma, Supermercado, etc) e microsserviços desenvolvidos para a Nexus devem obrigatoriamente operar dentro da estrutura do **Nexus Sovereign Portal**. 

Sob nenhuma circunstância aplicações devem ser entregues diretamente sob subdomínios expostos da Vercel (ex: `app-xyz.vercel.app`). 

O acesso final do usuário deve sempre seguir a hierarquia do domínio principal da Nexus:
Exemplo: `https://www.nexustreinamento.com/nome-do-setor/aplicacao`

Se um sistema necessitar de um backend ou front-end isolado para processamento, ele deverá ser acoplado ao domínio principal (via iFrame, Rewrite de rotas no Next.js, ou integração direta de componentes).
