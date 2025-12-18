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

// Envía una nueva reseña al backend.
export async function enviarReseña({ partitura_id, titulo, contenido, estrellas }) {
  // Tomamos usuario logueado desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) throw new Error("Usuario no logueado");

  const usuario_id = usuario.id; // ID del usuario que escribe la reseña

  // Hacemos POST al backend para crear la reseña
  const res = await fetch("http://localhost:3000/api/resenas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id,
      partitura_id,
      titulo,
      contenido,
      estrellas
    })
  });

  // Revisamos si la petición falló
  if (!res.ok) {
    throw new Error("Error al enviar la reseña");
  }
  return true;
}

// Elimina una reseña por id.
export async function borrarReseña(reseña_id) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) throw new Error("Usuario no logueado");

  const res = await fetch(`http://localhost:3000/api/resenas/${reseña_id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuario.id }) // opcional, depende de backend
  });

  if (!res.ok) throw new Error("Error al borrar la reseña");
  return true;
}
