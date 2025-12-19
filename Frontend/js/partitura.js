import { getPartitura, enviarReseña } from "./api.js";
import { eliminarReseña } from "./resena.js";

// Devuelve el usuario logueado o null si no hay sesión
function getUsuarioLogueado() {
  return JSON.parse(localStorage.getItem("usuarioLogueado"));
}

// Función que obtiene la partitura y llena el HTML, incluyendo reseñas.
async function mostrarPartitura(id) {
  try {
    // Pedimos partitura con id determinado.
    const partitura = await getPartitura(id);

    // Nombre de la partitura.
    document.getElementById("sheet-name").textContent = partitura.nombre;

    // Usuario que subió la partitura (clickeable).
    const uploaderLink = document.getElementById("sheet-user-link");
    uploaderLink.textContent = partitura.nickname;
    uploaderLink.href = `usuario.html?id=${partitura.usuario_id}`;

    // Audio.
    const audio = document.getElementById("sheet-audio");
    const source = document.getElementById("sheet-audio-source");
    source.src = partitura.audio;
    audio.load();

    // Info adicional.
    document.getElementById("sheet-artist").textContent = partitura.artista;
    document.getElementById("sheet-genre").textContent = partitura.genero;
    document.getElementById("sheet-instrument").textContent = partitura.instrumento;
    document.getElementById("sheet-level").textContent = partitura.nivel;
    document.getElementById("sheet-duration").textContent = partitura.duracion;
    document.getElementById("sheet-description").textContent = partitura.descripcion;

    // Pdf.
    document.getElementById("sheet-pdf").data = partitura.pdf;
    document.getElementById("sheet-pdf-link").href = partitura.pdf;

    // Reseñas.
    const reseñasContainer = document.getElementById("reseñas-container");
    const form = reseñasContainer.querySelector("form");

    // Limpiamos reseñas anteriores.
    reseñasContainer.querySelectorAll(".review-post").forEach(el => el.remove());

    // Obtenemos usuario logueado una sola vez.
    const usuarioLogueado = getUsuarioLogueado();

    if (partitura.reseñas && partitura.reseñas.length > 0) {
      partitura.reseñas.forEach(reseña => {

        // Verificamos si esta reseña es del usuario.
        const esAutor = usuarioLogueado && usuarioLogueado.id === reseña.usuario_id;

        const fecha = new Date(reseña.fecha_creacion).toLocaleDateString("es-ES");
        const estrellas = "★".repeat(reseña.estrellas) + "☆".repeat(5 - reseña.estrellas);

        // Si el usuario es el autor, mostramos botones Editar / Eliminar.
        const botonesReseña = esAutor
          ? `
            <div class="buttons is-right mt-2">
                <a href="editar_resena.html?id=${reseña.id}" class="button is-small is-link">
                  Editar
                </a>
              </button>
              <button class="button is-small is-danger is-light" id="eliminarReseña${reseña.id}">
                Eliminar
              </button>
            </div>`
          : "";

        // Construimos el HTML de la reseña.
        // Los botones solo aparecen si botonesReseña no está vacío.
        const reseñaHTML = `
          <article class="media review-post" data-id="${reseña.id}">
            <div class="media-content">
              <div class="content">
                <h5>${reseña.titulo || "Sin título"}</h5>
                <p>
                  <strong>
                    <a href="usuario.html?id=${reseña.usuario_id}">
                      ${reseña.usuario_nickname}
                    </a>
                  </strong>
                  <small>· ${fecha}</small>
                  <br>
                  <span>${reseña.contenido}</span>
                </p>
              </div>
              <div class="has-text-warning">${estrellas}</div>
              ${botonesReseña}
            </div>
          </article>
        `;

        // Creamos un contenedor temporal para convertir string en nodo.
        const temp = document.createElement("div");
        temp.innerHTML = reseñaHTML;
        const reseñaNode = temp.firstElementChild;

        // Insertamos antes del form para que aparezcan arriba.
        form.insertAdjacentElement("afterend", reseñaNode);

        // Asignar el evento de eliminar a este botón.
        const eliminarBtn = document.getElementById(`eliminarReseña${reseña.id}`);
        if (eliminarBtn) {
          eliminarBtn.addEventListener("click", () => {
            console.log(`Eliminar reseña con id: ${reseña.id}`);
            eliminarReseña(reseña.id); // Llamar a la función eliminarReseña
          });
        }
      });
    // Si no hay reseñas.
    } else {
      const p = document.createElement("p");
      p.className = "review-post";
      p.textContent = "No hay reseñas todavía. ¡Sé el primero en dejar una!";
      form.insertAdjacentElement("afterend", p);
    }

    // Mostrar los botones de editar y eliminar partituras si su usuario esta loggeado.
    if (usuarioLogueado && usuarioLogueado.id === partitura.usuario_id) {
      document.querySelector(".button.is-link").style.display = "inline-block";   // Botón editar
      document.querySelector(".button.is-danger").style.display = "inline-block";  // Botón eliminar

      // Llamar a la función para manejar el evento de eliminar
      document.querySelector(".button.is-danger").addEventListener("click", async () => {
        const confirmar = confirm("¿Estás seguro de que deseas eliminar esta partitura?");
        if (confirmar) {
          await eliminarPartitura(partitura.id); // Llamada al backend para eliminar la partitura
        }
      });
    } else {
      // Si no es el id asociado, ocultamos los botones.
      document.querySelector(".button.is-link").style.display = "none";
      document.querySelector(".button.is-danger").style.display = "none";
    }

    } catch (error) {
    console.error(error);
    alert("No se pudo cargar la partitura");
  }
}

