// Cierra la sesión del usuario.
export function logout() {
  // Eliminamos el usuario del localStorage.
  localStorage.removeItem("usuarioLogueado");

  // Redirigimos al inicio.
  window.location.href = "home.html";
}

// Maneja qué botones mostrar según si hay sesión.
export function initAuthUI() {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  const logoutBtn = document.getElementById("logout-btn");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  if (usuario) {
    // Usuario loguedo
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
  } else {
    // Usuario NO logueado
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
  }
}


