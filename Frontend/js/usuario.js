import { getUsuario } from "./api.js";

// Función para obtener el usuario logueado desde localStorage
function getUsuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

// Función que obtiene el usuario y llena el HTML
async function mostrarUsuario(id) {
  try {
    // Pedimos el usuario con el ID determinado
    const usuario = await getUsuario(id);

    // Llenamos los elementos del HTML con los datos del usuario
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

    // Verificamos si el usuario logueado es el mismo que el usuario que estamos visualizando
    const usuarioLogueado = getUsuarioLogueado();

    if (usuarioLogueado && usuarioLogueado.id === usuario.id) {
      // Mostrar los botones de editar y eliminar
      document.getElementById("edit-user-btn").style.display = "inline-block";
      document.getElementById("delete-user-btn").style.display = "inline-block";

      // Evento para eliminar al hacer click en el botón "Eliminar"
      document.getElementById("delete-user-btn").addEventListener("click", () => {
        eliminarUsuario(usuario.id);
      });

      // Evento para editar al hacer click en el botón "Editar"
      document.getElementById("edit-user-btn").addEventListener("click", () => {
        // Redirigir a una página de edición
        window.location.href = `editar_usuario.html?id=${usuario.id}`;
      });
    }

  } catch (error) {
    console.error(error);
    alert("No se pudo cargar el usuario");
  }
}


// Función para eliminar el usuario
async function eliminarUsuario(usuarioId) {
  try {
    const usuarioLogueado = getUsuarioLogueado();

    // Verificar si hay un usuario logueado
    if (!usuarioLogueado) {
      return alert("Debes iniciar sesión para eliminar tu cuenta.");
    }

    // Verificar si el usuario logueado es el mismo que el que está viendo el perfil
    if (usuarioLogueado.id !== usuarioId) {
      return alert("No tienes permisos para eliminar este usuario.");
    }

    // Mostrar confirmación antes de eliminar
    const confirmar = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.");
    if (!confirmar) {
      return; // Si el usuario cancela, no hacemos nada.
    }

    // Llamar a la API para eliminar el usuario
    const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (response.status === 200) {
      alert("Tu cuenta ha sido eliminada correctamente.");
      
      // Eliminar el usuario del localStorage.
      localStorage.removeItem("usuarioLogueado");
      console.log("Usuario eliminado del localStorage");

      // Redirigir al home o página de inicio
      window.location.href = "home.html"; 
    } else {
      alert(result.error || "Error al eliminar la cuenta.");
    }
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert("Hubo un error al eliminar tu cuenta.");
  }
}

// Ejecutamos al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // Defaultea al usuario 1.
  console.log("ID extraído de la URL:", id);
  mostrarUsuario(id);
});


