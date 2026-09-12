const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  return {
    "Accept": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  };
}

export async function getCasasVegetacao() {
  const response = await fetch(`${API_URL}/casas-vegetacao?per_page=100`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Erro ao buscar casas de vegetação");
  }
  return response.json();
}

export async function getReservas() {
  const response = await fetch(`${API_URL}/reservas`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!response.ok) throw new Error("Erro ao buscar reservas");
  return response.json();
}