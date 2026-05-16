import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  UserProfile: a
    .model({
      id: a.string().required(),
      displayName: a.string(),
      email: a.string().required(),
      avatarUrl: a.string(),
      preferences: a.json(),
    })
    .authorization((allow) => [allow.owner()]),

  Conversation: a
    .model({
      userId: a.string().required(),
      modelId: a.string().required(),
      messages: a.json().required(),
      metadata: a.json(),
    })
    .authorization((allow) => [allow.owner()]),

  PageEvent: a
    .model({
      page: a.string().required(),
      event: a.string().required(),
      device: a.string(),
      country: a.string(),
      timestamp: a.string().required(),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(['create']),
      allow.authenticated().to(['create', 'read']),
    ]),

  // NEXUS EMPRESAS - MÓDULOS INTEGRADOS
  
  PedidoExpedicao: a
    .model({
      pedidoId: a.string().required(),
      cliente: a.string().required(),
      origem: a.string().required(), // 'Vendas', 'PPCP', 'Vendas Avulso'
      produtos: a.json().required(),
      status: a.string().required(), // 'aguardando', 'separacao', 'pronto', 'despachado'
      prioridade: a.string().required(),
      dataEntrega: a.string().required(),
      endereco: a.string().required(),
      rastreio: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),

  OrdemProducao: a
    .model({
      opId: a.string().required(),
      produto: a.string().required(),
      quantidade: a.integer().required(),
      status: a.string().required(), // 'planejada', 'em_producao', 'finalizada', 'expedida'
      dataInicio: a.string(),
      dataFim: a.string(),
      materiais: a.json(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),

  ItemEstoque: a
    .model({
      itemId: a.string().required(),
      nome: a.string().required(),
      categoria: a.string(),
      quantidade: a.float().required(),
      unidade: a.string().required(),
      estoqueMinimo: a.float(),
      localizacao: a.string(),
      ultimaMovimentacao: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),

  MovimentacaoEstoque: a
    .model({
      itemId: a.string().required(),
      tipo: a.string().required(), // 'entrada', 'saida'
      quantidade: a.float().required(),
      origem: a.string(), // 'compra', 'producao', 'expedicao', 'ajuste'
      referencia: a.string(), // ID do pedido/OP relacionado
      observacao: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
