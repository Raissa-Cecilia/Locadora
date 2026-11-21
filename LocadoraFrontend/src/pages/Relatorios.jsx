import { useEffect, useState } from "react";
import { apiGet } from "../services/api";
import { alugueisExemplo, clientesExemplo, veiculosExemplo } from "../dados/dadosExemplo";

function Relatorios() {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [veiculosFabricantes, setVeiculosFabricantes] = useState([]);
  const [alugueisCliente, setAlugueisCliente] = useState([]);
  const [clientesComSem, setClientesComSem] = useState([]);
  const [fabricantesQtd, setFabricantesQtd] = useState([]);
  const [alugueisEmAberto, setAlugueisEmAberto] = useState([]);
  const [mensagem, setMensagem] = useState("");

  async function carregarRelatorios(idCliente) {
    try {
      const [listaClientes, vf, cs, fq, aa] = await Promise.all([
        apiGet("/Clientes"),
        apiGet("/Relatorios/veiculos-fabricantes"),
        apiGet("/Relatorios/clientes-com-sem-alugueis"),
        apiGet("/Relatorios/fabricantes-qtd-veiculos"),
        apiGet("/Relatorios/alugueis-em-aberto")
      ]);
      setClientes(listaClientes);
      setVeiculosFabricantes(vf);
      setClientesComSem(cs);
      setFabricantesQtd(fq);
      setAlugueisEmAberto(aa);

      const idParaBuscar = idCliente || (listaClientes[0]?.id ?? "");
      if (idParaBuscar) {
        setClienteId(String(idParaBuscar));
        const ac = await apiGet(`/Relatorios/alugueis-por-cliente/${idParaBuscar}`);
        setAlugueisCliente(ac);
      }
      setMensagem("");
    } catch (erro) {
      setMensagem("Não foi possível carregar os relatórios da API. Exibindo dados fictícios de exemplo.");
      setClientes(clientesExemplo);
      setVeiculosFabricantes(veiculosExemplo.map((v) => ({ modelo: v.modelo, anoFabricacao: v.anoFabricacao, fabricante: v.fabricante })));
      setClientesComSem(clientesExemplo.map((c, i) => ({ cliente: c.nome, dataAluguel: i === 0 ? "2026-11-10" : "2026-11-12" })));
      setFabricantesQtd([
        { fabricante: "Fiat", quantidadeVeiculos: 1 },
        { fabricante: "Volkswagen", quantidadeVeiculos: 1 },
        { fabricante: "Chevrolet", quantidadeVeiculos: 1 }
      ]);
      setAlugueisEmAberto(alugueisExemplo.filter((a) => !a.dataDevolucao).map((a) => ({ cliente: a.cliente, veiculo: a.veiculo, categoria: "Hatch", diasAlugado: 11 })));
      setClienteId("1");
      setAlugueisCliente([{ cliente: "Ana Souza", veiculo: "Uno", dataInicio: "2026-11-10", valorTotal: null }]);
    }
  }

  useEffect(() => {
    carregarRelatorios("");
  }, []);

  async function buscarAlugueisPorCliente(id) {
    setClienteId(id);
    if (!id) {
      setAlugueisCliente([]);
      return;
    }
    try {
      const dados = await apiGet(`/Relatorios/alugueis-por-cliente/${id}`);
      setAlugueisCliente(dados);
    } catch (erro) {
      const nome = clientesExemplo.find((c) => String(c.id) === String(id))?.nome;
      setAlugueisCliente(alugueisExemplo.filter((a) => !nome || a.cliente === nome).map((a) => ({ cliente: a.cliente, veiculo: a.veiculo, dataInicio: a.dataInicio, valorTotal: a.valorTotal })));
    }
  }

  function formatarData(valor) {
    if (!valor) return "-";
    return String(valor).substring(0, 10);
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h2>Relatórios e Consultas</h2>
        <p>Visualizações baseadas nas consultas do banco de dados (rotas de relatório da API).</p>
      </div>

      {mensagem && <div className="alert alert-warning">{mensagem}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card card-indicador h-100">
            <div className="card-body">
              <div className="indicador-legenda">Veículos cadastrados</div>
              <div className="indicador-valor">{veiculosFabricantes.length}</div>
              <div className="text-muted">registros encontrados</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-indicador h-100">
            <div className="card-body">
              <div className="indicador-legenda">Aluguéis em aberto</div>
              <div className="indicador-valor">{alugueisEmAberto.length}</div>
              <div className="text-muted">aguardando devolução</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-indicador h-100">
            <div className="card-body">
              <div className="indicador-legenda">Fabricantes</div>
              <div className="indicador-valor">{fabricantesQtd.length}</div>
              <div className="text-muted">com veículos registrados</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-tabela mb-4">
        <div className="card-header">
          <h5>Veículos com fabricantes (consulta do banco)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead><tr><th>Modelo</th><th>Ano</th><th>Fabricante</th></tr></thead>
              <tbody>
                {veiculosFabricantes.map((item, indice) => (
                  <tr key={indice}>
                    <td>{item.modelo}</td>
                    <td>{item.anoFabricacao}</td>
                    <td>{item.fabricante}</td>
                  </tr>
                ))}
                {veiculosFabricantes.length === 0 && <tr><td colSpan="3" className="text-center py-4">Sem dados.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card card-tabela mb-4">
        <div className="card-header">
          <h5>Aluguéis por cliente (consulta do banco)</h5>
        </div>
        <div className="card-body com-padding">
          <div className="row g-2 mb-3">
            <div className="col-md-5 col-lg-4">
              <label className="form-label">Selecione o cliente</label>
              <select className="form-select" value={clienteId} onChange={(e) => buscarAlugueisPorCliente(e.target.value)}>
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead><tr><th>Cliente</th><th>Veículo</th><th>Data início</th><th>Valor total</th></tr></thead>
              <tbody>
                {alugueisCliente.map((item, indice) => (
                  <tr key={indice}>
                    <td>{item.cliente}</td>
                    <td>{item.veiculo}</td>
                    <td>{formatarData(item.dataInicio)}</td>
                    <td>{item.valorTotal != null ? `R$ ${item.valorTotal}` : "-"}</td>
                  </tr>
                ))}
                {alugueisCliente.length === 0 && <tr><td colSpan="4" className="text-center py-4">Nenhum aluguel encontrado para o cliente.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-6">
          <div className="card card-tabela h-100">
            <div className="card-header">
              <h5>Clientes com/sem aluguéis (consulta do banco)</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead><tr><th>Cliente</th><th>Data do aluguel</th></tr></thead>
                  <tbody>
                    {clientesComSem.map((item, indice) => (
                      <tr key={indice}><td>{item.cliente}</td><td>{formatarData(item.dataAluguel) || item.dataAluguel || "-"}</td></tr>
                    ))}
                    {clientesComSem.length === 0 && <tr><td colSpan="2" className="text-center py-4">Sem dados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card card-tabela h-100">
            <div className="card-header">
              <h5>Fabricantes e quantidade de veículos (consulta do banco)</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead><tr><th>Fabricante</th><th>Quantidade</th></tr></thead>
                  <tbody>
                    {fabricantesQtd.map((item, indice) => (
                      <tr key={indice}><td>{item.fabricante}</td><td>{item.quantidadeVeiculos}</td></tr>
                    ))}
                    {fabricantesQtd.length === 0 && <tr><td colSpan="2" className="text-center py-4">Sem dados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-tabela mb-4">
        <div className="card-header">
          <h5>Aluguéis em aberto (consulta do banco)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead><tr><th>Cliente</th><th>Veículo</th><th>Categoria</th><th>Dias alugado</th></tr></thead>
              <tbody>
                {alugueisEmAberto.map((item, indice) => (
                  <tr key={indice}>
                    <td>{item.cliente}</td>
                    <td>{item.veiculo}</td>
                    <td>{item.categoria}</td>
                    <td>{item.diasAlugado}</td>
                  </tr>
                ))}
                {alugueisEmAberto.length === 0 && <tr><td colSpan="4" className="text-center py-4">Nenhum aluguel em aberto.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
