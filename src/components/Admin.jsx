import React, { useState } from 'react';
import { usePedidos } from '../context/PedidosContext';
import { jsPDF } from 'jspdf';
import { FaSearch, FaFilePdf, FaList, FaChartLine, FaMoneyBillAlt, FaPrint, FaTimes } from 'react-icons/fa';

const Admin = () => {
  const { pedidos, atualizarStatusPedido, cancelarPedido } = usePedidos();
  const [filtroStatus, setFiltroStatus] = useState('');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [ordenacao, setOrdenacao] = useState('id');
  const [pedidoDetalhado, setPedidoDetalhado] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [abaAtiva, setAbaAtiva] = useState('pedidos');
  const [termoPesquisaRelatorios, setTermoPesquisaRelatorios] = useState('');
  const [agrupamentoRelatorio, setAgrupamentoRelatorio] = useState('produto'); // Estado para agrupamento
  const pedidosPorPagina = 5;

  // Filtra e ordena os pedidos
  const pedidosFiltrados = pedidos
    .filter((pedido) => {
      const statusMatch = filtroStatus ? pedido.status === filtroStatus : true;
      const pesquisaMatch =
        termoPesquisa === '' ||
        pedido.id.toString().includes(termoPesquisa) ||
        pedido.nomeCliente.toLowerCase().includes(termoPesquisa.toLowerCase());
      return statusMatch && pesquisaMatch;
    })
    .sort((a, b) => {
      if (ordenacao === 'id') return a.id - b.id;
      if (ordenacao === 'total') return a.total - b.total;
      if (ordenacao === 'status') return a.status.localeCompare(b.status);
      return 0;
    });

  // Paginação
  const indexUltimoPedido = paginaAtual * pedidosPorPagina;
  const indexPrimeiroPedido = indexUltimoPedido - pedidosPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indexPrimeiroPedido, indexUltimoPedido);
  const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);

  // Função para mudar de página
  const mudarPagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  // Função para exibir detalhes do pedido
  const verDetalhesPedido = (pedido) => {
    setPedidoDetalhado(pedido);
  };

  // Função para fechar a modal de detalhes
  const fecharDetalhes = () => {
    setPedidoDetalhado(null);
  };

  // Função para gerar o cupom em PDF
  const gerarCupomPDF = (pedido) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Cupom do Pedido - Cozinha', 20, 20);
    doc.setFontSize(12);
    doc.text(`ID do Pedido: ${pedido.id}`, 20, 30);
    doc.text('Produtos:', 20, 40);
    pedido.produtos.forEach((p, index) => {
      doc.text(`${p.nome} - Quantidade: ${p.quantidade} - Preço: R$ ${p.preco * p.quantidade}`, 20, 50 + index * 10);
    });
    doc.text(`Total: R$ ${pedido.total}`, 20, 50 + pedido.produtos.length * 10);
    doc.text(`Forma de Pagamento: ${pedido.pagamento}`, 20, 60 + pedido.produtos.length * 10);
    doc.text(`Número da Mesa: ${pedido.numeroMesa}`, 20, 70 + pedido.produtos.length * 10);
    doc.text(pedido.endereco, 20, 80 + pedido.produtos.length * 10);
    doc.save(`cupom_pedido_${pedido.id}.pdf`);
  };

  // Função para calcular o total de vendas
  const calcularTotalVendas = () => {
    return pedidos.reduce((total, pedido) => total + pedido.total, 0);
  };

  // Função para agrupar pedidos por produto
  const agruparPedidosPorProduto = () => {
    const agrupamento = {};
    pedidos.forEach((pedido) => {
      pedido.produtos.forEach((produto) => {
        if (!agrupamento[produto.nome]) {
          agrupamento[produto.nome] = {
            quantidade: 0,
            total: 0,
          };
        }
        agrupamento[produto.nome].quantidade += produto.quantidade;
        agrupamento[produto.nome].total += produto.preco * produto.quantidade;
      });
    });
    return agrupamento;
  };

  // Função para agrupar pedidos por cliente
  const agruparPedidosPorCliente = () => {
    const agrupamento = {};
    pedidos.forEach((pedido) => {
      if (!agrupamento[pedido.nomeCliente]) {
        agrupamento[pedido.nomeCliente] = {
          total: 0,
        };
      }
      agrupamento[pedido.nomeCliente].total += pedido.total;
    });
    return agrupamento;
  };

  // Função para fechar o caixa e gerar relatório final
  const fecharCaixa = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório Final do Caixa', 20, 20);
    doc.setFontSize(12);

    // Resumo das vendas
    const totalVendas = calcularTotalVendas();
    doc.text(`Total de Vendas: R$ ${totalVendas.toFixed(2)}`, 20, 30);

    // Agrupamento de dados
    let agrupamento;
    if (agrupamentoRelatorio === 'produto') {
      agrupamento = agruparPedidosPorProduto();
      doc.text('Vendas por Produto:', 20, 40);
      let yPos = 50;
      Object.keys(agrupamento).forEach((nome) => {
        doc.text(`${nome}: ${agrupamento[nome].quantidade}x - Total R$ ${agrupamento[nome].total.toFixed(2)}`, 20, yPos);
        yPos += 10;
      });
    } else if (agrupamentoRelatorio === 'cliente') {
      agrupamento = agruparPedidosPorCliente();
      doc.text('Vendas por Cliente:', 20, 40);
      let yPos = 50;
      Object.keys(agrupamento).forEach((nome) => {
        doc.text(`${nome}: Total R$ ${agrupamento[nome].total.toFixed(2)}`, 20, yPos);
        yPos += 10;
      });
    }

    // Salvar o PDF
    doc.save(`relatorio_caixa_${new Date().toLocaleDateString()}.pdf`);
  };

  // Filtra pedidos para a aba de relatórios
  const pedidosFiltradosRelatorios = pedidos.filter((pedido) => {
    return (
      termoPesquisaRelatorios === '' ||
      pedido.id.toString().includes(termoPesquisaRelatorios) ||
      pedido.nomeCliente.toLowerCase().includes(termoPesquisaRelatorios.toLowerCase())
    );
  });

  return (
    <div className="admin-container">
      <h2>Gerenciar Pedidos</h2>

      {/* Menu de navegação */}
      <div className="menu-navegacao">
        <button
          className={`menu-btn ${abaAtiva === 'pedidos' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('pedidos')}
        >
          <FaList /> Pedidos
        </button>
        <button
          className={`menu-btn ${abaAtiva === 'relatorios' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('relatorios')}
        >
          <FaChartLine /> Relatórios
        </button>
        <button
          className={`menu-btn ${abaAtiva === 'financeiro' ? 'ativo' : ''}`}
          onClick={() => setAbaAtiva('financeiro')}
        >
          <FaMoneyBillAlt /> Financeiro
        </button>
      </div>

      {/* Conteúdo da aba de Pedidos */}
      {abaAtiva === 'pedidos' && (
        <>
          {/* Filtro e pesquisa */}
          <div className="filtro-pesquisa-container">
            <div className="filtro-container">
              <label htmlFor="filtroStatus">Status:</label>
              <select
                id="filtroStatus"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Em preparo">Em preparo</option>
                <option value="Saiu para entrega">Saiu para entrega</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>

            <div className="pesquisa-container">
              <label htmlFor="termoPesquisa">Pesquisar:</label>
              <input
                type="text"
                id="termoPesquisa"
                value={termoPesquisa}
                onChange={(e) => setTermoPesquisa(e.target.value)}
                placeholder="ID ou Nome"
              />
              <FaSearch className="search-icon" />
            </div>

            <div className="ordenacao-container">
              <label htmlFor="ordenacao">Ordenar por:</label>
              <select
                id="ordenacao"
                value={ordenacao}
                onChange={(e) => setOrdenacao(e.target.value)}
              >
                <option value="id">ID</option>
                <option value="total">Total</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>

          {/* Tabela de pedidos */}
          <div className="table-container">
            <table className="pedidos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Produtos</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {pedidosPaginados.map((pedido) => (
                  <tr key={pedido.docId} className="pedido-item">
                    <td>{pedido.id}</td>
                    <td>{pedido.nomeCliente}</td>
                    <td>
                      {pedido.produtos.map((p) => (
                        <div key={p.id}>
                          {p.nome} ({p.quantidade}x) - R$ {p.preco * p.quantidade}
                        </div>
                      ))}
                    </td>
                    <td>R$ {pedido.total}</td>
                    <td>{pedido.status}</td>
                    <td>
                      <div className="acoes-container">
                        <button
                          className="btn-detalhes"
                          onClick={() => verDetalhesPedido(pedido)}
                        >
                          <FaSearch /> Detalhes
                        </button>
                        <button
                          className="btn-preparo"
                          onClick={() => atualizarStatusPedido(pedido.docId, 'Em preparo')}
                        >
                          <FaFilePdf /> Em preparo
                        </button>
                        <button
                          className="btn-entrega"
                          onClick={() => atualizarStatusPedido(pedido.docId, 'Saiu para entrega')}
                        >
                          <FaFilePdf /> Saiu para entrega
                        </button>
                        <button
                          className="btn-concluido"
                          onClick={() => atualizarStatusPedido(pedido.docId, 'Concluído')}
                        >
                          <FaFilePdf /> Concluído
                        </button>
                        <button
                          className="btn-cancelar"
                          onClick={() => cancelarPedido(pedido.docId)}
                        >
                          <FaTimes /> Cancelar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="paginacao-container">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                className={`paginacao-btn ${pagina === paginaAtual ? 'ativo' : ''}`}
                onClick={() => mudarPagina(pagina)}
              >
                {pagina}
              </button>
            ))}
          </div>

          {/* Modal de detalhes do pedido */}
          {pedidoDetalhado && (
            <div className="modal-detalhes">
              <div className="modal-conteudo">
                <h3>Detalhes do Pedido</h3>
                <p><strong>ID:</strong> {pedidoDetalhado.id}</p>
                <p><strong>Cliente:</strong> {pedidoDetalhado.nomeCliente}</p>
                <p><strong>Telefone:</strong> {pedidoDetalhado.telefoneCliente}</p>
                <p><strong>Endereço:</strong> {pedidoDetalhado.endereco}</p>
                <p><strong>Produtos:</strong></p>
                <ul>
                  {pedidoDetalhado.produtos.map((p) => (
                    <li key={p.id}>
                      {p.nome} ({p.quantidade}x) - R$ {p.preco * p.quantidade}
                    </li>
                  ))}
                </ul>
                <p><strong>Total:</strong> R$ {pedidoDetalhado.total}</p>
                <p><strong>Status:</strong> {pedidoDetalhado.status}</p>
                <button
                  className="btn-imprimir"
                  onClick={() => gerarCupomPDF(pedidoDetalhado)}
                >
                  <FaPrint /> Imprimir Cupom
                </button>
                <button className="btn-fechar" onClick={fecharDetalhes}>
                  <FaTimes /> Fechar
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Conteúdo da aba de Relatórios */}
      {abaAtiva === 'relatorios' && (
        <div className="relatorios-container">
          <h3>Relatórios de Pedidos</h3>
          <div className="pesquisa-relatorios">
            <input
              type="text"
              placeholder="Pesquisar pedido por ID ou nome"
              value={termoPesquisaRelatorios}
              onChange={(e) => setTermoPesquisaRelatorios(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="relatorio-item">
            <h4>Total de Pedidos: {pedidosFiltradosRelatorios.length}</h4>
          </div>
          <div className="relatorio-item">
            <h4>Pedidos Concluídos: {pedidosFiltradosRelatorios.filter(pedido => pedido.status === 'Concluído').length}</h4>
          </div>
          <div className="relatorio-item">
            <h4>Pedidos Cancelados: {pedidosFiltradosRelatorios.filter(pedido => pedido.status === 'Cancelado').length}</h4>
          </div>
        </div>
      )}

      {/* Conteúdo da aba Financeiro */}
      {abaAtiva === 'financeiro' && (
        <div className="financeiro-container">
          <h3>Financeiro</h3>
          <div className="financeiro-item">
            <h4>Total de Vendas: R$ {calcularTotalVendas().toFixed(2)}</h4>
          </div>
          <div className="agrupamento-container">
            <label htmlFor="agrupamentoRelatorio">Agrupar por:</label>
            <select
              id="agrupamentoRelatorio"
              value={agrupamentoRelatorio}
              onChange={(e) => setAgrupamentoRelatorio(e.target.value)}
            >
              <option value="produto">Produto</option>
              <option value="cliente">Cliente</option>
            </select>
          </div>
          <button
            className="btn-fechar-caixa"
            onClick={fecharCaixa}
          >
            <FaPrint /> Fechar Caixa e Gerar Relatório
          </button>
        </div>
      )}
    </div>
  );
};

export default Admin;