document.addEventListener("DOMContentLoaded", async () => {
  const profileDropdown = document.getElementById("profile-dropdown");

  try {
    const res = await axios.get("/api/users/me", { withCredentials: true });

    if (res.data && profileDropdown) {
      // Mostramos el menú con el botón de Logout
      profileDropdown.innerHTML = `
        <div class="px-4 py-2 border-b border-gray-200">
          <p class="text-xs text-gray-500">Current session:</p>
          <p class="text-xs sm:text-sm font-bold text-gray-800 truncate">${res.data.name || 'Usuario'}</p>
        </div>
        <button id="logout-btn" class="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 font-semibold transition-colors cursor-pointer">
          Log out
        </button>
      `;

      // ASIGNAMOS EL EVENTO AL BOTÓN DE LOGOUT
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            // Llamamos a la API para borrar la cookie
            await axios.get("/api/logout", { withCredentials: true });
            
            // Redirigimos al usuario al login
            window.location.href = "/login/";
          } catch (err) {
            console.error("Error al intentar cerrar sesión:", err);
          }
        });
      }
    }
  } catch (error) {
    // no hay sesion, se deja los enlaces de login y signup
    if (profileDropdown) {
      profileDropdown.innerHTML = `
        <a href="/login/" class="block px-4 py-2 text-xs sm:text-sm text-gray-800 hover:bg-gray-100 font-semibold transition-colors">
          Log In
        </a>
        <a href="/signup/" class="block px-4 py-2 text-xs sm:text-sm text-gray-800 hover:bg-gray-100 font-semibold transition-colors">
          Sign Up
        </a>
      `;
    }
  }
});