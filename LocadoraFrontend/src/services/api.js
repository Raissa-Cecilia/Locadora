export const urlApi = "https://localhost:7181/api";

export async function apiGet(caminho) {
  const resposta = await fetch(`${urlApi}${caminho}`);
  if (!resposta.ok) {
    throw new Error("Erro ao buscar dados na API.");
  }
  return resposta.json();
}

export async function apiPost(caminho, dados) {
  const resposta = await fetch(`${urlApi}${caminho}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  if (!resposta.ok) {
    throw new Error("Erro ao salvar registro.");
  }
  return resposta.json();
}

export async function apiPut(caminho, dados) {
  const resposta = await fetch(`${urlApi}${caminho}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  if (!resposta.ok) {
    throw new Error("Erro ao atualizar registro.");
  }
}

export async function apiDelete(caminho) {
  const resposta = await fetch(`${urlApi}${caminho}`, {
    method: "DELETE"
  });
  if (!resposta.ok) {
    throw new Error("Erro ao excluir registro.");
  }
}
