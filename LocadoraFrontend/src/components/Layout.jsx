import { NavLink } from "react-router-dom";

function Layout({ children }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark barra-topo">
        <div className="container conteudo-principal">
          <NavLink className="navbar-brand" to="/">Locadora de Veículos</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><NavLink className="nav-link" to="/">Início</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/clientes">Clientes</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/fabricantes">Fabricantes</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/categorias">Categorias</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/veiculos">Veículos</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/alugueis">Aluguéis</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/carteira">Carteira</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/relatorios">Relatórios</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>
      <main className="container conteudo-principal py-4">{children}</main>
      <footer className="container conteudo-principal pb-4 rodape">
        Sistema de locadora com cadastros, aluguéis, relatórios e carteira.
      </footer>
    </div>
  );
}

export default Layout;
