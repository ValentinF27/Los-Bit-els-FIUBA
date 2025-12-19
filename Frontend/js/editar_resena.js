document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos el id de la reseña desde la URL
  const urlParams = new URLSearchParams(window.location.search);
  const reseñaId = urlParams.get('id');

  if (!reseñaId) {
    alert("No se encontró el ID de la reseña");
    return;
  }

  // Carga la reseña desde la API
  fetch(`http://localhost:3000/api/resenas/${reseñaId}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
        return;
      }

      // Rellena el formulario con los datos de la reseña
      document.getElementById("edit-titulo").value = data.titulo || ''; // Si está vacío, lo dejamos en blanco
      document.getElementById("edit-contenido").value = data.contenido || '';

      // Rellenamos las estrellas
      const rating = data.estrellas;
      document.querySelector(`input[name="rating"][value="${rating}"]`).checked = true;
    })
    .catch(error => {
      console.error("Error al cargar la reseña:", error);
      alert("Hubo un error al cargar la reseña.");
    });

  // Enviar los datos del formulario cuando se haga submit
  const form = document.getElementById("edit-resena-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Guarda los valores del formulario
    const titulo = document.getElementById("edit-titulo").value.trim() || null;
    const contenido = document.getElementById("edit-contenido").value.trim() || null;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || null;

    // Preparamos un objeto con los datos a actualizar
    const reseñaData = {};

    // Solo agregamos al objeto los campos que no sean null o vacíos
    if (titulo) reseñaData.titulo = titulo;
    if (contenido) reseñaData.contenido = contenido;
    if (rating) reseñaData.estrellas = parseInt(rating);

    // Si no hay nada para actualizar, mostramos un mensaje y no hacemos el request
    if (Object.keys(reseñaData).length === 0) {
      alert("No se ha modificado ningún campo.");
      return;
    }
    // Enviar la solicitud PUT para actualizar la reseña
    fetch(`http://localhost:3000/api/resenas/${reseñaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reseñaData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          alert("Hubo un error al actualizar la reseña.");
        } else {
          alert("Reseña actualizada exitosamente!");
          // Redirige a la página de la partitura.
          window.location.href = `partitura.html?id=${data.partitura_id}`;
        }
      })
      .catch(error => {
        console.error("Error al actualizar la reseña:", error);
        alert("Hubo un error al actualizar la reseña.");
      });
  });
});

