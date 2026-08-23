document.addEventListener('DOMContentLoaded', () => {
  // 1. Manejo de clics en toda la página (Delegación de eventos)
  document.addEventListener('click', (e) => {
    // Verificamos si el elemento cliqueado es el botón de admin
    const adminBtn = e.target.closest('#admin-portal-link');

    if (adminBtn) {
      e.preventDefault();
      const adminModal = document.getElementById('admin-modal');
      if (adminModal) {
        adminModal.classList.remove('hidden');
      }
    }

    // Verificamos si el elemento cliqueado es el botón de cerrar la X del modal
    const closeBtn = e.target.closest('#close-admin-modal');
    if (closeBtn) {
      const adminModal = document.getElementById('admin-modal');
      if (adminModal) {
        adminModal.classList.add('hidden');
      }
    }
  });

  // 2. Cerrar el modal si hacen clic en el fondo oscuro
  window.addEventListener('click', (e) => {
    const adminModal = document.getElementById('admin-modal');
    if (e.target === adminModal) {
      adminModal.classList.add('hidden');
    }
  });

  // 3. Manejador del formulario de Admin
  const adminForm = document.getElementById('admin-login-form') || document.getElementById('admin-modal-form');
  const errorText = document.getElementById('admin-error-text');

  if (adminForm) {
    adminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (errorText) errorText.textContent = '';
      
      const email = document.getElementById('admin-email')?.value;
      const password = document.getElementById('admin-password')?.value;

      if (!email || !password) {
        if (errorText) errorText.textContent = 'Please enter email and password.';
        return;
      }

      try {
        const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
        
        if (response.data?.user?.role === 'admin' || response.data?.role === 'admin') {
          localStorage.setItem('isAdmin', 'true');
          alert('Admin mode activated.');
          window.location.href = '/catalogMan'; 
        } else {
          localStorage.removeItem('isAdmin');
          if (errorText) {
            errorText.textContent = 'Logged in successfully, but this account is not an admin.';
          } else {
            alert('Logged in successfully, but this account is not an admin.');
          }
        }
      } catch (error) {
        console.error('Admin login error:', error);
        const msg = error.response?.data?.error || 'Incorrect email or password';
        if (errorText) {
          errorText.textContent = msg;
        } else {
          alert(msg);
        }
      }
    });
  }
});