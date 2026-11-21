import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState({ id: 0, nome: "", cpf: "", email: "" });
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroCpf, setFiltroCpf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);

  async function carregarClientes(nomeBusca = filtroNome, cpfBusca = filtroCpf) {
    try {
      const params = new URLSearchParams();
      if (nomeBusca) params.append("nome", nomeBusca);
      if (cpfBusca) params.append("cpf", cpfBusca);
      const texto = params.toString();
      const dados = await apiGet(`/Clientes${texto ? `?${texto}` : ""}`);
      setClientes(dados);
      setMensagem("");
    } catch (erro) {
      setMensagem("Não foi possível carregar os clientes. Verifique se a API está em execução.");
    }
  }

  useEffect(() => {
    carregarClientes("", "");
  }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function limparFormulario() {
    setFormulario({ id: 0, nome: "", cpf: "", email: "" });
    setEditando(false);
  }

  async function salvarCliente(evento) {
    evento.preventDefault();
    try {
      if (editando) {
        await apiPut(`/Clientes/${formulario.id}`, formulario);
        setMensagem("Cliente atualizado com sucesso.");
      } else {
        await apiPost("/Clientes", {
          nome: formulario.nome,
          cpf: formulario.cpf,
          email: formulario.email
        });
        setMensagem("Cliente cadastrado com sucesso.");
      }
      limparFormulario();
      carregarClientes();
    } catch (erro) {
      setMensagem("Erro ao salvar cliente. Confira os dados informados.");
    }
  }

  function editarCliente(cliente) {
    setFormulario({
      id: cliente.id,
      nome: cliente.nome || "",
      cpf: cliente.cpf || "",
      email: cliente.email || ""
    });
    setEditando(true);
  }

  async function excluirCliente(id) {
    const confirmar = window.confirm("Deseja excluir este cliente?");
    if (!confirmar) return;

    try {
      await apiDelete(`/Clientes/${id}`);
      setMensagem("Cliente excluído com sucesso.");
      carregarClientes();
    } catch (erro) {
      setMensagem("Erro ao excluir cliente. Verifique se ele possui aluguéis vinculados.");
    }
  }

  function limparFiltros() {
    setFiltroNome("");
    setFiltroCpf("");
    carregarClientes("", "");
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h2>Clientes</h2>
        <p>Cadastro, edição, exclusão e pesquisa de clientes por nome e CPF.</p>
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
                <label className="form-label">CPF</label>
                <input
                  className="form-control"
                  placeholder="Filtrar por CPF"
                  value={filtroCpf}
                  onChange={(e) => setFiltroCpf(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => carregarClientes()}>Pesquisar</button>
                <button className="btn btn-secondary" onClick={limparFiltros}>Limpar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card card-form h-100">
            <div className="card-body">
              <h5 className="card-title">{editando ? "Editar cliente" : "Cadastrar cliente"}</h5>
              <form onSubmit={salvarCliente}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nome</label>
                    <input
                      className="form-control"
                      name="nome"
                      placeholder="Nome do cliente"
                      value={formulario.nome}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">CPF</label>
                    <input
                      className="form-control"
                      name="cpf"
                      placeholder="CPF (11 dígitos)"
                      value={formulario.cpf}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">E-mail</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      placeholder="E-mail"
                      value={formulario.email}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-success" type="submit">
                      {editando ? "Salvar" : "Cadastrar"}
                    </button>
                    {editando && (
                      <button className="btn btn-outline-secondary" type="button" onClick={limparFormulario}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-tabela">
        <div className="card-header">
          <h5>Clientes cadastrados</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CPF</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.cpf}</td>
                    <td>{cliente.email}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editarCliente(cliente)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => excluirCliente(cliente.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">Nenhum cliente encontrado.</td>
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

export default Clientes;
