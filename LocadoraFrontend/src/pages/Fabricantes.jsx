import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";

function Fabricantes() {
  const [fabricantes, setFabricantes] = useState([]);
  const [formulario, setFormulario] = useState({ id: 0, nome: "" });
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroId, setFiltroId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);

  async function carregarFabricantes(nomeBusca = filtroNome, idBusca = filtroId) {
    try {
      const params = new URLSearchParams();
      if (nomeBusca) params.append("nome", nomeBusca);
      if (idBusca) params.append("id", idBusca);
      const texto = params.toString();
      const dados = await apiGet(`/Fabricantes${texto ? `?${texto}` : ""}`);
      setFabricantes(dados);
      setMensagem("");
    } catch (erro) {
      setMensagem("Não foi possível carregar os fabricantes. Verifique se a API está em execução.");
    }
  }

  useEffect(() => {
    carregarFabricantes("", "");
  }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function limparFormulario() {
    setFormulario({ id: 0, nome: "" });
    setEditando(false);
  }

  async function salvarFabricante(evento) {
    evento.preventDefault();
    try {
      if (editando) {
        await apiPut(`/Fabricantes/${formulario.id}`, formulario);
        setMensagem("Fabricante atualizado com sucesso.");
      } else {
        await apiPost("/Fabricantes", { nome: formulario.nome });
        setMensagem("Fabricante cadastrado com sucesso.");
      }
      limparFormulario();
      carregarFabricantes();
    } catch (erro) {
      setMensagem("Erro ao salvar fabricante. Confira os dados informados.");
    }
  }

  function editarFabricante(fabricante) {
    setFormulario({ id: fabricante.id, nome: fabricante.nome || "" });
    setEditando(true);
  }

  async function excluirFabricante(id) {
    const confirmar = window.confirm("Deseja excluir este fabricante?");
    if (!confirmar) return;

    try {
      await apiDelete(`/Fabricantes/${id}`);
      setMensagem("Fabricante excluído com sucesso.");
      carregarFabricantes();
    } catch (erro) {
      setMensagem("Erro ao excluir fabricante. Verifique se existem veículos vinculados.");
    }
  }

  function limparFiltros() {
    setFiltroNome("");
    setFiltroId("");
    carregarFabricantes("", "");
  }

  return (
    <div>
      <h2 className="mb-3">Fabricantes</h2>

      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Pesquisa</h5>
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Filtrar por nome"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <input
                className="form-control"
                type="number"
                placeholder="Filtrar por ID"
                value={filtroId}
                onChange={(e) => setFiltroId(e.target.value)}
              />
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button className="btn btn-primary w-100" onClick={() => carregarFabricantes()}>Pesquisar</button>
              <button className="btn btn-secondary w-100" onClick={limparFiltros}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editando ? "Editar fabricante" : "Cadastrar fabricante"}</h5>
          <form onSubmit={salvarFabricante}>
            <div className="row g-2">
              <div className="col-md-8">
                <input
                  className="form-control"
                  name="nome"
                  placeholder="Nome do fabricante"
                  value={formulario.nome}
                  onChange={atualizarCampo}
                  required
                />
              </div>
              <div className="col-md-4 d-flex gap-2">
                <button className="btn btn-success w-100" type="submit">
                  {editando ? "Salvar" : "Cadastrar"}
                </button>
                {editando && (
                  <button className="btn btn-outline-secondary w-100" type="button" onClick={limparFormulario}>
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fabricantes.map((fabricante) => (
              <tr key={fabricante.id}>
                <td>{fabricante.id}</td>
                <td>{fabricante.nome}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => editarFabricante(fabricante)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => excluirFabricante(fabricante.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {fabricantes.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center">Nenhum fabricante encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fabricantes;
