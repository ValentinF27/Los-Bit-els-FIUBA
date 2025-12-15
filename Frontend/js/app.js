// Función que obtiene el usuario y llena el HTML.
async function mostrarUsuario() {
  try {
    // Pedimos el usuario 1.
    const response = await fetch("http://localhost:3000/usuarios/1");
    const usuario = await response.json();

    // Llenamos los elementos del HTML.
    document.getElementById("username").textContent = usuario.nickname || "";
    document.getElementById("name").textContent = usuario.nom_completo || "";
    document.getElementById("email").textContent = usuario.email || "";

    document.getElementById("phone").textContent = "";
    document.getElementById("location").textContent = "";
    document.getElementById("instruments").textContent = "";
    document.getElementById("genres").textContent = "";

  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el usuario");
  }
}

// Ejecutamos al cargar la página.
window.addEventListener("DOMContentLoaded", mostrarUsuario);

