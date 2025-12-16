import { getUsuario } from "./api.js";
// Función que obtiene el usuario y llena el HTML.
async function mostrarUsuario(id) {
  try {
    // Pedimos usuario con id determinado.
    const usuario = await getUsuario(id);

    // Llenamos los elementos del HTML.
    document.getElementById("username").textContent = usuario.nickname || "";
    document.getElementById("name").textContent = usuario.nom_completo || "";
    document.getElementById("email").textContent = usuario.email || "";

    document.getElementById("phone").textContent = usuario.telefono || "";
    document.getElementById("location").textContent = usuario.ubicacion || "";
    document.getElementById("instruments").textContent = usuario.instrumento || "";
    document.getElementById("genres").textContent = usuario.genero_fav || "";
  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el usuario");
  }
}

// Ejecutamos al cargar la página.
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // defaultea al usuario 1.
  console.log("ID extraído de la URL:", id);
  mostrarUsuario(id);
});

