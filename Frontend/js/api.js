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
