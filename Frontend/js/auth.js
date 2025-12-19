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

  const profileBtn = document.getElementById("profile-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");

  if (usuario) {
    // Usuario logueado
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "none";
    if (signupBtn) signupBtn.style.display = "none";
    if (profileBtn) {
      profileBtn.style.display = "inline-block";
      // Redirigir al perfil del usuario
      profileBtn.href = `usuario.html?id=${usuario.id}`;
    }
  } else {
    // Usuario NO logueado
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (signupBtn) signupBtn.style.display = "inline-block";
    if (profileBtn) profileBtn.style.display = "none";
  }
}


