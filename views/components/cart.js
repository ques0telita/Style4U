document.addEventListener("DOMContentLoaded", function () {
  // Variables globales del carrito y estado
  let cart = [];
  let currentImages = [];
  let currentImageIndex = 0;
  let selectedSize = "S";
  let currentProductData = {};

  // Cargar carrito desde LocalStorage
  let storedCart = localStorage.getItem("style4u_cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }

  // Obtener elementos del DOM
  const cartBtn = document.getElementById("cart-btn");
  const cartDropdown = document.getElementById("cart-dropdown");
  const profileBtn = document.getElementById("profile-btn");
  const profileDropdown = document.getElementById("profile-dropdown");

  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  const productModal = document.getElementById("product-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalDescription = document.getElementById("modal-description");
  const addToCartBtn = document.getElementById("add-to-cart-btn");

  const prevImgBtn = document.getElementById("prev-img-btn");
  const nextImgBtn = document.getElementById("next-img-btn");

  // Función para guardar en LocalStorage
  function saveCartToStorage() {
    localStorage.setItem("style4u_cart", JSON.stringify(cart));
  }

  // Función para mostrar los productos en el carrito
  function renderCart() {
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="text-xs sm:text-sm text-gray-500 text-center py-4">Your cart is empty.</p>';
      if (cartTotal) {
        cartTotal.textContent = "$0.00";
      }
      return;
    }

    let htmlContent = "";
    let totalAccumulated = 0;

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];
      
      // Calcular precio total
      let priceNumber = parseFloat(item.price.replace("$", ""));
      if (isNaN(priceNumber)) {
        priceNumber = 0;
      }
      totalAccumulated = totalAccumulated + (priceNumber * item.quantity);

      htmlContent += `
        <div class="flex items-center gap-3 border-b border-gray-100 pb-2">
          <img src="${item.image}" alt="${item.title}" class="size-12 rounded-lg object-cover" />
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-gray-900 truncate">${item.title}</h4>
            <p class="text-[11px] text-gray-500">Size: <span class="font-semibold text-gray-700">${item.size}</span> | ${item.price}</p>
            <p class="text-[11px] text-gray-700 font-medium">Qty: ${item.quantity}</p>
          </div>
          <button data-index="${i}" class="remove-cart-item text-gray-400 hover:text-red-500 transition-colors p-1">
            ✕
          </button>
        </div>
      `;
    }

    cartItemsContainer.innerHTML = htmlContent;

    if (cartTotal) {
      cartTotal.textContent = "$" + totalAccumulated.toFixed(2);
    }

    // Eventos para el botón de eliminar
    const removeButtons = cartItemsContainer.querySelectorAll(".remove-cart-item");
    removeButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        const itemIndex = event.currentTarget.getAttribute("data-index");
        cart.splice(itemIndex, 1);
        saveCartToStorage();
        renderCart();
      });
    });
  }

  // Verificar autenticación con la API backend
  async function checkAuthAndRenderCart() {
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json' 
        },
        credentials: 'include'
      });

      if (response.ok === false) {
        cartItemsContainer.innerHTML = `
          <div class="text-center py-6 px-2">
            <p class="text-xs text-gray-600 mb-3">You must be logged in to view or add products to your cart.</p>
            <a href="/login" class="inline-block bg-black text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Log In
            </a>
          </div>
        `;
        if (cartTotal) {
          cartTotal.textContent = "$0.00";
        }
        return;
      }

      const data = await response.json();
      if (data.cart) {
        cart = data.cart;
      }
      renderCart();

    } catch (err) {
      console.error("Error cargando carrito:", err);
      renderCart();
    }
  }

  // Ejecutar carga inicial
  checkAuthAndRenderCart();

  // Control de dropdowns (Carrito y Perfil)
  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (profileDropdown) {
        profileDropdown.classList.add("hidden");
      }
      cartDropdown.classList.toggle("hidden");
    });
  }

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (cartDropdown) {
        cartDropdown.classList.add("hidden");
      }
      profileDropdown.classList.toggle("hidden");
    });
  }

  // Cerrar dropdowns al hacer click afuera
  document.addEventListener("click", function (e) {
    if (cartDropdown && !cartDropdown.contains(e.target) && e.target !== cartBtn) {
      cartDropdown.classList.add("hidden");
    }
    if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
      profileDropdown.classList.add("hidden");
    }
  });

  // Validar botón de checkout
  const checkoutBtn = document.querySelector('#cart-dropdown a[href="/checkout"]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      if (cart.length === 0) {
        e.preventDefault();
        if (typeof createNotification === "function") {
          createNotification(true, "The cart is empty, add at least 1 product.");
        } else {
          alert("The cart is empty, add at least 1 product.");
        }
      }
    });
  }

  // Lógica del Modal de Productos
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();

      const title = card.dataset.title ? card.dataset.title : "Product";
      const price = card.dataset.price ? card.dataset.price : "$0.00";
      const frontImg = card.dataset.image;
      const backImg = card.dataset.imageBack ? card.dataset.imageBack : frontImg;
      const description = card.dataset.description ? card.dataset.description : "No description available.";

      currentProductData = {
        title: title,
        price: price,
        frontImg: frontImg
      };

      currentImages = [frontImg, backImg];
      currentImageIndex = 0;

      if (modalImg) modalImg.src = currentImages[currentImageIndex];
      if (modalTitle) modalTitle.textContent = title;
      if (modalPrice) modalPrice.textContent = price;
      if (modalDescription) modalDescription.textContent = description;

      setupSizeButtons();

      if (productModal) {
        productModal.classList.remove("hidden");
      }
    });
  });

  // Cambiar imagen en el modal
  function changeImage() {
    if (currentImages.length > 1) {
      if (currentImageIndex === 0) {
        currentImageIndex = 1;
      } else {
        currentImageIndex = 0;
      }
      if (modalImg) {
        modalImg.src = currentImages[currentImageIndex];
      }
    }
  }

  if (prevImgBtn) prevImgBtn.addEventListener("click", changeImage);
  if (nextImgBtn) nextImgBtn.addEventListener("click", changeImage);

  // Manejar selección de tallas
  function setupSizeButtons() {
    if (!productModal) return;

    const allButtons = productModal.querySelectorAll("button");
    const sizeButtons = [];

    allButtons.forEach(function (btn) {
      const text = btn.textContent.trim();
      if (text === "S" || text === "M" || text === "L" || text === "XL") {
        sizeButtons.push(btn);
      }
    });

    sizeButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        sizeButtons.forEach(function (b) {
          b.classList.remove("bg-black", "text-white");
        });
        btn.classList.add("bg-black", "text-white");
        selectedSize = btn.textContent.trim();
      });
    });
  }

  // Cerrar Modal
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      if (productModal) {
        productModal.classList.add("hidden");
      }
    });
  }

  // Agregar producto al carrito
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      let foundIndex = -1;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title === currentProductData.title && cart[i].size === selectedSize) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex > -1) {
        cart[foundIndex].quantity += 1;
      } else {
        const newItem = {
          title: currentProductData.title,
          price: currentProductData.price,
          image: currentProductData.frontImg,
          size: selectedSize,
          quantity: 1
        };
        cart.push(newItem);
      }

      saveCartToStorage();
      renderCart();

      if (productModal) {
        productModal.classList.add("hidden");
      }
      if (cartDropdown) {
        cartDropdown.classList.remove("hidden");
      }
    });
  }
});