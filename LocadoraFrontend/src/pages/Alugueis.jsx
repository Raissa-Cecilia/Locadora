import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";

function Alugueis() {
  const [alugueis, setAlugueis] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [formulario, setFormulario] = useState({
    clienteId: "",
    veiculoId: "",
    dataInicio: "",
    quilometragemInicial: "",
    valorDiaria: ""
  });
  const [devolucao, setDevolucao] = useState({
    id: null,
    dataDevolucao: "",
    quilometragemFinal: ""
  });
  const [filtroCliente, setFiltroCliente] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState("todos");
  const [mensagem, setMensagem] = useState("");

  async function carregarDados() {
    try {
      const [listaClientes, listaVeiculos] = await Promise.all([
        apiGet("/Clientes"),
        apiGet("/Veiculos")
      ]);
      setClientes(listaClientes);
      setVeiculos(listaVeiculos);
    } catch (erro) {
      setMensagem("Erro ao carregar clientes e veículos.");
    }
  }

  async function carregarAlugueis(clienteBusca = filtroCliente, situacaoBusca = filtroSituacao) {
    try {
      const params = new URLSearchParams();
      if (clienteBusca) params.append("cliente", clienteBusca);
      if (situacaoBusca) params.append("situacao", situacaoBusca);
      const texto = params.toString();
      const dados = await apiGet(`/Alugueis${texto ? `?${texto}` : ""}`);
      setAlugueis(dados);
      setMensagem("");
    } catch (erro) {
      setMensagem("Não foi possível carregar os aluguéis. Verifique se a API está em execução.");
    }
  }

  useEffect(() => {
    carregarDados();
    carregarAlugueis("", "todos");
  }, []);

  function atualizarFormulario(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function atualizarDevolucao(evento) {
    const { name, value } = evento.target;
    setDevolucao({ ...devolucao, [name]: value });
  }

  async function registrarAluguel(evento) {
    evento.preventDefault();
    try {
      await apiPost("/Alugueis", {
        clienteId: Number(formulario.clienteId),
        veiculoId: Number(formulario.veiculoId),
        dataInicio: formulario.dataInicio,
        quilometragemInicial: Number(formulario.quilometragemInicial),
        valorDiaria: Number(formulario.valorDiaria)
      });
      setMensagem("Aluguel registrado com sucesso.");
      setFormulario({
        clienteId: "",
        veiculoId: "",
        dataInicio: "",
        quilometragemInicial: "",
        valorDiaria: ""
      });
      carregarAlugueis();
    } catch (erro) {
      setMensagem("Erro ao registrar aluguel. Confira os dados informados.");
    }
  }

  function prepararDevolucao(aluguel) {
    setDevolucao({
      id: aluguel.id,
      dataDevolucao: "",
      quilometragemFinal: ""
    });
  }

  async function confirmarDevolucao(evento) {
    evento.preventDefault();
    const aluguelSelecionado = alugueis.find((a) => a.id === devolucao.id);
    if (!aluguelSelecionado) return;

    try {
      await apiPut(`/Alugueis/${devolucao.id}`, {
        id: aluguelSelecionado.id,
        clienteId: aluguelSelecionado.clienteId,
        veiculoId: aluguelSelecionado.veiculoId,
        dataInicio: aluguelSelecionado.dataInicio,
        dataDevolucao: devolucao.dataDevolucao,
        quilometragemInicial: aluguelSelecionado.quilometragemInicial,
        quilometragemFinal: Number(devolucao.quilometragemFinal),
        valorDiaria: aluguelSelecionado.valorDiaria,
        valorTotal: aluguelSelecionado.valorTotal
      });
      setMensagem("Devolução registrada com sucesso.");
      setDevolucao({ id: null, dataDevolucao: "", quilometragemFinal: "" });
      carregarAlugueis();
    } catch (erro) {
      setMensagem("Erro ao registrar devolução. Verifique as informações.");
    }
  }

  async function excluirAluguel(id) {
    const confirmar = window.confirm("Deseja excluir este aluguel?");
    if (!confirmar) return;

    try {
      await apiDelete(`/Alugueis/${id}`);
      setMensagem("Aluguel excluído com sucesso.");
      carregarAlugueis();
    } catch (erro) {
      setMensagem("Erro ao excluir aluguel.");
    }
  }

  function limparFiltros() {
    setFiltroCliente("");
    setFiltroSituacao("todos");
    carregarAlugueis("", "todos");
  }

  function formatarData(valor) {
    if (!valor) return "-";
    return String(valor).substring(0, 10);
  }

  return (
    <div>
      <h2 className="mb-3">Aluguéis</h2>

      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Pesquisa</h5>
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Filtrar por nome do cliente"
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtroSituacao}
                onChange={(e) => setFiltroSituacao(e.target.value)}
              >
                <option value="todos">Todas as situações</option>
                <option value="aberto">Em aberto</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary w-100" onClick={() => carregarAlugueis()}>Pesquisar</button>
              <button className="btn btn-secondary w-100" onClick={limparFiltros}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Registrar novo aluguel</h5>
          <form onSubmit={registrarAluguel}>
            <div className="row g-2">
              <div className="col-md-3">
                <select className="form-select" name="clienteId" value={formulario.clienteId} onChange={atualizarFormulario} required>
                  <option value="">Cliente</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select" name="veiculoId" value={formulario.veiculoId} onChange={atualizarFormulario} required>
                  <option value="">Veículo</option>
                  {veiculos.map((v) => <option key={v.id} value={v.id}>{v.modelo}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <input className="form-control" type="date" name="dataInicio" value={formulario.dataInicio} onChange={atualizarFormulario} required />
              </div>
              <div className="col-md-2">
                <input className="form-control" type="number" name="quilometragemInicial" placeholder="Km inicial" value={formulario.quilometragemInicial} onChange={atualizarFormulario} required />
              </div>
              <div className="col-md-1">
                <input className="form-control" type="number" step="0.01" name="valorDiaria" placeholder="Diária" value={formulario.valorDiaria} onChange={atualizarFormulario} required />
              </div>
              <div className="col-md-1">
                <button className="btn btn-success w-100" type="submit">Salvar</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {devolucao.id && (
        <div className="card mb-4 border-warning">
          <div className="card-body">
            <h5 className="card-title">Registrar devolução (aluguel #{devolucao.id})</h5>
            <form onSubmit={confirmarDevolucao}>
              <div className="row g-2">
                <div className="col-md-4">
                  <input className="form-control" type="date" name="dataDevolucao" value={devolucao.dataDevolucao} onChange={atualizarDevolucao} required />
                </div>
                <div className="col-md-4">
                  <input className="form-control" type="number" name="quilometragemFinal" placeholder="Km final" value={devolucao.quilometragemFinal} onChange={atualizarDevolucao} required />
                </div>
                <div className="col-md-4 d-flex gap-2">
                  <button className="btn btn-warning w-100" type="submit">Confirmar devolução</button>
                  <button className="btn btn-outline-secondary w-100" type="button" onClick={() => setDevolucao({ id: null, dataDevolucao: "", quilometragemFinal: "" })}>Cancelar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Veículo</th>
              <th>Início</th>
              <th>Devolução</th>
              <th>Valor diária</th>
              <th>Valor total</th>
              <th>Situação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alugueis.map((aluguel) => (
              <tr key={aluguel.id}>
                <td>{aluguel.id}</td>
                <td>{aluguel.cliente?.nome || aluguel.clienteId}</td>
                <td>{aluguel.veiculo?.modelo || aluguel.veiculoId}</td>
                <td>{formatarData(aluguel.dataInicio)}</td>
                <td>{formatarData(aluguel.dataDevolucao)}</td>
                <td>R$ {aluguel.valorDiaria}</td>
                <td>{aluguel.valorTotal != null ? `R$ ${aluguel.valorTotal}` : "-"}</td>
                <td>{aluguel.dataDevolucao ? "Finalizado" : "Em aberto"}</td>
                <td>
                  {!aluguel.dataDevolucao && (
                    <button className="btn btn-sm btn-warning me-2" onClick={() => prepararDevolucao(aluguel)}>Devolver</button>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={() => excluirAluguel(aluguel.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {alugueis.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center">Nenhum aluguel encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Alugueis;
