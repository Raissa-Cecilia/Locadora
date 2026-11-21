import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { clientesExemplo } from "../dados/dadosExemplo";

function lerSaldos() {
  const salvo = localStorage.getItem("saldosClientes");
  if (salvo) {
    return JSON.parse(salvo);
  }
  const inicial = {};
  clientesExemplo.forEach((c) => {
    inicial[c.id] = c.saldo;
  });
  localStorage.setItem("saldosClientes", JSON.stringify(inicial));
  return inicial;
}

function lerPagamentos() {
  const salvo = localStorage.getItem("pagamentosAlugueis");
  if (salvo) {
    return JSON.parse(salvo);
  }
  return [];
}

function Carteira() {
  const [clientes, setClientes] = useState([]);
  const [alugueis, setAlugueis] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [valorRecarga, setValorRecarga] = useState("");
  const [saldos, setSaldos] = useState({});
  const [pagamentos, setPagamentos] = useState([]);
  const [mensagem, setMensagem] = useState("");

  async function carregarDados() {
    try {
      const [listaClientes, listaAlugueis] = await Promise.all([
        apiGet("/Clientes"),
        apiGet("/Alugueis")
      ]);
      setClientes(listaClientes);
      setAlugueis(listaAlugueis);
    } catch (erro) {
      setMensagem("Não foi possível carregar dados da API. Exibindo opções de exemplo para demonstração.");
      setClientes(clientesExemplo.map((c) => ({ id: c.id, nome: c.nome, cpf: c.cpf, email: c.email })));
    }
  }

  useEffect(() => {
    setSaldos(lerSaldos());
    setPagamentos(lerPagamentos());
    carregarDados();
  }, []);

  function salvarSaldos(novosSaldos) {
    setSaldos(novosSaldos);
    localStorage.setItem("saldosClientes", JSON.stringify(novosSaldos));
  }

  function salvarPagamentos(novosPagamentos) {
    setPagamentos(novosPagamentos);
    localStorage.setItem("pagamentosAlugueis", JSON.stringify(novosPagamentos));
  }

  function obterSaldo(idCliente) {
    if (!idCliente) return 0;
    return Number(saldos[idCliente] || 0);
  }

  function recarregarSaldo() {
    if (!clienteSelecionado) {
      setMensagem("Selecione um cliente para recarregar.");
      return;
    }
    const valor = Number(valorRecarga);
    if (!valor || valor <= 0) {
      setMensagem("Informe um valor de recarga válido.");
      return;
    }
    const saldoAtual = obterSaldo(clienteSelecionado);
    const novosSaldos = { ...saldos, [clienteSelecionado]: saldoAtual + valor };
    salvarSaldos(novosSaldos);
    setValorRecarga("");
    setMensagem("Recarga realizada com sucesso.");
  }

  function pagarAluguel(aluguel) {
    if (!clienteSelecionado) {
      setMensagem("Selecione um cliente para realizar o pagamento.");
      return;
    }
    if (pagamentos.includes(aluguel.id)) {
      setMensagem("Este aluguel já foi pago.");
      return;
    }
    const valor = Number(aluguel.valorTotal || 0);
    if (valor <= 0) {
      setMensagem("Este aluguel não possui valor total para pagamento.");
      return;
    }
    const saldoAtual = obterSaldo(clienteSelecionado);
    if (saldoAtual < valor) {
      setMensagem("Saldo insuficiente. Faça uma recarga para concluir o pagamento.");
      return;
    }
    const novosSaldos = { ...saldos, [clienteSelecionado]: saldoAtual - valor };
    salvarSaldos(novosSaldos);
    salvarPagamentos([...pagamentos, aluguel.id]);
    setMensagem("Pagamento realizado com sucesso.");
  }

  const alugueisDoCliente = alugueis.filter(
    (a) => String(a.clienteId) === String(clienteSelecionado)
  );

  return (
    <div>
      <h2 className="mb-3">Carteira e Pagamentos</h2>

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
                R$ {clienteSelecionado ? obterSaldo(clienteSelecionado).toFixed(2) : "0.00"}
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
                  const pago = pagamentos.includes(aluguel.id);
                  return (
                    <tr key={aluguel.id}>
                      <td>{aluguel.id}</td>
                      <td>{aluguel.veiculo?.modelo || aluguel.veiculoId}</td>
                      <td>{String(aluguel.dataInicio || "").substring(0, 10)}</td>
                      <td>{aluguel.dataDevolucao ? String(aluguel.dataDevolucao).substring(0, 10) : "-"}</td>
                      <td>{aluguel.valorTotal != null ? `R$ ${Number(aluguel.valorTotal).toFixed(2)}` : "-"}</td>
                      <td>{pago ? "Pago" : (aluguel.valorTotal != null ? "Pendente" : "Aguardando devolução")}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => pagarAluguel(aluguel)}
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
