document.addEventListener("DOMContentLoaded", function () {
  // 1. Capturar los elementos del HTML por su ID
  const checkoutList = document.getElementById("checkout-items-list");
  const subtotalEl = document.getElementById("checkout-subtotal");
  const taxesEl = document.getElementById("checkout-taxes");
  const totalEl = document.getElementById("checkout-total");

  // 2. Leer los datos guardados del localStorage
  let cart = JSON.parse(localStorage.getItem("style4u_cart")) || [];

  // Función sencilla para renderizar todo
  function renderCheckout() {
    // Si el carrito está vacío
    if (cart.length === 0) {
      checkoutList.innerHTML = '<li class="py-8 text-center text-gray-500">The cart is empty</li>';
      subtotalEl.textContent = "$0.00";
      taxesEl.textContent = "$0.00";
      totalEl.textContent = "$0.00";
      return;
    }

    // Limpiar el contenedor antes de dibujar
    checkoutList.innerHTML = "";

    let subtotal = 0;

    // Bucle FOR tradicional para recorrer cada producto
    for (let i = 0; i < cart.length; i++) {
      let item = cart[i];

      // Convertir el precio de texto ("$29.99") a número (29.99)
      let priceNumber = parseFloat(item.price.replace("$", ""));
      let itemTotal = priceNumber * item.quantity;
      
      // Ir sumando al subtotal acumulado
      subtotal = subtotal + itemTotal;

      // Crear la fila en HTML para este producto
      checkoutList.innerHTML += `
        <li class="flex items-center justify-between py-4 border-b border-white">
          <div class="flex items-center gap-4">
            <img src="${item.image}" alt="${item.title}" class="size-16 rounded-lg object-cover" />
            <div>
              <h3 class="font-bold text-gray-900 text-sm sm:text-base">${item.title}</h3>
              <p class="text-xs text-gray-500">Size: ${item.size}</p>
              <p class="text-xs text-gray-500">Price: ${item.price}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Botones sencillos de restar, cantidad y sumar -->
            <div class="flex items-center border border-gray-50 shadow-lg rounded-lg px-2 py-1 gap-2">
              <button onclick="decreaseQty(${i})" class="font-bold text-sm px-1 cursor-pointer">-</button>
              <span class="text-xs font-semibold px-2">${item.quantity}</span>
              <button onclick="increaseQty(${i})" class="font-bold text-sm px-1 cursor-pointer">+</button>
            </div>

            <!-- Botón de eliminar -->
            <button onclick="removeItem(${i})" class="text-black hover:text-red-500 p-1">
              <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </li>
      `;
    }

    // Calcular impuestos y total
    let taxes = subtotal * 0.10; // 10% de impuesto
    let discount = 5; // Descuento de $5
    let total = subtotal + taxes - discount;

    if (total < 0) total = 0;

    // Mostrar los resultados en la pantalla
    subtotalEl.textContent = "$" + subtotal.toFixed(2);
    taxesEl.textContent = "$" + taxes.toFixed(2);
    totalEl.textContent = "$" + total.toFixed(2);
  }

  // Funciones globales para los botones de la lista (más fácil de entender)
  window.increaseQty = function (index) {
    cart[index].quantity = cart[index].quantity + 1;
    localStorage.setItem("style4u_cart", JSON.stringify(cart));
    renderCheckout();
  };

  window.decreaseQty = function (index) {
    if (cart[index].quantity > 1) {
      cart[index].quantity = cart[index].quantity - 1;
    } else {
      cart.splice(index, 1); // Si llega a 0, se elimina
    }
    localStorage.setItem("style4u_cart", JSON.stringify(cart));
    renderCheckout();
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("style4u_cart", JSON.stringify(cart));
    renderCheckout();
  };

  // Ejecutar al cargar la página
  renderCheckout();
});

