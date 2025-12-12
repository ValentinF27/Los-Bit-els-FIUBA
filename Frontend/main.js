// main.js
document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/users/1'); // ID del usuario
  const user = await response.json();

  document.getElementById('username').textContent = user.username;
  document.getElementById('avatar').src = user.avatar;
  document.getElementById('description').textContent = user.description;
  document.getElementById('name').textContent = user.username;
  document.getElementById('email').textContent = user.email;
  document.getElementById('phone').textContent = user.phone;
  document.getElementById('location').textContent = user.location;
  document.getElementById('instruments').textContent = user.instruments;
  document.getElementById('genres').textContent = user.genres;
});

