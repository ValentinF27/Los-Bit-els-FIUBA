import { buscarPartituras } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

  const navbarBusqueda = document.getElementById("navbarBusqueda");

    if (window.location.pathname.includes("busqueda.html")) {
        if (navbarBusqueda) {
            navbarBusqueda.style.display = "none";
        }
    }


  // Navbar burger toggle
  const burger = document.querySelector(".navbar-burger");
  if (burger) {
    const menu = document.getElementById(burger.dataset.target);
    burger.addEventListener("click", () => {
      burger.classList.toggle("is-active");
      menu.classList.toggle("is-active");
    });
  }

  const input = document.getElementById("navbarInput");
  const button = document.getElementById("navbarBotonBusqueda");
  const dropdown = document.getElementById("navbarDropdown");
  const wrapper = document.getElementById("navbarBusqueda");

  if (!input || !button || !dropdown || !wrapper) return;

  let debounce = null;

  // Maneja la entrada en el campo de búsqueda
  input.addEventListener("input", () => {
    clearTimeout(debounce);
    const texto = input.value.trim();

    if (texto.length < 2) {
      dropdown.innerHTML = "";
      wrapper.classList.remove("is-active");
      return;
    }

    debounce = setTimeout(async () => {
      try {
        const resultados = await buscarPartituras(texto);
        renderDropdown(resultados);
      } catch (e) {
        console.error(e);
      }
    }, 300);
  });

  // Maneja el Enter y el clic en el botón de búsqueda
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      window.location.href = `busqueda.html?q=${encodeURIComponent(input.value)}`;
    }
  });

  // Maneja el clic en el botón de búsqueda
  button.addEventListener("click", () => {
    window.location.href = `busqueda.html?q=${encodeURIComponent(input.value)}`;
  });

  // Renderiza el dropdown con los resultados
  function renderDropdown(partituras) {
    dropdown.innerHTML = "";

    if (partituras.length === 0) {
      wrapper.classList.remove("is-active");
      return;
    }

    partituras.slice(0, 5).forEach(p => {
      const a = document.createElement("a");
      a.className = "navbar-item";
      a.innerHTML = `
        <strong>${p.nombre} (${p.instrumento})</strong><br>
        <small>${p.artista} · ${p.genero}</small>
      `;

      a.addEventListener("click", () => {
        window.location.href = `partitura.html?id=${p.id}`;
      });

      dropdown.appendChild(a);
    });

    wrapper.classList.add("is-active");
  }
});
