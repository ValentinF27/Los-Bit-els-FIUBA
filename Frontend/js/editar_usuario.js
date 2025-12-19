document.addEventListener("DOMContentLoaded", () => {
  // Obtener el ID del usuario de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const usuarioId = urlParams.get('id'); // Extrae el ID de la URL

  if (!usuarioId) {
    alert("No se encontró el ID del usuario.");
    return window.location.href = "home.html"; // Redirige si no hay ID en la URL
  }

  // Recuperar el usuario logueado desde localStorage
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

  if (!usuarioLogueado || usuarioLogueado.id !== parseInt(usuarioId)) {
    alert("No tienes permisos para editar este usuario.");
    return window.location.href = "home.html"; // Redirige si no es el usuario correcto
  }

  // Función para cargar los datos del usuario en el formulario
  async function mostrarUsuario(id) {
    try {
      // Recuperar los datos del usuario desde la API
      const response = await fetch(`http://localhost:3000/api/usuarios/${id}`);
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Rellenar el formulario con los datos del usuario
      document.getElementById("edit-nickname").value = data.nickname || '';
      document.getElementById("edit-email").value = data.email || '';
    } catch (error) {
      console.error(error);
      alert("No se pudo cargar el usuario.");
    }
  }

  // Llamamos a la función para mostrar los datos del usuario
  mostrarUsuario(usuarioId);

  // Lógica para enviar los datos actualizados
  const form = document.getElementById("edit-user-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar la recarga de la página al enviar el formulario

    // Recogemos los datos del formulario
    const nickname = document.getElementById("edit-nickname").value.trim();
    const email = document.getElementById("edit-email").value.trim();

    // Validación básica
    if (!nickname || !email) {
      alert("Nickname y email son obligatorios.");
      return;
    }

    // Preparar el objeto para la solicitud PUT
    const usuarioData = {
      nickname,
      email
    };

    // Enviar solicitud PUT para actualizar el usuario
    try {
      const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuario actualizado correctamente.");
        // Redirigir al perfil del usuario
        window.location.href = `usuario.html?id=${usuarioId}`;
      } else {
        alert(data.error || "Hubo un error al actualizar el usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      alert("Hubo un error al actualizar los datos.");
    }
  });
});

