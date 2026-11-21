import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio";
import Clientes from "./pages/Clientes";
import Fabricantes from "./pages/Fabricantes";
import Categorias from "./pages/Categorias";
import Veiculos from "./pages/Veiculos";
import Alugueis from "./pages/Alugueis";
import Carteira from "./pages/Carteira";
import Relatorios from "./pages/Relatorios";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/fabricantes" element={<Fabricantes />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/alugueis" element={<Alugueis />} />
        <Route path="/carteira" element={<Carteira />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Layout>
  );
}

export default App;
