import { buscarPartituras } from "./api.js";

// Genera el HTML para mostrar estrellas según el promedio dado
function renderEstrellas(promedio) {
  const total = 5;
  const valor = Math.round(Number(promedio || 0));

  let html = `<div class="has-text-warning">`;

  for (let i = 1; i <= total; i++) {
    html += i <= valor ? "★" : "☆";
  }

  html += `</div>`;
  return html;
}

// Obtiene el valor de un parámetro de la URL
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}


document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("inputBusqueda");
  const boton = document.getElementById("botonBusqueda");
  const contenedor = document.getElementById("resultadosBusqueda");

  // Maneja el clic en el botón de búsqueda
  boton.addEventListener("click", async () => {
    const texto = input.value.trim();
    if (!texto) return;

    try {
      const resultados = await buscarPartituras(texto);
      renderResultados(resultados);
    } catch (error) {
      console.error(error);
      contenedor.innerHTML = "<p>Error al buscar</p>";
    }
  });

  // Renderiza los resultados de la búsqueda
  function renderResultados(partituras) {
    contenedor.innerHTML = "";

    // Mensaaje de error si no hay resultados
    if (partituras.length === 0) {
      contenedor.innerHTML = "<p>No se encontraron resultados</p>";
      return;
    }

    // Renderiza cada partitura encontrada
    partituras.forEach(p => {
      const html = `
        <article class="media mb-4">
          <figure class="media-left">
            <p class="image is-64x64">
              <img src="${p.imagen || './iconos/partitura.png'}">
            </p>
          </figure>

          <div class="media-content">
            <strong>${p.nombre} (${p.instrumento})</strong><br>
            <small>${p.artista} - ${p.genero} ${renderEstrellas(p.promedio_estrellas)}</small>
          </div>

          <div class="media-right">
            <a href="partitura.html?id=${p.id}" class="button is-large is-primary">Ver</a>
          </div>
        </article>
      `;
      contenedor.insertAdjacentHTML("beforeend", html);
    });
  }

  const q = getQueryParam("q");
  if (q) {
    input.value = q;
    boton.click();
  }

});
