import { getPartitura } from "./api.js";

// Función que obtiene la partitura y llena el HTML.
async function mostrarPartitura(id) {
  try {
    // Pedimos partitura con id determinado.
    const partitura = await getPartitura(id);

    // Nombre de la partitura.
    document.getElementById("sheet-name").textContent = partitura.nombre;

    // Usuario: clickeable.
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

  } catch (error) {
    console.error(error);
    alert("No se pudo cargar la partitura");
  }
}

// Ejecutamos al cargar la página.
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || 1; // defaultea a la partitura 1.
  console.log("ID extraído de la URL:", id);
  mostrarPartitura(id);
});

