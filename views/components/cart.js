document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos
  const cartBtn = document.getElementById("cart-btn");
  const cartDropdown = document.getElementById("cart-dropdown");
  const profileBtn = document.getElementById("profile-btn");
  const profileDropdown = document.getElementById("profile-dropdown");

  // Referencias internas del carrito
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Referencias del Modal
  const productModal = document.getElementById("product-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  const prevImgBtn = document.getElementById("prev-img-btn");
  const nextImgBtn = document.getElementById("next-img-btn");

  // 💾 ESTADO PERSISTENTE: Cargar del localStorage si existe
  let cart = JSON.parse(localStorage.getItem("style4u_cart")) || [];
  let currentImages = [];
  let currentImageIndex = 0;
  let selectedSize = "S";
  let currentProductData = {};

  // Función auxiliar para guardar en LocalStorage
  function saveCart() {
    localStorage.setItem("style4u_cart", JSON.stringify(cart));
  }

  // 1. Abrir/Cerrar Carrito y Perfil
  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (profileDropdown) profileDropdown.classList.add("hidden");
      cartDropdown.classList.toggle("hidden");
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (cartDropdown) cartDropdown.classList.add("hidden");
      profileDropdown.classList.toggle("hidden");
    });
  }

  document.addEventListener("click", (e) => {
    if (cartDropdown && !cartDropdown.contains(e.target) && e.target !== cartBtn) {
      cartDropdown.classList.add("hidden");
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.add("hidden");
    }
  });

  // 2. Modal de Producto
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();

      const title = card.dataset.title || "Product";
      const price = card.dataset.price || "$0.00";
      const frontImg = card.dataset.image;
      const backImg = card.dataset.imageBack || frontImg;
      const description = card.dataset.description || "No description available.";

      currentProductData = { title, price, frontImg };
      currentImages = [frontImg, backImg];
      currentImageIndex = 0;

      if (modalImg) modalImg.src = currentImages[currentImageIndex];
      if (modalTitle) modalTitle.textContent = title;
      if (modalPrice) modalPrice.textContent = price;
      if (modalDescription) modalDescription.textContent = description;

      setupSizeSelectors();

      if (productModal) productModal.classList.remove("hidden");
    });
  });

  const toggleImage = () => {
    if (currentImages.length <= 1) return;
    currentImageIndex = currentImageIndex === 0 ? 1 : 0;
    if (modalImg) modalImg.src = currentImages[currentImageIndex];
  };

  if (prevImgBtn) prevImgBtn.addEventListener("click", toggleImage);
  if (nextImgBtn) nextImgBtn.addEventListener("click", toggleImage);

  function setupSizeSelectors() {
    if (!productModal) return;
    const sizeButtons = Array.from(productModal.querySelectorAll("button")).filter(btn => 
      ["S", "M", "L", "XL"].includes(btn.textContent.trim())
    );

    sizeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        sizeButtons.forEach(b => b.classList.remove("bg-black", "text-white"));
        btn.classList.add("bg-black", "text-white");
        selectedSize = btn.textContent.trim();
      });
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => productModal.classList.add("hidden"));
  }

  // 3. Agregar al Carrito
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const existingIndex = cart.findIndex(
        item => item.title === currentProductData.title && item.size === selectedSize
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          title: currentProductData.title,
          price: currentProductData.price,
          image: currentProductData.frontImg,
          size: selectedSize,
          quantity: 1
        });
      }

      saveCart(); // 👈 Guardamos el cambio
      updateCartUI();

      if (productModal) productModal.classList.add("hidden");
      if (cartDropdown) cartDropdown.classList.remove("hidden");
    });
  }

  // 4. Renderizar Carrito
  function updateCartUI() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-xs sm:text-sm text-gray-500 text-center py-4">Your cart is empty.</p>`;
      if (cartTotal) cartTotal.textContent = "$0.00";
      return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="flex items-center gap-3 border-b border-gray-100 pb-2">
        <img src="${item.image}" alt="${item.title}" class="size-12 rounded-lg object-cover" />

        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-bold text-gray-900 truncate">${item.title}</h4>
          <p class="text-[11px] text-gray-500">Size: <span class="font-semibold text-gray-700">${item.size}</span> | ${item.price}</p>
          <p class="text-[11px] text-gray-700 font-medium">Qty: ${item.quantity}</p>
        </div>

        <button data-index="${index}" class="remove-cart-item text-gray-400 hover:text-red-500 transition-colors p-1">
          <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    `).join('');

    const total = cart.reduce((sum, item) => {
      const numPrice = parseFloat(item.price.replace("$", "")) || 0;
      return sum + (numPrice * item.quantity);
    }, 0);

    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;

    // Escuchar eliminar ítems
    const removeBtns = cartItemsContainer.querySelectorAll(".remove-cart-item");
    removeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const index = e.currentTarget.dataset.index;
        cart.splice(index, 1);
        saveCart(); // 👈 Actualizamos el storage al eliminar
        updateCartUI();
      });
    });
  }

  // 🚀 CARGA INICIAL: Dibujar los productos guardados al abrir la página
  updateCartUI();
});