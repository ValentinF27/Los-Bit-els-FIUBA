import { getPartitura, enviarReseña } from "./api.js";

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

    // --- Reseñas ---
    const reseñasContainer = document.getElementById("reseñas-container");
    const form = reseñasContainer.querySelector("form");

    // Limpiamos reseñas anteriores.
    reseñasContainer.querySelectorAll(".review-post").forEach(el => el.remove());

    if (partitura.reseñas && partitura.reseñas.length > 0) {
      partitura.reseñas.forEach(reseña => {
        const fecha = new Date(reseña.fecha_creacion).toLocaleDateString("es-ES");
        const estrellas = "★".repeat(reseña.estrellas) + "☆".repeat(5 - reseña.estrellas);

        // Construimos HTML de la reseña como template literal.
        const reseñaHTML = `
          <article class="media review-post">
            <figure class="media-left"></figure>
            <div class="media-content">
              <div class="content">
                <h4>${reseña.titulo || "Sin título"}</h4>
                <p>
                  <strong><a href="usuario.html?id=${reseña.usuario_id}">${reseña.usuario_nickname}</a></strong>
                  <small>${reseña.usuario_email || ""}</small>
                  <small>· ${fecha}</small>
                  <br>
                  <span>${reseña.contenido}</span>
                </p>
              </div>
              <div class="has-text-warning">${estrellas}</div>
            </div>
          </article>
        `;

        // Creamos un contenedor temporal para convertir string en nodo.
        const temp = document.createElement("div");
        temp.innerHTML = reseñaHTML;
        const reseñaNode = temp.firstElementChild;

        // Insertamos antes del form para que aparezcan arriba.
        form.insertAdjacentElement("afterend", reseñaNode);
      });
    // Si no hay reseñas.
    } else {
      const p = document.createElement("p");
      p.className = "review-post";
      p.textContent = "No hay reseñas todavía. ¡Sé el primero en dejar una!";
      form.insertAdjacentElement("afterend", p);
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

// Ejecutamos al cargar la página.
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // default id
  mostrarPartitura(id);
  initReseñasForm(); // inicializamos el form
});
