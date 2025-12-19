document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos el id de la partitura desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const partituraId = urlParams.get('id');

  if (!partituraId) {
    alert("No se encontró el ID de la partitura");
    return;
  }

  // Recupera el objeto completo del usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  // Asegúrate de que el usuario existe y extrae solo el `id`
  const usuarioId = usuario ? usuario.id : null;

  console.log("usuarioId:", usuarioId); // Verifica que sea el ID del usuario y no el objeto completo

  if (!usuarioId) {
    alert("Debes estar logueado para editar la partitura");
    return;
  }

  // Carga la partitura desde la API
  fetch(`http://localhost:3000/api/partituras/${partituraId}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Rellena el formulario con los datos de la partitura
      document.getElementById("edit-nombre").value = data.nombre || '';
      document.getElementById("edit-pdf").value = data.pdf || '';
      document.getElementById("edit-audio").value = data.audio || '';
      document.getElementById("edit-artista").value = data.artista || '';
      document.getElementById("edit-genero").value = data.genero || '';
      document.getElementById("edit-instrumento").value = data.instrumento || '';
      document.getElementById("edit-nivel").value = data.nivel || '';
      document.getElementById("edit-duracion").value = data.duracion || '';
      document.getElementById("edit-descripcion").value = data.descripcion || '';
      document.getElementById("edit-imagen").value = data.imagen || '';
    })
    .catch(error => {
      console.error("Error al cargar la partitura:", error);
      alert("Hubo un error al cargar la partitura.");
    });

  // Enviar los datos del formulario cuando se haga submit
  const form = document.getElementById("edit-partitura-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Guarda los valores del formulario
    const nombre = document.getElementById("edit-nombre").value.trim() || null;
    const pdf = document.getElementById("edit-pdf").value.trim() || null;
    const audio = document.getElementById("edit-audio").value.trim() || null;
    const artista = document.getElementById("edit-artista").value.trim() || null;
    const genero = document.getElementById("edit-genero").value.trim() || null;
    const instrumento = document.getElementById("edit-instrumento").value.trim() || null;
    const nivel = document.getElementById("edit-nivel").value.trim() || null;
    const duracion = document.getElementById("edit-duracion").value.trim() || null;
    const descripcion = document.getElementById("edit-descripcion").value.trim() || null;
    const imagen = document.getElementById("edit-imagen").value.trim() || null;

    // Preparamos el objeto con los datos a actualizar
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
      usuario_id: usuarioId, // Asegúrate de pasar solo el ID del usuario
    };

    // Si no hay nada para actualizar, mostramos un mensaje y no hacemos el request
    if (Object.keys(partituraData).length === 0) {
      alert("No se ha modificado ningún campo.");
      return;
    }

    // Enviar la solicitud PUT para actualizar la partitura
    fetch(`http://localhost:3000/api/partituras/${partituraId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partituraData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert("Hubo un error al actualizar la partitura.");
        } else {
          alert("Partitura actualizada exitosamente!");
          window.location.href = `partitura.html?id=${data.id}`;
        }
      })
      .catch(error => {
        console.error("Error al actualizar la partitura:", error);
        alert("Hubo un error al actualizar la partitura.");
      });
  });
});

