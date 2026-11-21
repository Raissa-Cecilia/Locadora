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
      <div className="cabecalho-pagina">
        <h2>Fabricantes</h2>
        <p>Cadastro, edição, exclusão e pesquisa de fabricantes por nome e ID.</p>
      </div>

      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <div className="row g-3 mb-4">
        <div className="col-lg-5">
          <div className="card card-form h-100">
            <div className="card-body">
              <h5 className="card-title">Pesquisa</h5>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  className="form-control"
                  placeholder="Filtrar por nome"
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">ID</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Filtrar por ID"
                  value={filtroId}
                  onChange={(e) => setFiltroId(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => carregarFabricantes()}>Pesquisar</button>
                <button className="btn btn-secondary" onClick={limparFiltros}>Limpar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card card-form h-100">
            <div className="card-body">
              <h5 className="card-title">{editando ? "Editar fabricante" : "Cadastrar fabricante"}</h5>
              <form onSubmit={salvarFabricante}>
                <div className="mb-3">
                  <label className="form-label">Nome do fabricante</label>
                  <input
                    className="form-control"
                    name="nome"
                    placeholder="Nome do fabricante"
                    value={formulario.nome}
                    onChange={atualizarCampo}
                    required
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-success" type="submit">
                    {editando ? "Salvar" : "Cadastrar"}
                  </button>
                  {editando && (
                    <button className="btn btn-outline-secondary" type="button" onClick={limparFormulario}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-tabela">
        <div className="card-header">
          <h5>Fabricantes cadastrados</h5>
        </div>
        <div className="card-body">
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
                    <td colSpan="3" className="text-center py-4">Nenhum fabricante encontrado.</td>
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

export default Fabricantes;
