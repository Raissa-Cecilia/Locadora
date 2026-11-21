import { alugueisExemplo, categoriasExemplo, clientesExemplo, fabricantesExemplo, veiculosExemplo } from "../dados/dadosExemplo";

function Inicio() {
  function formatarData(valor) {
    if (!valor) return "-";
    return String(valor).substring(0, 10);
  }

  return (
    <div>
      <div className="cabecalho-pagina">
        <h1>Sistema de Locadora de Veículos</h1>
        <p>
          Projeto de continuidade com front-end integrado à API da locadora, com cadastros, pesquisas,
          relatórios, devoluções e controle de saldo/pagamento.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card card-destaque h-100">
            <div className="card-body">
              <h5 className="card-title">Problema</h5>
              <p className="card-text mb-0">Controle manual de clientes, veículos e aluguéis dificultava consultas e organização financeira.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-destaque h-100">
            <div className="card-body">
              <h5 className="card-title">Solução</h5>
              <p className="card-text mb-0">Sistema web para gerenciar cadastros, aluguéis, devoluções, relatórios e carteira de saldo.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card card-destaque h-100">
            <div className="card-body">
              <h5 className="card-title">Dados fictícios</h5>
              <p className="card-text mb-0">As tabelas abaixo mostram exemplos definidos na etapa inicial do projeto.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card card-tabela mb-4">
        <div className="card-header">
          <h5>Clientes (exemplo)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Saldo</th></tr>
              </thead>
              <tbody>
                {clientesExemplo.map((c) => (
                  <tr key={c.id}><td>{c.nome}</td><td>{c.cpf}</td><td>{c.email}</td><td>R$ {c.saldo}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card card-tabela mb-4">
        <div className="card-header">
          <h5>Veículos (exemplo)</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr><th>Modelo</th><th>Ano</th><th>Fabricante</th><th>Categoria</th></tr>
              </thead>
              <tbody>
                {veiculosExemplo.map((v) => (
                  <tr key={v.id}><td>{v.modelo}</td><td>{v.anoFabricacao}</td><td>{v.fabricante}</td><td>{v.categoria}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card card-tabela h-100">
            <div className="card-header">
              <h5>Fabricantes e categorias</h5>
            </div>
            <div className="card-body com-padding">
              <h6 className="secao-titulo mt-0">Fabricantes</h6>
              <ul className="list-group lista-simples mb-3">
                {fabricantesExemplo.map((f) => <li key={f.id} className="list-group-item">{f.nome}</li>)}
              </ul>
              <h6 className="secao-titulo">Categorias</h6>
              <ul className="list-group lista-simples">
                {categoriasExemplo.map((c) => <li key={c.id} className="list-group-item">{c.nome}</li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card card-tabela h-100">
            <div className="card-header">
              <h5>Aluguéis (exemplo)</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead>
                    <tr><th>Cliente</th><th>Veículo</th><th>Início</th><th>Situação</th></tr>
                  </thead>
                  <tbody>
                    {alugueisExemplo.map((a) => (
                      <tr key={a.id}>
                        <td>{a.cliente}</td>
                        <td>{a.veiculo}</td>
                        <td>{formatarData(a.dataInicio)}</td>
                        <td>{a.situacao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
