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
      <h2 className="mb-3">Categorias</h2>

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
              <button className="btn btn-primary w-100" onClick={() => carregarCategorias()}>Pesquisar</button>
              <button className="btn btn-secondary w-100" onClick={limparFiltros}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editando ? "Editar categoria" : "Cadastrar categoria"}</h5>
          <form onSubmit={salvarCategoria}>
            <div className="row g-2">
              <div className="col-md-8">
                <input
                  className="form-control"
                  name="nome"
                  placeholder="Nome da categoria"
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
                <td colSpan="3" className="text-center">Nenhuma categoria encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categorias;
