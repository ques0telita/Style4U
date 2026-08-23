document.addEventListener("DOMContentLoaded", async () => {
  const profileDropdown = document.getElementById("profile-dropdown");

  try {
    const res = await axios.get("/api/users/me", { withCredentials: true });

    if (res.data && profileDropdown) {
      const user = res.data;
      const isAdminUser = user.role === 'admin';
      
      if (isAdminUser) {
        localStorage.setItem('isAdmin', 'true');
      } else {
        localStorage.removeItem('isAdmin');
      }

      // Re-evaluar UI de admin si existe el script de adminCatalog
      const addBtn = document.getElementById('add-product-btn');
      if (addBtn) {
        if (isAdminUser) addBtn.classList.remove('hidden');
        else addBtn.classList.add('hidden');
      }
      const deleteBtns = document.querySelectorAll('.delete-btn');
      deleteBtns.forEach(b => {
        if (isAdminUser) b.classList.remove('hidden');
        else b.classList.add('hidden');
      });

      // Mostramos el menú con el botón de Logout
      profileDropdown.innerHTML = `
        <div class="px-4 py-2 border-b border-gray-200">
          <p class="text-xs text-gray-500">Current session:</p>
          <p class="text-xs sm:text-sm font-bold text-gray-800 truncate">
            ${user.name || 'User'} ${isAdminUser ? '<span class="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold ml-1">ADMIN</span>' : ''}
          </p>
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

            // Limpiar estado en localStorage
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("style4u_cart");

            // Recargamos la página
            window.location.reload();
          } catch (err) {
            console.error("Error al intentar cerrar sesión:", err);
          }
        });
      }
    }
  } catch (error) {
    // No hay sesión
    localStorage.removeItem("isAdmin");
    if (profileDropdown) {
      profileDropdown.innerHTML = `
        <a href="/login" class="block px-4 py-2 text-xs sm:text-sm text-gray-800 hover:bg-gray-100 font-semibold transition-colors">
          Log In
        </a>
        <a href="/signup" class="block px-4 py-2 text-xs sm:text-sm text-gray-800 hover:bg-gray-100 font-semibold transition-colors">
          Sign Up
        </a>
      `;
    }
  }
});
