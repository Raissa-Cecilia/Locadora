import { alugueisExemplo, categoriasExemplo, clientesExemplo, fabricantesExemplo, veiculosExemplo } from "../dados/dadosExemplo";

function Inicio() {
  return (
    <div>
      <h1 className="mb-3">Sistema de Locadora de Veículos</h1>
      <p className="text-muted">
        Projeto de continuidade com front-end integrado à API da locadora. Aqui ficam as telas de cadastro,
        edição, exclusão, pesquisa, relatórios e controle de saldo/pagamento.
      </p>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Problema</h5>
              <p className="card-text">Controle manual de clientes, veículos e aluguéis dificultava consultas e organização financeira.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Solução</h5>
              <p className="card-text">Sistema web para gerenciar cadastros, aluguéis, devoluções, relatórios e carteira de saldo.</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Dados fictícios</h5>
              <p className="card-text">As tabelas abaixo mostram exemplos definidos na etapa inicial do projeto.</p>
            </div>
          </div>
        </div>
      </div>

      <h4>Clientes (exemplo)</h4>
      <table className="table table-sm table-striped">
        <thead><tr><th>Nome</th><th>CPF</th><th>Email</th><th>Saldo</th></tr></thead>
        <tbody>
          {clientesExemplo.map((c) => (
            <tr key={c.id}><td>{c.nome}</td><td>{c.cpf}</td><td>{c.email}</td><td>R$ {c.saldo}</td></tr>
          ))}
        </tbody>
      </table>

      <h4>Veículos (exemplo)</h4>
      <table className="table table-sm table-striped">
        <thead><tr><th>Modelo</th><th>Ano</th><th>Fabricante</th><th>Categoria</th></tr></thead>
        <tbody>
          {veiculosExemplo.map((v) => (
            <tr key={v.id}><td>{v.modelo}</td><td>{v.anoFabricacao}</td><td>{v.fabricante}</td><td>{v.categoria}</td></tr>
          ))}
        </tbody>
      </table>

      <div className="row">
        <div className="col-md-6">
          <h4>Fabricantes e categorias</h4>
          <ul className="list-group mb-3">
            {fabricantesExemplo.map((f) => <li key={f.id} className="list-group-item">Fabricante: {f.nome}</li>)}
            {categoriasExemplo.map((c) => <li key={`cat-${c.id}`} className="list-group-item">Categoria: {c.nome}</li>)}
          </ul>
        </div>
        <div className="col-md-6">
          <h4>Aluguéis (exemplo)</h4>
          <ul className="list-group mb-3">
            {alugueisExemplo.map((a) => (
              <li key={a.id} className="list-group-item">
                {a.cliente} - {a.veiculo} ({a.dataInicio}) - {a.situacao}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
