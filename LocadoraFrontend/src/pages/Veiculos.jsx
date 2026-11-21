import { useEffect, useState } from "react";
import { apiDelete, apiGet, apiPost, apiPut } from "../services/api";

function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formulario, setFormulario] = useState({
    id: 0,
    modelo: "",
    anoFabricacao: "",
    quilometragem: "",
    fabricanteId: "",
    categoriaId: ""
  });
  const [filtroModelo, setFiltroModelo] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(false);

  async function carregarListas() {
    try {
      const listaFabricantes = await apiGet("/Fabricantes");
      const listaCategorias = await apiGet("/Categorias");
      setFabricantes(listaFabricantes);
      setCategorias(listaCategorias);
    } catch (erro) {
      setMensagem("Erro ao carregar fabricantes e categorias.");
    }
  }

  async function carregarVeiculos(modeloBusca = filtroModelo, anoBusca = filtroAno) {
    try {
      const params = new URLSearchParams();
      if (modeloBusca) params.append("modelo", modeloBusca);
      if (anoBusca) params.append("anoFabricacao", anoBusca);
      const texto = params.toString();
      const dados = await apiGet(`/Veiculos${texto ? `?${texto}` : ""}`);
      setVeiculos(dados);
      setMensagem("");
    } catch (erro) {
      setMensagem("Não foi possível carregar os veículos. Verifique se a API está em execução.");
    }
  }

  useEffect(() => {
    carregarListas();
    carregarVeiculos("", "");
  }, []);

  function atualizarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function limparFormulario() {
    setFormulario({
      id: 0,
      modelo: "",
      anoFabricacao: "",
      quilometragem: "",
      fabricanteId: "",
      categoriaId: ""
    });
    setEditando(false);
  }

  async function salvarVeiculo(evento) {
    evento.preventDefault();
    const dadosVeiculo = {
      id: formulario.id,
      modelo: formulario.modelo,
      anoFabricacao: Number(formulario.anoFabricacao),
      quilometragem: Number(formulario.quilometragem),
      fabricanteId: Number(formulario.fabricanteId),
      categoriaId: Number(formulario.categoriaId)
    };

    try {
      if (editando) {
        await apiPut(`/Veiculos/${formulario.id}`, dadosVeiculo);
        setMensagem("Veículo atualizado com sucesso.");
      } else {
        await apiPost("/Veiculos", {
          modelo: dadosVeiculo.modelo,
          anoFabricacao: dadosVeiculo.anoFabricacao,
          quilometragem: dadosVeiculo.quilometragem,
          fabricanteId: dadosVeiculo.fabricanteId,
          categoriaId: dadosVeiculo.categoriaId
        });
        setMensagem("Veículo cadastrado com sucesso.");
      }
      limparFormulario();
      carregarVeiculos();
    } catch (erro) {
      setMensagem("Erro ao salvar veículo. Confira os dados e as seleções.");
    }
  }

  function editarVeiculo(veiculo) {
    setFormulario({
      id: veiculo.id,
      modelo: veiculo.modelo || "",
      anoFabricacao: veiculo.anoFabricacao || "",
      quilometragem: veiculo.quilometragem ?? "",
      fabricanteId: veiculo.fabricanteId || veiculo.fabricante?.id || "",
      categoriaId: veiculo.categoriaId || veiculo.categoria?.id || ""
    });
    setEditando(true);
  }

  async function excluirVeiculo(id) {
    const confirmar = window.confirm("Deseja excluir este veículo?");
    if (!confirmar) return;

    try {
      await apiDelete(`/Veiculos/${id}`);
      setMensagem("Veículo excluído com sucesso.");
      carregarVeiculos();
    } catch (erro) {
      setMensagem("Erro ao excluir veículo. Verifique se ele possui aluguéis vinculados.");
    }
  }

  function limparFiltros() {
    setFiltroModelo("");
    setFiltroAno("");
    carregarVeiculos("", "");
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h2>Veículos</h2>
        <p>Cadastro, edição, exclusão e pesquisa de veículos por modelo e ano de fabricação.</p>
      </div>

      {mensagem && <div className="alert alert-info">{mensagem}</div>}

      <div className="row g-3 mb-4">
        <div className="col-lg-5">
          <div className="card card-form h-100">
            <div className="card-body">
              <h5 className="card-title">Pesquisa</h5>
              <div className="mb-3">
                <label className="form-label">Modelo</label>
                <input
                  className="form-control"
                  placeholder="Filtrar por modelo"
                  value={filtroModelo}
                  onChange={(e) => setFiltroModelo(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ano de fabricação</label>
                <input
                  className="form-control"
                  type="number"
                  placeholder="Filtrar por ano"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={() => carregarVeiculos()}>Pesquisar</button>
                <button className="btn btn-secondary" onClick={limparFiltros}>Limpar</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card card-form h-100">
            <div className="card-body">
              <h5 className="card-title">{editando ? "Editar veículo" : "Cadastrar veículo"}</h5>
              <form onSubmit={salvarVeiculo}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Modelo</label>
                    <input
                      className="form-control"
                      name="modelo"
                      placeholder="Modelo"
                      value={formulario.modelo}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Ano</label>
                    <input
                      className="form-control"
                      type="number"
                      name="anoFabricacao"
                      placeholder="Ano"
                      value={formulario.anoFabricacao}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Km</label>
                    <input
                      className="form-control"
                      type="number"
                      name="quilometragem"
                      placeholder="Quilometragem"
                      value={formulario.quilometragem}
                      onChange={atualizarCampo}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fabricante</label>
                    <select
                      className="form-select"
                      name="fabricanteId"
                      value={formulario.fabricanteId}
                      onChange={atualizarCampo}
                      required
                    >
                      <option value="">Selecione o fabricante</option>
                      {fabricantes.map((f) => (
                        <option key={f.id} value={f.id}>{f.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Categoria</label>
                    <select
                      className="form-select"
                      name="categoriaId"
                      value={formulario.categoriaId}
                      onChange={atualizarCampo}
                      required
                    >
                      <option value="">Selecione a categoria</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 d-flex gap-2">
                    <button className="btn btn-success" type="submit">{editando ? "Salvar" : "Cadastrar"}</button>
                    {editando && (
                      <button className="btn btn-outline-secondary" type="button" onClick={limparFormulario}>Cancelar</button>
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
          <h5>Veículos cadastrados</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Km</th>
                  <th>Fabricante</th>
                  <th>Categoria</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((veiculo) => (
                  <tr key={veiculo.id}>
                    <td>{veiculo.id}</td>
                    <td>{veiculo.modelo}</td>
                    <td>{veiculo.anoFabricacao}</td>
                    <td>{veiculo.quilometragem}</td>
                    <td>{veiculo.fabricante?.nome || veiculo.fabricanteId}</td>
                    <td>{veiculo.categoria?.nome || veiculo.categoriaId}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => editarVeiculo(veiculo)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => excluirVeiculo(veiculo.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {veiculos.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">Nenhum veículo encontrado.</td>
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

export default Veiculos;
