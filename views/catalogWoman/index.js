import { setupAdminUI } from '../components/adminCatalog.js';

// Variables globales para el carrusel de fotos del modal
let currentImages = [];
let currentImageIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar productos desde la Base de Datos
  renderProducts();

  // 2. Referencias del DOM para Modales
  const productModal = document.getElementById("product-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalImg = document.getElementById("modal-img");
  const prevBtn = document.getElementById("prev-img-btn");
  const nextBtn = document.getElementById("next-img-btn");

  const addBtn = document.getElementById("add-product-btn");
  const addProductModal = document.getElementById("add-product-modal");
  const closeAddModalBtn = document.getElementById("close-product-modal");
  const addProductForm = document.getElementById("add-product-form");
  const sizeBtns = document.querySelectorAll(".size-btn");

  // Manejo de Selección de Tallas (S, M, L)
  let selectedSizes = [];
  sizeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.size;
      if (selectedSizes.includes(size)) {
        selectedSizes = selectedSizes.filter((s) => s !== size);
        btn.classList.remove("bg-black", "text-white");
      } else {
        selectedSizes.push(size);
        btn.classList.add("bg-black", "text-white");
      }
    });
  });

  // Helper Base64 para archivos locales
  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  // Cambiar foto frontal/trasera en el Modal de Vista Previa
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

  // Controles para abrir/cerrar modal de Agregar Producto
  if (addBtn && addProductModal) {
    addBtn.addEventListener("click", () => addProductModal.classList.remove("hidden"));
  }

  if (closeAddModalBtn && addProductModal) {
    closeAddModalBtn.addEventListener("click", () => addProductModal.classList.add("hidden"));
  }

  // Enviar Formulario de Nuevo Producto (POST)
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("product-name").value;
      const price = document.getElementById("product-price").value;
      const imageUrlInput = document.getElementById("product-image-url")?.value;
      const imageFileInput = document.getElementById("product-image-file")?.files[0];

      let finalImage = imageUrlInput;
      if (imageFileInput) {
        finalImage = await fileToBase64(imageFileInput);
      }

      if (!finalImage) {
        alert("Please provide an image URL or upload a file.");
        return;
      }

      const category = window.location.pathname.includes("catalogWoman") ? "woman" : "man";

      try {
        await axios.post(
          "/api/products",
          {
            title: name,
            price: Number(price),
            image: finalImage,
            category,
            sizes: selectedSizes,
            description: "High quality apparel."
          },
          { withCredentials: true }
        );

        alert("Product added successfully!");
        addProductModal.classList.add("hidden");
        addProductForm.reset();
        
        selectedSizes = [];
        sizeBtns.forEach((btn) => btn.classList.remove("bg-black", "text-white"));

        renderProducts(); // Recarga la lista dinámicamente sin necesidad de f5
      } catch (error) {
        console.error(error);
        alert("Error saving the product");
      }
    });
  }
});

// --- RENDERIZADO DINÁMICO DE PRODUCTOS DESDE EL BACKEND ---
async function renderProducts() {
  const container = document.getElementById("products-container");
  if (!container) return;

  const category = window.location.pathname.includes("catalogWoman") ? "woman" : "man";

  try {
    const response = await axios.get(`/api/products?category=${category}`);
    const products = response.data;

    container.innerHTML = products.map(product => `
      <li class="relative group">
        <button 
          class="delete-btn hidden absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center z-20 font-bold text-xs hover:bg-red-700" 
          data-id="${product._id}">
          &times;
        </button>

        <a href="#"
           class="product-card block overflow-hidden"
           data-id="${product._id}"
           data-title="${product.title}"
           data-price="$${product.price}"
           data-image="${product.image}"
           data-image-back="${product.imageBack || product.image}"
           data-description="${product.description || 'Product description.'}">
          
          <img
            src="${product.image}"
            alt="${product.title}"
            class="h-87.5 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-112.5"
          />

          <div class="relative bg-white pt-3">
            <h3 class="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
              ${product.title}
            </h3>

            <p class="mt-2">
              <span class="sr-only">Regular Price</span>
              <span class="tracking-wider text-gray-900">$${product.price}</span>
            </p>
          </div>
        </a>
      </li>
    `).join("");

    setupAdminUI();
    attachCardEvents();

  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

// Re-conectar eventos de clic en las tarjetas de productos renderizadas
function attachCardEvents() {
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) return;

      e.preventDefault();
      const title = card.dataset.title;
      const price = card.dataset.price;
      const frontImg = card.dataset.image;
      const backImg = card.dataset.imageBack || frontImg;
      const description = card.dataset.description;

      const modalImg = document.getElementById("modal-img");
      const modalTitle = document.getElementById("modal-title");
      const modalPrice = document.getElementById("modal-price");
      const modalDescription = document.getElementById("modal-description");
      const productModal = document.getElementById("product-modal");

      currentImages = [frontImg, backImg];
      currentImageIndex = 0;

      if (modalImg) modalImg.src = frontImg;
      if (modalTitle) modalTitle.textContent = title;
      if (modalPrice) modalPrice.textContent = price;
      if (modalDescription) modalDescription.textContent = description;

      if (productModal) productModal.classList.remove("hidden");
    });
  });
}

// --- DELEGACIÓN DE EVENTOS DE ELIMINACIÓN ---
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const productId = e.target.getAttribute("data-id");

    if (confirm("Do you really want to delete this product?")) {
      try {
        await axios.delete(`/api/products/${productId}`, { withCredentials: true });
        alert("Product deleted.");
        renderProducts(); // Vuelve a pintar los productos en tiempo real sin recargar
      } catch (error) {
        console.error(error);
        alert("Failed to delete product.");
      }
    }
  }
});