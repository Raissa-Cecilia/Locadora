import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../services/api";

function Carteira() {
  const [clientes, setClientes] = useState([]);
  const [alugueis, setAlugueis] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [valorRecarga, setValorRecarga] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function carregarClientes() {
    try {
      const listaClientes = await apiGet("/Clientes");
      setClientes(listaClientes);
      return listaClientes;
    } catch (erro) {
      setMensagem("Não foi possível carregar os clientes. Verifique se a API está em execução e o banco atualizado.");
      return [];
    }
  }

  async function carregarAlugueis() {
    try {
      const listaAlugueis = await apiGet("/Alugueis");
      setAlugueis(listaAlugueis);
    } catch (erro) {
      setMensagem("Não foi possível carregar os aluguéis. Verifique se a API está em execução e o banco atualizado.");
    }
  }

  async function carregarDados() {
    const listaClientes = await carregarClientes();
    await carregarAlugueis();
    if (!clienteSelecionado && listaClientes.length > 0) {
      setClienteSelecionado(String(listaClientes[0].id));
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const clienteAtual = clientes.find((c) => String(c.id) === String(clienteSelecionado));
  const saldoAtual = clienteAtual ? Number(clienteAtual.saldo || 0) : 0;
  const alugueisDoCliente = alugueis.filter((a) => String(a.clienteId) === String(clienteSelecionado));

  async function recarregarSaldo() {
    if (!clienteSelecionado) {
      setMensagem("Selecione um cliente para recarregar.");
      return;
    }
    const valor = Number(valorRecarga);
    if (!valor || valor <= 0) {
      setMensagem("Informe um valor de recarga válido.");
      return;
    }

    try {
      await apiPost("/Carteira/recarga", {
        clienteId: Number(clienteSelecionado),
        valor: valor
      });
      setValorRecarga("");
      setMensagem("Recarga realizada com sucesso.");
      await carregarClientes();
    } catch (erro) {
      setMensagem("Erro ao recarregar saldo. Verifique se o banco foi atualizado com a migration da carteira.");
    }
  }

  async function pagarAluguel(aluguelId) {
    if (!clienteSelecionado) {
      setMensagem("Selecione um cliente para realizar o pagamento.");
      return;
    }

    try {
      await apiPost("/Carteira/pagamento", {
        clienteId: Number(clienteSelecionado),
        aluguelId: Number(aluguelId)
      });
      setMensagem("Pagamento realizado com sucesso.");
      await carregarClientes();
      await carregarAlugueis();
    } catch (erro) {
      setMensagem("Erro ao realizar pagamento. Verifique o saldo, o valor do aluguel e se o banco foi atualizado.");
    }
  }

  function formatarData(valor) {
    if (!valor) return "-";
    return String(valor).substring(0, 10);
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h2>Carteira e Pagamentos</h2>
        <p>Consulta de saldo, recarga e pagamento de aluguéis com os dados salvos no banco.</p>
      </div>

      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Consulta de saldo e recarga</h5>
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Cliente</label>
              <select
                className="form-select"
                value={clienteSelecionado}
                onChange={(e) => setClienteSelecionado(e.target.value)}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Saldo atual</label>
              <div className="form-control bg-light">
                R$ {saldoAtual.toFixed(2)}
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Valor da recarga</label>
              <input
                className="form-control"
                type="number"
                step="0.01"
                placeholder="Ex: 100"
                value={valorRecarga}
                onChange={(e) => setValorRecarga(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100" onClick={recarregarSaldo}>Recarregar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Pagamento de aluguéis</h5>
          <p className="text-muted">Selecione um cliente para ver os aluguéis e realizar o pagamento com o saldo disponível.</p>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Veículo</th>
                  <th>Início</th>
                  <th>Devolução</th>
                  <th>Valor total</th>
                  <th>Situação do pagamento</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {alugueisDoCliente.map((aluguel) => {
                  const pago = Boolean(aluguel.pago);
                  return (
                    <tr key={aluguel.id}>
                      <td>{aluguel.id}</td>
                      <td>{aluguel.veiculo?.modelo || aluguel.veiculoId}</td>
                      <td>{formatarData(aluguel.dataInicio)}</td>
                      <td>{aluguel.dataDevolucao ? formatarData(aluguel.dataDevolucao) : "-"}</td>
                      <td>{aluguel.valorTotal != null ? `R$ ${Number(aluguel.valorTotal).toFixed(2)}` : "-"}</td>
                      <td>{pago ? "Pago" : (aluguel.valorTotal != null ? "Pendente" : "Aguardando devolução")}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => pagarAluguel(aluguel.id)}
                          disabled={pago || aluguel.valorTotal == null}
                        >
                          Pagar
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {clienteSelecionado && alugueisDoCliente.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center">Nenhum aluguel encontrado para este cliente.</td>
                  </tr>
                )}
                {!clienteSelecionado && (
                  <tr>
                    <td colSpan="7" className="text-center">Selecione um cliente para consultar os aluguéis.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carteira;
