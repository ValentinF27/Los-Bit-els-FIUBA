document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuario) {
    alert("Debes estar logueado para crear una partitura");
    window.location.href = "login.html"; // Redirigir a la página de login
    return;
  }

  const usuario_id = usuario.id;

  // Obtener el formulario
  const form = document.getElementById("create-partitura-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById("create-nombre").value.trim();
    const pdf = document.getElementById("create-pdf").value.trim();
    const audio = document.getElementById("create-audio").value.trim() || null;
    const artista = document.getElementById("create-artista").value.trim() || null;
    const genero = document.getElementById("create-genero").value.trim() || null;
    const instrumento = document.getElementById("create-instrumento").value.trim() || null;
    const nivel = document.getElementById("create-nivel").value.trim() || null;
    const duracion = document.getElementById("create-duracion").value.trim() || null;
    const descripcion = document.getElementById("create-descripcion").value.trim() || null;
    const imagen = document.getElementById("create-imagen").value.trim() || null;

    // Verificar que los campos obligatorios no estén vacíos
    if (!nombre || !pdf) {
      alert("Faltan campos obligatorios: nombre o pdf");
      return;
    }

    // Crear el objeto de la nueva partitura
    const partituraData = {
      nombre,
      pdf,
      audio,
      artista,
      genero,
      instrumento,
      nivel,
      duracion,
      descripcion,
      imagen,
      usuario_id
    };

    // Hacer la solicitud POST para crear la partitura
    fetch("http://localhost:3000/api/partituras", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(partituraData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert("Hubo un error al crear la partitura.");
        } else {
          alert("Partitura creada exitosamente!");
          window.location.href = `partitura.html?id=${data.id}`; // Redirigir a la vista de la nueva partitura
        }
      })
      .catch((error) => {
        console.error("Error al crear la partitura:", error);
        alert("Hubo un error al crear la partitura.");
      });
  });
});

