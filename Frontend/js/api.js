// Pide usuario de id determinado al backend.
export async function getUsuario(id) {
  const res = await fetch(`http://localhost:3000/api/usuarios/${id}`);
  if (!res.ok) throw new Error(`Usuario no encontrado`);
  return await res.json();
}

