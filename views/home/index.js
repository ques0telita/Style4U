document.addEventListener('DOMContentLoaded', () => {
  // 1. Manejo de clics en toda la página (Delegación de eventos)
  document.addEventListener('click', (e) => {
    // Verificamos si el elemento cliqueado es el botón de admin
    const adminBtn = e.target.closest('#admin-portal-link');

    if (adminBtn) {
      e.preventDefault(); // Evitamos que la página salte arriba con '#'
      
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

  // 2. Cerrar el modal si hacen clic en la zona oscura fuera del recuadro
  window.addEventListener('click', (e) => {
    const adminModal = document.getElementById('admin-modal');
    if (e.target === adminModal) {
      adminModal.classList.add('hidden');
    }
  });
});

// Manejador del submit del formulario de Admin Modal
const adminForm = document.getElementById('admin-modal-form'); // Asegúrate de que tu <form> tenga este ID

if (adminForm) {
  adminForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    try {
      const response = await axios.post('/api/login', { email, password }, { withCredentials: true });
      
      if (response.data.user && response.data.user.role === 'admin') {
        // Guardamos la bandera de admin para el frontend
        localStorage.setItem('isAdmin', 'true');
        alert('Youre now in admin mode');
        window.location.href = '/'; 
      } else {
        alert('You log in, but you dont have admin access.');
      }
    } catch (error) {
      console.error(error);
      alert('Incorrect email or password');
    }
  });
}
// Después de hacer axios.post('/api/login', ...)
if (response.data.role === 'admin' || response.data.user?.role === 'admin') {
  // 👈 Esta línea es la que falta para que aparezca en tus DevTools:
  localStorage.setItem('isAdmin', 'true'); 
  
  window.location.href = '/catalogMan/';
}