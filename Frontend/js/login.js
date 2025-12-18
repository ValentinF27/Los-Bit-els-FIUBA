import { initAuthUI } from "./auth.js";

export async function login(nickname, password) {
  try {
    // Llamamos al backend con POST al endpoint de login.
    const res = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, password })
    });

    // Si la respuesta no es OK (404 o 401) mostramos error.
    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error); // muestra "Usuario no encontrado" o "Contraseña incorrecta"
      return;
    }

    // Si es OK, recibimos el JSON con los datos del usuario.
    const usuario = await res.json();

    // Guardamos el usuario en localStorage para mantener "sesión".
    localStorage.setItem("usuarioLogueado", JSON.stringify(usuario));

    // Actualizamos la UI sin refrescar.
    initAuthUI();

    // Redirigimos usando el id.
    window.location.href = `./usuario.html?id=${usuario.id}`;

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert("Hubo un error al conectarse al servidor.");
  }
}

