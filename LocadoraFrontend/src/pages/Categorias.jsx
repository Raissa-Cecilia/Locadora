import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [formulario, setFormulario] = useState({ id: 0, nome: "" });
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroId, setFiltroId] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);

  async function carregarCategorias(nomeBusca = filtroNome, idBusca = filtroId) {
    try {
      const params = new URLSearchParams();
      if (nomeBusca) params.append("nome", nomeBusca);
      if (idBusca) params.append("id", idBusca);
      const texto = params.toString();
      const dados = await apiGet(`/Categorias${texto ? `?${texto}` : ""}`);
      setCategorias(dados);
      setMensagem("");
    } catch (erro) {
      setMensagem("Não foi possível carregar as categorias. Verifique se a API está em execução.");
    }
  }

  useEffect(() => {
    carregarCategorias("", "");
  }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function limparFormulario() {
    setFormulario({ id: 0, nome: "" });
    setEditando(false);
  }

  async function salvarCategoria(evento) {
    evento.preventDefault();
    try {
      if (editando) {
        await apiPut(`/Categorias/${formulario.id}`, formulario);
        setMensagem("Categoria atualizada com sucesso.");
      } else {
        await apiPost("/Categorias", { nome: formulario.nome });
        setMensagem("Categoria cadastrada com sucesso.");
      }
      limparFormulario();
      carregarCategorias();
    } catch (erro) {
      setMensagem("Erro ao salvar categoria. Confira os dados informados.");
    }
  }

  function editarCategoria(categoria) {
    setFormulario({ id: categoria.id, nome: categoria.nome || "" });
    setEditando(true);
  }

  async function excluirCategoria(id) {
    const confirmar = window.confirm("Deseja excluir esta categoria?");
    if (!confirmar) return;

    try {
      await apiDelete(`/Categorias/${id}`);
      setMensagem("Categoria excluída com sucesso.");
      carregarCategorias();
    } catch (erro) {
      setMensagem("Erro ao excluir categoria. Verifique se existem veículos vinculados.");
    }
  }

  function limparFiltros() {
    setFiltroNome("");
    setFiltroId("");
    carregarCategorias("", "");
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h2>Categorias</h2>
        <p>Cadastro, edição, exclusão e pesquisa de categorias por nome e ID.</p>
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
                <button className="btn btn-primary" onClick={() => carregarCategorias()}>Pesquisar</button>
                <button className="btn btn-secondary" onClick={limparFiltros}>Limpar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card card-form h-100">
            <div className="card-body">
              <h5 className="card-title">{editando ? "Editar categoria" : "Cadastrar categoria"}</h5>
              <form onSubmit={salvarCategoria}>
                <div className="mb-3">
                  <label className="form-label">Nome da categoria</label>
                  <input
                    className="form-control"
                    name="nome"
                    placeholder="Nome da categoria"
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
          <h5>Categorias cadastradas</h5>
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
                {categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>{categoria.id}</td>
                    <td>{categoria.nome}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editarCategoria(categoria)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => excluirCategoria(categoria.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {categorias.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4">Nenhuma categoria encontrada.</td>
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

export default Categorias;
