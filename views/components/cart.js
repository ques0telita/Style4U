document.addEventListener("DOMContentLoaded", function () {
  // Variables globales del carrito y estado
  let cart = [];
  let currentImages = [];
  let currentImageIndex = 0;
  let selectedSize = "S";
  let currentProductData = {};

  // Cargar carrito desde LocalStorage
  try {
    let storedCart = localStorage.getItem("style4u_cart");
    if (storedCart) {
      cart = JSON.parse(storedCart);
    }
  } catch (e) {
    console.warn("Could not parse localStorage cart:", e);
    cart = [];
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

  // Helper para parsear precios de forma segura
  function parsePrice(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const clean = String(price).replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  // Función para guardar en LocalStorage y sincronizar con backend si logueado
  function saveCartToStorage() {
    try {
      localStorage.setItem("style4u_cart", JSON.stringify(cart));
      // Intentar guardar en backend en segundo plano si hay sesión
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items: cart })
      }).catch(() => {});
    } catch (e) {
      console.warn("Error saving cart:", e);
    }
  }

  // Función para mostrar los productos en el carrito
  function renderCart() {
    if (!cartItemsContainer) return;

    if (!Array.isArray(cart) || cart.length === 0) {
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
      let priceNumber = parsePrice(item.price);
      let qty = Number(item.quantity) || 1;
      totalAccumulated += (priceNumber * qty);

      const formattedPrice = typeof item.price === 'string' && item.price.includes('$') 
        ? item.price 
        : `$${priceNumber.toFixed(2)}`;

      htmlContent += `
        <div class="flex items-center gap-3 border-b border-gray-100 pb-2">
          <img src="${item.image || '/media/LogoStyle4U.svg'}" alt="${item.title || 'Product'}" class="size-12 rounded-lg object-cover" />
          <div class="flex-1 min-w-0">
            <h4 class="text-xs font-bold text-gray-900 truncate">${item.title || 'Product'}</h4>
            <p class="text-[11px] text-gray-500">Size: <span class="font-semibold text-gray-700">${item.size || 'S'}</span> | ${formattedPrice}</p>
            <p class="text-[11px] text-gray-700 font-medium">Qty: ${qty}</p>
          </div>
          <button data-index="${i}" class="remove-cart-item text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer font-bold">
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
        const itemIndex = parseInt(event.currentTarget.getAttribute("data-index"), 10);
        if (!isNaN(itemIndex) && itemIndex >= 0 && itemIndex < cart.length) {
          cart.splice(itemIndex, 1);
          saveCartToStorage();
          renderCart();
        }
      });
    });
  }

  // Verificar autenticación y cargar carrito
  async function checkAuthAndRenderCart() {
    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.cart) && data.cart.length > 0) {
          cart = data.cart;
          saveCartToStorage();
        }
      }
      renderCart();
    } catch (err) {
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

  // Validar botón de checkout en todos los dropdowns
  document.addEventListener("click", function (e) {
    const checkoutLink = e.target.closest('#cart-dropdown a[href="/checkout"], #cart-dropdown .checkout-link');
    if (checkoutLink) {
      if (!cart || cart.length === 0) {
        e.preventDefault();
        alert("The cart is empty. Add at least 1 product before checking out.");
      }
    }
  });

  // Delegación global para abrir el Modal de Producto al hacer clic en cualquier .product-card
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn") || e.target.closest(".delete-btn")) return;
    
    const card = e.target.closest(".product-card");
    if (!card) return;
    e.preventDefault();

    const title = card.dataset.title || "Product";
    const price = card.dataset.price || "$0.00";
    const frontImg = card.dataset.image || "";
    const backImg = card.dataset.imageBack || frontImg;
    const description = card.dataset.description || "High quality apparel.";

    currentProductData = {
      title: title,
      price: price,
      frontImg: frontImg
    };

    currentImages = [frontImg, backImg].filter(Boolean);
    currentImageIndex = 0;

    if (modalImg) modalImg.src = currentImages[0] || "";
    if (modalTitle) modalTitle.textContent = title;
    if (modalPrice) modalPrice.textContent = typeof price === 'number' ? `$${price.toFixed(2)}` : price;
    if (modalDescription) modalDescription.textContent = description;

    selectedSize = "S";
    setupSizeButtons();

    if (productModal) {
      productModal.classList.remove("hidden");
    }
  });

  // Cambiar imagen en el modal
  function changeImage() {
    if (currentImages.length > 1) {
      currentImageIndex = currentImageIndex === 0 ? 1 : 0;
      if (modalImg && currentImages[currentImageIndex]) {
        modalImg.src = currentImages[currentImageIndex];
      }
    }
  }

  if (prevImgBtn) prevImgBtn.addEventListener("click", changeImage);
  if (nextImgBtn) nextImgBtn.addEventListener("click", changeImage);

  // Manejar selección de tallas en el modal
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
      const sizeText = btn.textContent.trim();
      if (sizeText === selectedSize) {
        btn.classList.add("bg-black", "text-white");
        btn.classList.remove("bg-white", "text-black");
      } else {
        btn.classList.remove("bg-black", "text-white");
        btn.classList.add("bg-white", "text-black");
      }

      // Reasignar onclick limpio
      btn.onclick = function () {
        sizeButtons.forEach(function (b) {
          b.classList.remove("bg-black", "text-white");
          b.classList.add("bg-white", "text-black");
        });
        btn.classList.add("bg-black", "text-white");
        btn.classList.remove("bg-white", "text-black");
        selectedSize = sizeText;
      };
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

  // Agregar producto al carrito desde el Modal
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {
      if (!currentProductData.title) return;

      let foundIndex = -1;
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title === currentProductData.title && cart[i].size === selectedSize) {
          foundIndex = i;
          break;
        }
      }

      if (foundIndex > -1) {
        cart[foundIndex].quantity = (Number(cart[foundIndex].quantity) || 1) + 1;
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