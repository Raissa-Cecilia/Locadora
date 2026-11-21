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
      <h2 className="mb-3">Relatórios e Consultas</h2>
      <p className="text-muted">Visualizações baseadas nas consultas do banco de dados (rotas de relatório da API).</p>

      {mensagem && <div className="alert alert-warning">{mensagem}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Veículos cadastrados</h5>
              <p className="display-6 mb-0">{veiculosFabricantes.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Aluguéis em aberto</h5>
              <p className="display-6 mb-0">{alugueisEmAberto.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Fabricantes</h5>
              <p className="display-6 mb-0">{fabricantesQtd.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Veículos com fabricantes (consulta do banco)</h5>
          <div className="table-responsive">
            <table className="table table-sm table-striped">
              <thead><tr><th>Modelo</th><th>Ano</th><th>Fabricante</th></tr></thead>
              <tbody>
                {veiculosFabricantes.map((item, indice) => (
                  <tr key={indice}>
                    <td>{item.modelo}</td>
                    <td>{item.anoFabricacao}</td>
                    <td>{item.fabricante}</td>
                  </tr>
                ))}
                {veiculosFabricantes.length === 0 && <tr><td colSpan="3" className="text-center">Sem dados.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Aluguéis por cliente (consulta do banco)</h5>
          <div className="row g-2 mb-3">
            <div className="col-md-4">
              <select className="form-select" value={clienteId} onChange={(e) => buscarAlugueisPorCliente(e.target.value)}>
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm table-striped">
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
                {alugueisCliente.length === 0 && <tr><td colSpan="4" className="text-center">Nenhum aluguel encontrado para o cliente.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Clientes com/sem aluguéis (consulta do banco)</h5>
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead><tr><th>Cliente</th><th>Data do aluguel</th></tr></thead>
                  <tbody>
                    {clientesComSem.map((item, indice) => (
                      <tr key={indice}><td>{item.cliente}</td><td>{formatarData(item.dataAluguel) || item.dataAluguel}</td></tr>
                    ))}
                    {clientesComSem.length === 0 && <tr><td colSpan="2" className="text-center">Sem dados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Fabricantes e quantidade de veículos (consulta do banco)</h5>
              <div className="table-responsive">
                <table className="table table-sm table-striped">
                  <thead><tr><th>Fabricante</th><th>Quantidade</th></tr></thead>
                  <tbody>
                    {fabricantesQtd.map((item, indice) => (
                      <tr key={indice}><td>{item.fabricante}</td><td>{item.quantidadeVeiculos}</td></tr>
                    ))}
                    {fabricantesQtd.length === 0 && <tr><td colSpan="2" className="text-center">Sem dados.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Aluguéis em aberto (consulta do banco)</h5>
          <div className="table-responsive">
            <table className="table table-sm table-striped">
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
                {alugueisEmAberto.length === 0 && <tr><td colSpan="4" className="text-center">Nenhum aluguel em aberto.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;
