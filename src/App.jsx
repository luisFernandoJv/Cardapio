import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FaFire, FaPlus, FaMinus } from 'react-icons/fa'; // Importando ícones
import { usePedidos } from './context/PedidosContext'; // Importe usePedidos
import Admin from './components/Admin';
import './App.css';

const App = () => {
  const [menuAberto, setMenuAberto] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [telefone, setTelefone] = useState('');
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [endereco, setEndereco] = useState({ rua: '', numero: '', bairro: '' });
  const [pagamento, setPagamento] = useState('');
  const [numeroMesa, setNumeroMesa] = useState('');
  const [pedidoId, setPedidoId] = useState('');
  const [clientePronto, setClientePronto] = useState(false);
  const [mostrarPedido, setMostrarPedido] = useState(false);
  const [cupons, setCupons] = useState([]);
  const [tempoCancelamento, setTempoCancelamento] = useState(300);
  const [pedidoCancelado, setPedidoCancelado] = useState(false);
  const [retiradaNaLoja, setRetiradaNaLoja] = useState(false);
  const [adminLogin, setAdminLogin] = useState({ username: '', password: '' });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [pedidoCliente, setPedidoCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const { pedidos, adicionarPedido, atualizarStatusPedido } = usePedidos();

  const cardapio = {
    "Entradas e Aperitivos": [
      { id: 1, nome: 'Arroz de Leite', preco: 6, imagem: 'arroz.webp' },
      { id: 2, nome: 'Macaxeira', preco: 6, imagem: 'macaxeira.webp' },
      { id: 3, nome: 'Batata Frita Simples', preco: 15, imagem: 'batata.webp' },
      { id: 4, nome: 'Batata com Cheddar e Bacon', preco: 20, imagem: 'batata.webp' },
      { id: 5, nome: 'Caldo de Quenga', preco: 8, imagem: 'caldo.webp' },
      { id: 6, nome: 'Caldo de Camarão', preco: 10, imagem: 'caldo.webp' },
      { id: 7, nome: 'Bolinha de Carne de Sol', preco: 10, imagem: 'bolinha.webp' },
      { id: 8, nome: 'Bolinha de Frango', preco: 10, imagem: 'bolinha.webp' },
      { id: 9, nome: 'Coração de Frango Flambado', preco: 15, imagem: 'coracao.webp' },
      { id: 10, nome: 'Fígado Acebolado', preco: 15, imagem: 'figado.webp' },
    ],
    "Acompanhamentos": [
      { id: 11, nome: 'Isca de Frango', preco: 20, imagem: 'isca.webp' },
      { id: 12, nome: 'Isca de Peixe', preco: 20, imagem: 'isca.webp' },
      { id: 13, nome: 'Camarão Alho e Óleo', preco: 35, imagem: 'camarao.webp' },
      { id: 14, nome: 'Calabresa Acebolada', preco: 20, imagem: 'calabresa.webp' },
    ],
    "Pratos principais": [
      { id: 15, nome: 'Calabresa com Batata Frita ou Macaxeira', preco: 30, imagem: 'calabresa.webp' },
      { id: 16, nome: 'Carne de Sol com Macaxeira ou Batata Frita', preco: 35, imagem: 'carne.webp' },
      { id: 17, nome: 'Frango à Passarinha', preco: 18, imagem: 'frango.webp' },
      { id: 18, nome: 'Picanha com Fritas ou Macaxeira', preco: 50, imagem: 'carne.webp' },
      { id: 19, nome: 'Picanha com Arroz de Leite, Batata Frita ou Macaxeira', preco: 60, imagem: 'carne.webp' },
    ],
    "Drink": [
      { id: 20, nome: 'Caipirinha de limão', preco: 8.00, imagem: 'caipirinha-limao.webp' },
      { id: 21, nome: 'Caipirinha de morango', preco: 10.00, imagem: 'caipirinha-morango.webp' },
      { id: 22, nome: 'Caipirinha de Kiwi', preco: 10.00, imagem: 'caipirinha-kiwi.webp' },
      { id: 48, nome: 'Caipirinha baiana', preco: 14.00, imagem: 'baiana.webp' },
      { id: 23, nome: 'Gin tangerina', preco: 13.00, imagem: 'gin-tangerina.webp' },
      { id: 24, nome: 'Gozumel', preco: 12.00, imagem: 'gozumel.webp' },
      { id: 38, nome: 'Gin e tônica', preco: 13.00, imagem: 'gin.webp' },
      { id: 39, nome: 'Mojito', preco: 10.00, imagem: 'moji.webp' },
      { id: 40, nome: 'Lagoa azul', preco: 14.00, imagem: 'lagoa.webp' },
      { id: 49, nome: 'Doce ilusão', preco: 10.00, imagem: 'doce.webp' },
    ],
    "Suco": [
      { id: 25, nome: 'Cajá', preco: 3.00, imagem: 'caja.webp', comLeite: false },
      { id: 26, nome: 'Acerola', preco: 3.00, imagem: 'acerola.webp', comLeite: false },
      { id: 27, nome: 'Goiaba', preco: 3.00, imagem: 'goiaba.webp', comLeite: false },
      { id: 28, nome: 'Caju', preco: 3.00, imagem: 'caju.webp', comLeite: false },
      { id: 29, nome: 'Manga', preco: 3.00, imagem: 'manga.webp', comLeite: false },
      { id: 30, nome: 'Abacaxi', preco: 3.00, imagem: 'abacaxi.webp', comLeite: false },
      { id: 31, nome: 'Maracujá', preco: 3.00, imagem: 'maracuja.webp', comLeite: false },
    ],
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName || telefone) {
      setLoggedIn(true);
      buscarPedidoCliente();
    } else {
      alert('Por favor, insira seu nome ou telefone.');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminLogin.username === 'admin' && adminLogin.password === 'admin123') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert('Usuário ou senha do administrador incorretos!');
    }
  };

  const buscarPedidoCliente = () => {
    const pedidoEncontrado = pedidos.find(
      (pedido) => pedido.nomeCliente === userName && pedido.telefoneCliente === telefone
    );
    if (pedidoEncontrado) {
      setPedidoCliente(pedidoEncontrado);
    } else {
      setPedidoCliente(null);
    }
  };

  const gerarIdPedido = () => {
    return Math.floor(Math.random() * 1000000);
  };

 const handleAdicionarProduto = (produto, comLeite = false) => {
  const precoFinal = comLeite ? 4.00 : produto.preco;
  const produtoExistente = produtosSelecionados.find(
    (p) => p.id === produto.id && p.comLeite === comLeite
  );

  if (produtoExistente) {
    const novosProdutos = produtosSelecionados.map((p) =>
      p.id === produto.id && p.comLeite === comLeite
        ? { ...p, quantidade: p.quantidade + 1 }
        : p
    );
    setProdutosSelecionados(novosProdutos);
  } else {
    setProdutosSelecionados([
      ...produtosSelecionados,
      { ...produto, quantidade: 1, comLeite, preco: precoFinal },
    ]);
  }
};

  const handleRemoverProduto = (produtoId) => {
    const novosProdutos = produtosSelecionados.filter((p) => p.id !== produtoId);
    setProdutosSelecionados(novosProdutos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const id = gerarIdPedido();
      setPedidoId(id);

      const novoPedido = {
        id,
        produtos: produtosSelecionados,
        endereco: retiradaNaLoja ? 'Retirada na Loja' : `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}`,
        pagamento,
        numeroMesa,
        total: produtosSelecionados.reduce((total, p) => total + p.preco * p.quantidade, 0),
        status: 'Em preparo',
        nomeCliente: userName,
        telefoneCliente: telefone,
      };

      adicionarPedido(novoPedido);

      setProdutosSelecionados([]);
      setEndereco({ rua: '', numero: '', bairro: '' });
      setPagamento('');
      setNumeroMesa('');
      setRetiradaNaLoja(false);

      setClientePronto(true);

      const mensagem = `Novo pedido recebido!\n\nID do Pedido: ${id}\nCliente: ${userName}\nTelefone: ${telefone}\nEndereço: ${novoPedido.endereco}\nForma de Pagamento: ${pagamento}\nNúmero da Mesa: ${numeroMesa}\n\nProdutos:\n${produtosSelecionados.map(p => `${p.nome} - Quantidade: ${p.quantidade} - Preço: R$ ${p.preco * p.quantidade}`).join('\n')}\n\nTotal: R$ ${novoPedido.total}`;

      const numeroWhatsapp = '+558396080462';
      const linkWhatsapp = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;

      const a = document.createElement('a');
      a.href = linkWhatsapp;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();

      setTimeout(() => {
        setLoggedIn(false);
        setClientePronto(false);
        setPedidoId('');
        setUserName('');
        setTelefone('');
      }, 10000);

    }, 3000);
  };

  const handleCancelarPedido = () => {
    setLoading(false);
    setPedidoCancelado(true);
    alert('Pedido cancelado com sucesso!');
  };

  useEffect(() => {
    if (tempoCancelamento > 0 && !pedidoCancelado) {
      const timer = setTimeout(() => {
        setTempoCancelamento(tempoCancelamento - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [tempoCancelamento, pedidoCancelado]);

  const handleVerPedido = () => {
    setMostrarPedido(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollButton(true);
        clearTimeout(scrollTimeout);
      } else {
        setShowScrollButton(false);
      }
    };

    let scrollTimeout;
    const handleScrollStop = () => {
      scrollTimeout = setTimeout(() => {
        setShowScrollButton(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollStop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollStop);
    };
  }, []);

  if (!loggedIn && !isAdminLoggedIn) {
    return (
      <div className="login-container">
        <img src="logo.png" alt="Logo da Empresa" className="logo" />
        <h1>Faça seu pedido</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nome"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <button type="submit">Entrar</button>
        </form>

        <button
          className="admin-login-button"
          onClick={() => setShowAdminLogin(true)}
        >
          Acessar como Administrador
        </button>

        {showAdminLogin && (
          <div className="admin-login-form">
            <h2>Login do Administrador</h2>
            <form onSubmit={handleAdminLogin}>
              <input
                type="text"
                placeholder="Usuário"
                value={adminLogin.username}
                onChange={(e) =>
                  setAdminLogin({ ...adminLogin, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Senha"
                value={adminLogin.password}
                onChange={(e) =>
                  setAdminLogin({ ...adminLogin, password: e.target.value })
                }
              />
              <button type="submit">Entrar</button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      {loading && (
        <div className="loading-screen">
          <div className="flame-icon">
            <FaFire />
          </div>
          <p className="loading-text">Enviando pedido...</p>
          <button className="cancel-button" onClick={handleCancelarPedido}>
            Cancelar Pedido
          </button>
        </div>
      )}

      {isAdminLoggedIn ? (
        <Admin />
      ) : (
        <>
          <div className="fixed-menu">
            <div className="menu-content">
              <img src="logo.png" alt="Logo da Empresa" className="logo" />
              <button
                className={`menu-toggle ${menuAberto ? 'open' : ''}`}
                onClick={() => setMenuAberto(!menuAberto)}
              >
                <div className="menu-icon"></div>
              </button>
              <div className={`navegacao-categorias ${menuAberto ? 'active' : ''}`}>
                {Object.keys(cardapio).map((categoria) => (
                  <a
                    key={categoria}
                    href={`#${categoria.replace(/\s+/g, '-').toLowerCase()}`}
                    className="categoria-link"
                    onClick={() => setMenuAberto(false)}
                  >
                    {categoria}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="content">
            {pedidoCliente && (
              <div className="pedido-status">
                <h2>Status do Pedido</h2>
                <p>ID do Pedido: {pedidoCliente.id}</p>
                <p>Status: {pedidoCliente.status}</p>
              </div>
            )}

            {!mostrarPedido ? (
              <div className="cardapio">
                {Object.entries(cardapio).map(([categoria, itens]) => (
                  <div key={categoria} id={categoria.replace(/\s+/g, '-').toLowerCase()} className="categoria">
                    <h2 className="categoria-titulo">{categoria}</h2>
                    <div className="itens-container">
                      {itens.map((item) => {
                        const isSelecionado = produtosSelecionados.some((p) => p.id === item.id);
                        return (
                          <div
                            key={item.id}
                            className={`cardapio-item ${isSelecionado ? 'selecionado' : ''}`}
                          >
                            {item.imagem && <img src={`/images/${item.imagem}`} alt={item.nome} className="item-imagem" />}
                            <h3>{item.nome}</h3>
                            <p>Preço: R$ {item.preco}</p>
                            {categoria === "Suco" && (
                            <div className="suco-opcoes">
                              <button
                                key={`${item.id}-sem-leite`} // Chave única para "Sem Leite"
                                onClick={() => handleAdicionarProduto(item, false)}
                                className={`suco-botao ${
                                  produtosSelecionados.some(
                                    (p) => p.id === item.id && p.comLeite === false
                                  ) ? 'selecionado' : ''
                                }`}
                              >
                                <FaPlus /> Sem Leite (R$ 3.00)
                              </button>
                              <button
                                key={`${item.id}-com-leite`} // Chave única para "Com Leite"
                                onClick={() => handleAdicionarProduto(item, true)}
                                className={`suco-botao ${
                                  produtosSelecionados.some(
                                    (p) => p.id === item.id && p.comLeite === true
                                  ) ? 'selecionado' : ''
                                }`}
                              >
                                <FaPlus /> Com Leite (R$ 4.00)
                              </button>
                            </div>
                          )}
                            {categoria !== "Suco" && (
                              <button
                                onClick={() => handleAdicionarProduto(item)}
                                className={isSelecionado ? 'adicionado' : ''}
                              >
                                {isSelecionado ? <FaMinus /> : <FaPlus />}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="order-summary">
                <h2>Meus Pedidos</h2>
                {cupons.map((cupom) => (
                  <div key={cupom.id} className="cupom-item">
                    <p>ID do Pedido: {cupom.id}</p>
                    <p>Produtos:</p>
                    {cupom.produtos.map((p) => (
                      <p key={p.id}>{p.nome} - Quantidade: {p.quantidade} - Preço: R$ {p.preco * p.quantidade}</p>
                    ))}
                    <p>Total: R$ {cupom.total}</p>
                    <p>Forma de Pagamento: {cupom.pagamento}</p>
                    <p>Número da Mesa: {cupom.numeroMesa}</p>
                    <p>Endereço: {cupom.endereco}</p>
                  </div>
                ))}
                <button onClick={() => setMostrarPedido(false)}>Voltar</button>
              </div>
            )}

            {produtosSelecionados.length > 0 && !mostrarPedido && (
              <div id="detalhes-pedido" className="order-summary">
                <h2>Detalhes do Pedido</h2>
                <div className="produtos-selecionados">
                  {produtosSelecionados.map((produto) => (
                    <div key={produto.id} className="produto-item">
                      <h3>{produto.nome}</h3>
                      <p>Preço: R$ {produto.preco}</p>
                      {produto.comLeite !== undefined && (
                        <p>{produto.comLeite ? 'Com Leite' : 'Sem Leite'}</p>
                      )}
                      <div className="quantidade-container">
                        <label htmlFor={`quantidade-${produto.id}`}>Quantidade:</label>
                        <input
                          type="number"
                          id={`quantidade-${produto.id}`}
                          value={produto.quantidade}
                          onChange={(e) => {
                            const novosProdutos = produtosSelecionados.map((p) =>
                              p.id === produto.id ? { ...p, quantidade: parseInt(e.target.value) } : p
                            );
                            setProdutosSelecionados(novosProdutos);
                          }}
                          min="1"
                        />
                        <button onClick={() => handleRemoverProduto(produto.id)}>Remover</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="input-group">
                  <label className="toggle-label">
                    Retirar na Loja
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        id="retiradaNaLoja"
                        checked={retiradaNaLoja}
                        onChange={(e) => setRetiradaNaLoja(e.target.checked)}
                      />
                      <span className="slider"></span>
                    </div>
                  </label>
                </div>

                {retiradaNaLoja ? (
                  <div className="retirada-na-loja">
                    <p><strong>Endereço da Loja:</strong></p>
                    <p>Rua JOSÉ DUARTE, Nº 355</p>
                    <p>Complemento: POSTO DE GASOLINA</p>
                    <p>Bairro: CENTRO</p>
                    <p>Cidade: Uiraúna - PB</p>
                  </div>
                ) : (
                  <>
                    <div className="input-group">
                      <label htmlFor="rua">Rua:</label>
                      <input
                        type="text"
                        id="rua"
                        value={endereco.rua}
                        onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                        placeholder="Digite a rua"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="numero">Número:</label>
                      <input
                        type="text"
                        id="numero"
                        value={endereco.numero}
                        onChange={(e) => setEndereco({ ...endereco, numero: e.target.value })}
                        placeholder="Digite o número"
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="bairro">Bairro:</label>
                      <input
                        type="text"
                        id="bairro"
                        value={endereco.bairro}
                        onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                        placeholder="Digite o bairro"
                      />
                    </div>
                  </>
                )}
                <div className="input-group">
                  <label htmlFor="pagamento">Forma de Pagamento:</label>
                  <select
                    value={pagamento}
                    onChange={(e) => setPagamento(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    <option value="Cartão de Crédito">Cartão de Crédito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Incluir na conta da mesa">Incluir na conta da mesa</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="numeroMesa">Número da Mesa:</label>
                  <input
                    type="text"
                    id="numeroMesa"
                    value={numeroMesa}
                    onChange={(e) => setNumeroMesa(e.target.value)}
                    placeholder="Número da Mesa"
                  />
                </div>
                <button className="confirm-order" onClick={handleSubmit}>
                  Confirmar Pedido
                </button>
              </div>
            )}

            {pedidoId && !clientePronto && !mostrarPedido && (
              <div className="order-status">
                <p>Seu pedido ID {pedidoId} foi enviado!</p>
                <p>Aguarde enquanto preparamos seu pedido...</p>
                <p>Tempo para cancelar: {Math.floor(tempoCancelamento / 60)}:{tempoCancelamento % 60 < 10 ? `0${tempoCancelamento % 60}` : tempoCancelamento % 60}</p>
                {tempoCancelamento > 0 && !pedidoCancelado && (
                  <button onClick={handleCancelarPedido}>Cancelar Pedido</button>
                )}
                <button onClick={handleVerPedido}>Ver Pedido</button>
              </div>
            )}

            {clientePronto && !mostrarPedido && (
              <div className="order-status">
                <p>Seu pedido ID {pedidoId} Foi enviado para produção! Obrigado!</p>
                <p>Status: {pedidos.find((p) => p.id === pedidoId)?.status || 'Em preparo'}</p>
              </div>
            )}

            {showScrollButton && (
              <button
                className="scroll-to-top-button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
            )}

            {produtosSelecionados.length > 0 && !mostrarPedido && (
              <button
                className="floating-button"
                onClick={() => {
                  document.getElementById('detalhes-pedido').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <i className="fas fa-shopping-cart"></i>
                {produtosSelecionados.length > 0 && (
                  <span className="badge">{produtosSelecionados.length}</span>
                )}
              </button>
            )}

            <footer className="footer">
              <div className="footer-content">
                <div className="footer-section">
                  <h3>Siga-nos</h3>
                  <div className="social-icons">
                    <a
                      href="https://www.instagram.com/postocidadeofc?igsh=MWJ4eHEzcm04ZmM2bg=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="https://www.facebook.com/seufacebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <i className="fab fa-facebook"></i>
                    </a>
                    <a
                      href="https://wa.me/+5583981992258"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <i className="fab fa-whatsapp"></i>
                    </a>
                  </div>
                </div>
                <div className="footer-section">
                  <h3>Contato</h3>
                  <p>
                    <i className="fas fa-map-marker-alt"></i> Rua JOSÉ DUARTE, Nº 355, CENTRO, Uiraúna - PB
                  </p>
                  <p>
                    <i className="fas fa-phone"></i> (83) 98199-2258
                  </p>
                  <p>
                    <i className="fas fa-envelope"></i> postocidade356@gmail.com
                  </p>
                </div>
                <div className="footer-section">
                  <h3>Desenvolvido por</h3>
                  <p>
                    <a
                      href="https://www.instagram.com/luis_fernando_jv__?igsh=MWVnOTExYjIxcDU4aA%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dev-link"
                    >
                      <i className="fas fa-code"></i> Luis Fernando JV
                    </a>
                  </p>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Posto Cidade. Todos os direitos reservados.</p>
              </div>
            </footer>
          </div>
        </>
      )}
    </div>
  );
};

export default App;