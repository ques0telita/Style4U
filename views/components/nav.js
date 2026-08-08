document.addEventListener("DOMContentLoaded", async () => {
  const profileDropdown = document.getElementById("profile-dropdown");
  

  // 1. VERIFICAR SI EL USUARIO HA INICIADO SESIÓN
  try {
    // Consulta a la API para ver si hay una sesión activa/cookie de sesión
    const res = await axios.get("/api/users/me"); // O la ruta de tu backend que retorna el usuario actual

    if (res.data && profileDropdown) {
      // 🟢 EL USUARIO ESTÁ LOGUEADO: Mostrar botón de Logout
      profileDropdown.innerHTML = `
        <div class="px-4 py-2 border-b border-gray-200">
          <p class="text-xs text-gray-500">Logged in as</p>
          <p class="text-xs sm:text-sm font-bold text-gray-800 truncate">${res.data.email || 'User'}</p>
        </div>
        <button id="logout-btn" class="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-gray-100 font-semibold transition-colors cursor-pointer">
          Logout
        </button>
      `;

      // Escuchar el clic en Logout
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
          try {
            await axios.get("/api/logout"); // Ejecuta tu ruta de logout que limpia la cookie
            window.location.href = "/login/"; // Redirige al login tras cerrar sesión
          } catch (error) {
            console.error("Error al cerrar sesión:", error);
          }
        });
      }
    }
  } catch (error) {
    // 🔴 NO HAY SESIÓN ACTIVA: Mantener Log In y Sign Up
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