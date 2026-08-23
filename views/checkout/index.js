document.addEventListener("DOMContentLoaded", function () {
  const checkoutList = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const taxesEl = document.getElementById("checkout-taxes");
  const totalEl = document.getElementById("checkout-total");
  const payBtn = document.getElementById("pay-btn");

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("style4u_cart")) || [];
  } catch (e) {
    cart = [];
  }

  function parsePrice(price) {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const clean = String(price).replace(/[^0-9.]/g, "");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  }

  function saveCart() {
    try {
      localStorage.setItem("style4u_cart", JSON.stringify(cart));
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items: cart })
      }).catch(() => {});
    } catch (e) {
      console.warn("Could not save cart:", e);
    }
  }

  function renderCheckout() {
    if (!checkoutList) return;

    if (!Array.isArray(cart) || cart.length === 0) {
      checkoutList.innerHTML = `
        <li class="py-12 text-center text-gray-500">
          <p class="text-base font-semibold mb-2">Your cart is empty.</p>
          <a href="/catalogMan" class="inline-block mt-2 text-sm text-black underline font-bold hover:text-gray-700">Explore Catalog</a>
        </li>
      `;
      if (subtotalEl) subtotalEl.textContent = "$0.00";
      if (taxesEl) taxesEl.textContent = "$0.00";
      if (totalEl) totalEl.textContent = "$0.00";
      return;
    }

    checkoutList.innerHTML = "";
    let subtotal = 0;

    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];
      let priceNumber = parsePrice(item.price);
      let qty = Number(item.quantity) || 1;
      let itemTotal = priceNumber * qty;
      subtotal += itemTotal;

      const formattedPrice = typeof item.price === 'string' && item.price.includes('$')
        ? item.price
        : `$${priceNumber.toFixed(2)}`;

      checkoutList.innerHTML += `
        <li class="flex items-center justify-between py-4 border-b border-gray-200">
          <div class="flex items-center gap-4">
            <img src="${item.image || '/media/LogoStyle4U.svg'}" alt="${item.title || 'Product'}" class="size-16 rounded-lg object-cover" />
            <div>
              <h3 class="font-bold text-gray-900 text-sm sm:text-base">${item.title || 'Product'}</h3>
              <p class="text-xs text-gray-500">Size: <span class="font-semibold text-gray-700">${item.size || 'S'}</span></p>
              <p class="text-xs text-gray-500">Price: <span class="font-semibold text-gray-700">${formattedPrice}</span></p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center border border-gray-300 shadow-sm rounded-lg px-2 py-1 gap-2 bg-white">
              <button onclick="decreaseQty(${i})" class="font-bold text-sm px-1 hover:bg-gray-100 rounded cursor-pointer">-</button>
              <span class="text-xs font-semibold px-2">${qty}</span>
              <button onclick="increaseQty(${i})" class="font-bold text-sm px-1 hover:bg-gray-100 rounded cursor-pointer">+</button>
            </div>

            <button onclick="removeItem(${i})" class="text-gray-400 hover:text-red-600 p-1 cursor-pointer transition-colors" title="Remove item">
              <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </li>
      `;
    }

    let taxes = subtotal > 0 ? subtotal * 0.10 : 0;
    let discount = subtotal > 0 ? 5 : 0;
    let total = subtotal + taxes - discount;
    if (total < 0) total = 0;

    if (subtotalEl) subtotalEl.textContent = "$" + subtotal.toFixed(2);
    if (taxesEl) taxesEl.textContent = "$" + taxes.toFixed(2);
    if (totalEl) totalEl.textContent = "$" + total.toFixed(2);
  }

  // Funciones globales para botones
  window.increaseQty = function (index) {
    if (cart[index]) {
      cart[index].quantity = (Number(cart[index].quantity) || 1) + 1;
      saveCart();
      renderCheckout();
    }
  };

  window.decreaseQty = function (index) {
    if (cart[index]) {
      if ((Number(cart[index].quantity) || 1) > 1) {
        cart[index].quantity = cart[index].quantity - 1;
      } else {
        cart.splice(index, 1);
      }
      saveCart();
      renderCheckout();
    }
  };

  window.removeItem = function (index) {
    if (cart[index]) {
      cart.splice(index, 1);
      saveCart();
      renderCheckout();
    }
  };

  // Manejador del botón de Pago
  if (payBtn) {
    payBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (!cart || cart.length === 0) {
        alert("The cart is empty. Add products before proceeding.");
        return;
      }

      alert("🎉 Thank you for your purchase! Your order has been placed successfully.");
      cart = [];
      saveCart();
      renderCheckout();

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    });
  }

  renderCheckout();
});

