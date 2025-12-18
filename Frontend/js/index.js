import {
  getPartiturasRecientes,
  getPartiturasPopulares
} from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  cargar("recientes", getPartiturasRecientes);
  cargar("populares", getPartiturasPopulares);
});

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

function render(contenedor, partituras) {
  contenedor.innerHTML = "";

  partituras.forEach(p => {
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
          </div>
          <footer class="card-footer">
            <a href="partitura.html?id=${p.id}" class="card-footer-item">Ver</a>
          </footer>
        </div>
      </div>
    `;
  });
}
