import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

export const ExpedicaoService = {
  // Listar todos os pedidos
  async listarPedidos() {
    try {
      const { data } = await client.models.PedidoExpedicao.list();
      return data;
    } catch (error) {
      console.error('Erro ao listar pedidos:', error);
      return [];
    }
  },

  // Criar novo pedido
  async criarPedido(pedido: any) {
    try {
      const { data } = await client.models.PedidoExpedicao.create({
        pedidoId: pedido.id,
        cliente: pedido.cliente,
        origem: pedido.origem,
        produtos: JSON.stringify(pedido.produtos),
        status: pedido.status,
        prioridade: pedido.prioridade,
        dataEntrega: pedido.dataEntrega,
        endereco: pedido.endereco,
        rastreio: pedido.rastreio || null,
      });
      return data;
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      throw error;
    }
  },

  // Atualizar status do pedido
  async atualizarStatus(pedidoId: string, novoStatus: string, rastreio?: string) {
    try {
      const { data: pedidos } = await client.models.PedidoExpedicao.list({
        filter: { pedidoId: { eq: pedidoId } }
      });
      
      if (pedidos && pedidos.length > 0) {
        const pedido = pedidos[0];
        const { data } = await client.models.PedidoExpedicao.update({
          id: pedido.id,
          status: novoStatus,
          rastreio: rastreio || pedido.rastreio,
        });
        return data;
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Registrar saída (baixa do estoque)
  async registrarSaida(pedidoId: string, produtos: any[]) {
    try {
      // Atualiza status do pedido
      const rastreio = `BR${Date.now().toString().slice(-9)}`;
      await this.atualizarStatus(pedidoId, 'despachado', rastreio);

      // Registra movimentação de estoque para cada produto
      for (const produto of produtos) {
        await client.models.MovimentacaoEstoque.create({
          itemId: produto.nome, // Idealmente seria um ID único
          tipo: 'saida',
          quantidade: produto.qtd,
          origem: 'expedicao',
          referencia: pedidoId,
          observacao: `Expedição do pedido ${pedidoId}`,
        });

        // Atualiza quantidade no estoque
        const { data: itens } = await client.models.ItemEstoque.list({
          filter: { nome: { eq: produto.nome } }
        });

        if (itens && itens.length > 0) {
          const item = itens[0];
          await client.models.ItemEstoque.update({
            id: item.id,
            quantidade: (item.quantidade || 0) - produto.qtd,
          });
        }
      }

      return { success: true, rastreio };
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      throw error;
    }
  },

  // Sincronizar com PPCP (buscar OPs finalizadas)
  async sincronizarComPPCP() {
    try {
      const { data: ops } = await client.models.OrdemProducao.list({
        filter: { status: { eq: 'finalizada' } }
      });

      // Criar pedidos de expedição para OPs finalizadas
      if (ops) {
        for (const op of ops) {
          // Verifica se já existe pedido para esta OP
          const { data: pedidosExistentes } = await client.models.PedidoExpedicao.list({
            filter: { pedidoId: { eq: op.opId } }
          });

          if (!pedidosExistentes || pedidosExistentes.length === 0) {
            await this.criarPedido({
              id: op.opId,
              cliente: 'Cliente PPCP', // Idealmente viria da OP
              origem: 'PPCP',
              produtos: JSON.parse(op.materiais as string || '[]'),
              status: 'aguardando',
              prioridade: 'media',
              dataEntrega: op.dataFim || new Date().toISOString().split('T')[0],
              endereco: 'Endereço a definir',
            });

            // Atualiza status da OP
            await client.models.OrdemProducao.update({
              id: op.id,
              status: 'expedida',
            });
          }
        }
      }

      return ops;
    } catch (error) {
      console.error('Erro ao sincronizar com PPCP:', error);
      return [];
    }
  },
};
