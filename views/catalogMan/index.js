import { setupAdminUI, getDeleteButtonHTML } from '../components/adminCatalog.js';

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mostrar u ocultar controles de Admin
  setupAdminUI();

  // 2. Referencias a los elementos del DOM (Modal de Detalle)
  const productModal = document.getElementById("product-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");
  const prevBtn = document.getElementById("prev-img-btn");
  const nextBtn = document.getElementById("next-img-btn");

  // Referencias a elementos del Modal de Agregar Producto (Admin)
  const addBtn = document.getElementById("add-product-btn");
  const addProductModal = document.getElementById("add-product-modal");
  const closeAddModalBtn = document.getElementById("close-product-modal");
  const addProductForm = document.getElementById("add-product-form");

  // Control de imágenes del modal de vista previa
  let currentImages = [];
  let currentImageIndex = 0;

  // Abrir vista previa del producto (Modal de lectura)
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Evitar que abra la vista previa si el clic fue en el botón de eliminar
      if (e.target.classList.contains("delete-btn")) return;

      e.preventDefault();
      const title = card.dataset.title;
      const price = card.dataset.price;
      const frontImg = card.dataset.image;
      const backImg = card.dataset.imageBack || frontImg;
      const description = card.dataset.description;

      currentImages = [frontImg, backImg];
      currentImageIndex = 0;

      if (modalImg) modalImg.src = currentImages[currentImageIndex];
      if (modalTitle) modalTitle.textContent = title;
      if (modalPrice) modalPrice.textContent = price;
      if (modalDescription) modalDescription.textContent = description || "High quality apparel.";

      if (productModal) productModal.classList.remove("hidden");
    });
  });

  // Cambiar foto frontal/trasera en el modal
  function toggleImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = currentImageIndex === 0 ? 1 : 0;
    if (modalImg) modalImg.src = currentImages[currentImageIndex];
  }

  if (prevBtn) prevBtn.addEventListener("click", toggleImage);
  if (nextBtn) nextBtn.addEventListener("click", toggleImage);

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => productModal.classList.add("hidden"));
  }

  // --- LÓGICA DE ADMINISTRACIÓN (CREAR PRODUCTO) ---

  // Abrir Modal Agregar Producto
  if (addBtn && addProductModal) {
    addBtn.addEventListener("click", () => addProductModal.classList.remove("hidden"));
  }

  // Cerrar Modal Agregar Producto
  if (closeAddModalBtn && addProductModal) {
    closeAddModalBtn.addEventListener("click", () => addProductModal.classList.add("hidden"));
  }

  // Enviar formulario de nuevo producto
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("product-name").value;
      const price = document.getElementById("product-price").value;
      const image = document.getElementById("product-image").value;
      const category = document.getElementById("product-category").value;

      try {
        await axios.post("/api/products", { name, price, image, category }, { withCredentials: true });
        alert("!");
        addProductModal.classList.add("hidden");
        addProductForm.reset();
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Fail in delete process.");
      }
    });
  }
});

// --- LÓGICA DE ELIMINACIÓN (Delegación de Eventos) ---
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = e.target.getAttribute("data-id");

    if (confirm("You really want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${productId}`, { withCredentials: true });
        alert("Producto eliminado.");
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Fail in delete process.");
      }
    }
  }
});