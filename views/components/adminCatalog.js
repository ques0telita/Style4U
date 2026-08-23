// Verifica si el usuario actual es admin
export const isAdmin = () => localStorage.getItem('isAdmin') === 'true';

// Muestra u oculta los controles de admin (botón agregar y botones eliminar) según el rol
export const setupAdminUI = () => {
  const adminActive = isAdmin();
  
  const addBtn = document.getElementById('add-product-btn');
  if (addBtn) {
    if (adminActive) {
      addBtn.classList.remove('hidden');
    } else {
      addBtn.classList.add('hidden');
    }
  }

  const deleteBtns = document.querySelectorAll('.delete-btn');
  deleteBtns.forEach(btn => {
    if (adminActive) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });
};

// Genera el botón de eliminar para cada tarjeta si es admin
export const getDeleteButtonHTML = (productId) => {
  const isHidden = !isAdmin() ? 'hidden' : '';
  return `
    <button 
      class="delete-btn ${isHidden} absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-20 font-bold text-xs hover:bg-red-700 transition cursor-pointer shadow-md" 
      data-id="${productId}"
      title="Delete product">
      &times;
    </button>
  `;
};