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

    // --- Mostrar partituras subidas ---
    const partiturasContainer = document.getElementById("partituras-container");
    partiturasContainer.innerHTML = ""; // Limpiar el contenedor si ya había contenido.

    if (usuario.partituras && usuario.partituras.length > 0) {
      usuario.partituras.forEach(partitura => {
        const partituraHTML = `
          <div class="column is-one-quarter">
            <a href="partitura.html?id=${partitura.id}" class="card">
            <div class="card">
              <div class="card-image">
                <figure class="image is-4by3">
                  <img src="${partitura.imagen || './iconos/partitura.png'}" alt="Vista previa de la partitura">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-5">${partitura.nombre}</p>
                <p class="subtitle is-6">${partitura.instrumento} - ${partitura.artista}</p>
              </div>
              <footer class="card-footer">
              </footer>
            </div>
            </a>
          </div>
        `;
        // Creamos un contenedor temporal para convertir string en nodo.
        const temp = document.createElement("div");
        temp.innerHTML = partituraHTML;
        partiturasContainer.appendChild(temp.firstElementChild);
      });
    } else {
      partiturasContainer.innerHTML = "<p>No has subido partituras todavía.</p>";
    }

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

