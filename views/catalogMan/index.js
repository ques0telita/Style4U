document.addEventListener("DOMContentLoaded", () => {
  const productModal = document.getElementById("product-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");

  const prevBtn = document.getElementById("prev-img-btn");
  const nextBtn = document.getElementById("next-img-btn");

  // Variables para guardar las dos imágenes del producto actual
  let currentImages = [];
  let currentImageIndex = 0;

  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      const title = card.dataset.title;
      const price = card.dataset.price;
      const frontImg = card.dataset.image;
      const backImg = card.dataset.imageBack || frontImg; // Si no hay foto trasera, usa la frontal
      const description = card.dataset.description;

      // Guardamos el arreglo con las dos fotos y reiniciamos el índice a 0 (frontal)
      currentImages = [frontImg, backImg];
      currentImageIndex = 0;

      // Renderizamos la foto actual
      if (modalImg) modalImg.src = currentImages[currentImageIndex];
      if (modalTitle) modalTitle.textContent = title;
      if (modalPrice) modalPrice.textContent = price;
      if (modalDescription) modalDescription.textContent = description || "High quality apparel.";

      if (productModal) productModal.classList.remove("hidden");
    });
  });

  // Función para cambiar de imagen
  function toggleImage() {
    if (currentImages.length === 0) return;
    currentImageIndex = currentImageIndex === 0 ? 1 : 0;
    if (modalImg) modalImg.src = currentImages[currentImageIndex];
  }

  // Escuchadores para los botones de las flechas
  if (prevBtn) prevBtn.addEventListener("click", toggleImage);
  if (nextBtn) nextBtn.addEventListener("click", toggleImage);

  // Cerrar Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => productModal.classList.add("hidden"));
  }
});