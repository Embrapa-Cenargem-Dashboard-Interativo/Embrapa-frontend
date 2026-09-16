const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  return {
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function getCasasVegetacao() {
  const response = await fetch(`${API_URL}/casas-vegetacao?per_page=100`, {
    headers: authHeaders(),
  });
  if (!response.ok) {
    throw new Error("Erro ao buscar casas de vegetação");
  }
  return response.json();
}

export async function getReservas() {
  const response = await fetch(`${API_URL}/reservas`, {
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error("Erro ao buscar reservas");
  return response.json();
}

export async function login(nick: string, senha: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ nick, senha }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Usuário ou senha incorretos");
  }

  return data; // { token, token_type, funcionario }
}