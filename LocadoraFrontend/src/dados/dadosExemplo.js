export const clientesExemplo = [
  { id: 1, nome: "Ana Souza", cpf: "12345678901", email: "ana@email.com", saldo: 500 },
  { id: 2, nome: "Bruno Lima", cpf: "98765432100", email: "bruno@email.com", saldo: 300 }
];

export const fabricantesExemplo = [
  { id: 1, nome: "Fiat" },
  { id: 2, nome: "Volkswagen" },
  { id: 3, nome: "Chevrolet" },
  { id: 4, nome: "Toyota" },
  { id: 5, nome: "Honda" },
  { id: 6, nome: "Hyundai" }
];

export const categoriasExemplo = [
  { id: 1, nome: "Hatch" },
  { id: 2, nome: "Sedan" },
  { id: 3, nome: "SUV" },
  { id: 4, nome: "Pickup" }
];

export const veiculosExemplo = [
  { id: 1, modelo: "Uno", anoFabricacao: 2020, quilometragem: 45000, fabricante: "Fiat", categoria: "Hatch" },
  { id: 2, modelo: "Onix", anoFabricacao: 2022, quilometragem: 18000, fabricante: "Chevrolet", categoria: "Hatch" },
  { id: 3, modelo: "T-Cross", anoFabricacao: 2023, quilometragem: 12000, fabricante: "Volkswagen", categoria: "SUV" },
  { id: 4, modelo: "Corolla", anoFabricacao: 2021, quilometragem: 32000, fabricante: "Toyota", categoria: "Sedan" },
  { id: 5, modelo: "Civic", anoFabricacao: 2022, quilometragem: 21000, fabricante: "Honda", categoria: "Sedan" },
  { id: 6, modelo: "HB20", anoFabricacao: 2023, quilometragem: 9000, fabricante: "Hyundai", categoria: "Hatch" },
  { id: 7, modelo: "Creta", anoFabricacao: 2024, quilometragem: 5000, fabricante: "Hyundai", categoria: "SUV" },
  { id: 8, modelo: "Toro", anoFabricacao: 2021, quilometragem: 38000, fabricante: "Fiat", categoria: "Pickup" }
];

export const alugueisExemplo = [
  { id: 1, cliente: "Ana Souza", veiculo: "Uno", dataInicio: "2026-11-10", dataDevolucao: null, valorDiaria: 120, valorTotal: null, situacao: "Em aberto" },
  { id: 2, cliente: "Bruno Lima", veiculo: "Onix", dataInicio: "2026-11-12", dataDevolucao: "2026-11-14", valorDiaria: 130, valorTotal: 260, situacao: "Finalizado" },
  { id: 3, cliente: "Ana Souza", veiculo: "Corolla", dataInicio: "2026-11-15", dataDevolucao: "2026-11-18", valorDiaria: 180, valorTotal: 540, situacao: "Finalizado" }
];
