import {
  getPartiturasRecientes,
  getPartiturasPopulares
} from "./api.js";

// Carga partituras recientes y populares al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  cargar("recientes", getPartiturasRecientes);
  cargar("populares", getPartiturasPopulares);
});

// Carga partituras en el contenedor dado usando la función fetchFn
async function cargar(idContenedor, fetchFn) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    const partituras = await fetchFn();
    render(contenedor, partituras);
  } catch (e) {
    contenedor.innerHTML = "<p>Error al cargar</p>";
  }
}

// Renderiza las partituras en el contenedor dado
function render(contenedor, partituras) {
  contenedor.innerHTML = "";

  partituras.forEach(p => {
    console.log("DEBUG PARTITURA:", p)
    contenedor.innerHTML += `
      <div class="column is-one-quarter">
        <div class="card post-card">
          <div class="card-image">
            <figure class="image is-4by3">
              <img src="${p.imagen || './iconos/partitura.png'}">
            </figure>
          </div>

          <div class="card-content">
            <p class="title is-6">${p.nombre}</p>
            <p class="subtitle is-7">${p.artista}</p>

            ${estrellasHTML(p.promedio_estrellas || 0)}
          </div>

          <footer class="card-footer">
            <a href="partitura.html?id=${p.id}" class="card-footer-item">Ver</a>
          </footer>
        </div>
      </div>
    `;
  });
}

// Genera el HTML para mostrar estrellas según el promedio dado
function estrellasHTML(promedio) {
  const rating = Math.round(Number(promedio) || 0);
  let html = "";

  for (let i = 1; i <= 5; i++) {
    html += i <= rating ? "⭐" : "☆";
  }

  return `<div class="has-text-warning">${html}</div>`;
}


