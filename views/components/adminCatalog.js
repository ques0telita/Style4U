// Verifica si el usuario actual es admin
export const isAdmin = () => localStorage.getItem('isAdmin') === 'true';

// Muestra u oculta el botón de agregar producto según el rol
export const setupAdminUI = () => {
  const addBtn = document.getElementById('add-product-btn');
  if (addBtn) {
    if (isAdmin()) {
      addBtn.classList.remove('hidden');
    } else {
      addBtn.classList.add('hidden');
    }
  }
};

// Genera el botón de eliminar para cada tarjeta si es admin
export const getDeleteButtonHTML = (productId) => {
  if (!isAdmin()) return '';
  return `
    <button 
      class="delete-product-btn bg-red-600 text-white px-2 py-1 rounded text-xs mt-2 hover:bg-red-700 transition" 
      data-id="${productId}">
      Eliminar
    </button>
  `;
};