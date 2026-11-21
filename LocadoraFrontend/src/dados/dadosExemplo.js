export const clientesExemplo = [
  { id: 1, nome: "Ana Souza", cpf: "12345678901", email: "ana@email.com", saldo: 500 },
  { id: 2, nome: "Bruno Lima", cpf: "98765432100", email: "bruno@email.com", saldo: 300 }
];

export const fabricantesExemplo = [
  { id: 1, nome: "Fiat" },
  { id: 2, nome: "Volkswagen" },
  { id: 3, nome: "Chevrolet" }
];

export const categoriasExemplo = [
  { id: 1, nome: "Hatch" },
  { id: 2, nome: "Sedan" },
  { id: 3, nome: "SUV" }
];

export const veiculosExemplo = [
  { id: 1, modelo: "Uno", anoFabricacao: 2020, quilometragem: 45000, fabricante: "Fiat", categoria: "Hatch" },
  { id: 2, modelo: "Onix", anoFabricacao: 2022, quilometragem: 18000, fabricante: "Chevrolet", categoria: "Hatch" },
  { id: 3, modelo: "T-Cross", anoFabricacao: 2023, quilometragem: 12000, fabricante: "Volkswagen", categoria: "SUV" }
];

export const alugueisExemplo = [
  { id: 1, cliente: "Ana Souza", veiculo: "Uno", dataInicio: "2026-11-10", dataDevolucao: null, valorDiaria: 120, valorTotal: null, situacao: "Em aberto" },
  { id: 2, cliente: "Bruno Lima", veiculo: "Onix", dataInicio: "2026-11-12", dataDevolucao: "2026-11-14", valorDiaria: 130, valorTotal: 260, situacao: "Finalizado" }
];
