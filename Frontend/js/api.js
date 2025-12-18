// Pide usuario de id determinado al backend.
export async function getUsuario(id) {
  const res = await fetch(`http://localhost:3000/api/usuarios/${id}`);
  if (!res.ok) throw new Error(`Usuario no encontrado`);
  return await res.json();
}

// Pide partitura de id determinado al backend.
export async function getPartitura(id) {
  const res = await fetch(`http://localhost:3000/api/partituras/${id}`);
  if (!res.ok) throw new Error(`Partitura no encontrada`);
  return await res.json();
}

// Busca partituras que coincidan con el query dado.
export async function buscarPartituras(query) {
  const res = await fetch(`http://localhost:3000/api/partituras?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Error al buscar partituras");
  return res.json();
}
// Pide las partituras recientemente agregadas o editadas.
export async function getPartiturasRecientes() {
  const res = await fetch("http://localhost:3000/api/partituras/recientes");
  return res.json();
}

// Pide las partituras con reseñas buenas recientes.
export async function getPartiturasPopulares() {
  const res = await fetch("http://localhost:3000/api/partituras/populares");
  return res.json();
}