// Función para inicializar el envío de reseña.
function initReseñasForm() {
  const form = document.getElementById("reseñas-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // evitamos recarga de página

    // Obtenemos valores del form.
    const titulo = document.getElementById("reseña-titulo").value;
    const contenido = document.getElementById("reseña-contenido").value;
    const estrellas = parseInt(form.querySelector('input[name="rating"]:checked')?.value);

    if (!estrellas) {
      return alert("Debes seleccionar una calificación");
    }

    // Id de la partitura actual.
    const params = new URLSearchParams(window.location.search);
    const partitura_id = params.get("id");

    // Enviamos la reseña al backend.
    await enviarReseña({ titulo, contenido, estrellas, partitura_id });

    // Llamamos de nuevo a mostrarPartitura para actualizar la lista de reseñas.
    await mostrarPartitura(partitura_id);
    // Limpiamos el form después de enviar.
    form.reset();
    alert("Reseña enviada correctamente");
  });
}

// Función para eliminar la partitura
async function eliminarPartitura(partituraId) {
  try {
    const usuarioLogueado = getUsuarioLogueado();
    if (!usuarioLogueado) {
      return alert("Debes iniciar sesión para eliminar la partitura.");
    }

    // Mostrar confirmación antes de eliminar
    const confirmar = confirm("¿Estás seguro de que deseas eliminar esta partitura? Esta acción no se puede deshacer.");
    if (!confirmar) {
      return; // Si el usuario cancela, no hacemos nada.
    }

    // Enviar solicitud DELETE al backend para eliminar la partitura
    const response = await fetch(`http://localhost:3000/api/partituras/${partituraId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario_id: usuarioLogueado.id }), // Enviamos el ID del usuario logueado para verificar la autorización
    });

    const result = await response.json();

    if (response.status === 200) {
      alert("La partitura ha sido eliminada correctamente.");
      window.location.href = "index.html"; // Redirige a la página de inicio.
    } else {
      alert(result.error || "Error al eliminar la partitura.");
    }
  } catch (error) {
    console.error("Error al eliminar la partitura:", error);
    alert("Hubo un error al eliminar la partitura.");
  }
}

// Ejecutamos al cargar la página.
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // default id
  mostrarPartitura(id);
  initReseñasForm(); // inicializamos el form
});
