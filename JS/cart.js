function readCart() {
  try {
    return JSON.parse(localStorage.getItem("shoesZoneCart")) || [];
  } catch (error) {
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cart = readCart();

  updateCartCount();

  if (document.getElementById("cart-items-body")) {
    renderCartPage(cart);
  }

  if (document.getElementById("checkout-items")) {
    renderCheckoutPage(cart);
  }
});

function updateCartCount() {
  const cart = readCart();
  const totalCount = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
  }
}

function renderCartPage(cart) {
  const cartItemsBody = document.getElementById("cart-items-body");
  const emptyCartMsg = document.getElementById("empty-cart-msg");
  const cartTableWrapper = document.getElementById("cart-table-wrapper");
  const orderSummaryBox = document.getElementById("order-summary-box");

  const subTotalEl = document.getElementById("sub-total");
  const grandTotalEl = document.getElementById("grand-total");

  if (!cartItemsBody || !subTotalEl || !grandTotalEl) return;

  if (cart.length === 0) {
    if (cartTableWrapper) cartTableWrapper.classList.add("d-none");
    if (orderSummaryBox) orderSummaryBox.classList.add("d-none");
    if (emptyCartMsg) emptyCartMsg.classList.remove("d-none");
    return;
  }

  if (cartTableWrapper) cartTableWrapper.classList.remove("d-none");
  if (orderSummaryBox) orderSummaryBox.classList.remove("d-none");
  if (emptyCartMsg) emptyCartMsg.classList.add("d-none");

  let html = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = Number(item.price || 0) * Number(item.quantity || 0);
    subtotal += itemTotal;

    html += `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image || "https://via.placeholder.com/60"}" alt="${item.name || "Sản phẩm"}" style="width: 60px; height: 60px; object-fit: cover;" class="rounded">
            <div>
              <h6 class="fw-bold mb-0">${item.name || "Sản phẩm"}</h6>
            </div>
          </div>
        </td>
        <td><span class="badge bg-secondary">${item.size || "40"}</span></td>
        <td>${Number(item.price || 0).toLocaleString("vi-VN")} đ</td>
        <td>
          <div class="input-group input-group-sm" style="width: 100px;">
            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
            <input type="text" class="form-control text-center" value="${item.quantity || 1}" readonly>
            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </td>
        <td class="fw-bold text-danger">${itemTotal.toLocaleString("vi-VN")} đ</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  cartItemsBody.innerHTML = html;
  subTotalEl.textContent = subtotal.toLocaleString("vi-VN") + " đ";
  grandTotalEl.textContent = subtotal.toLocaleString("vi-VN") + " đ";
}

window.updateQuantity = function (index, change) {
  const cart = readCart();
  if (!cart[index]) return;

  cart[index].quantity = Number(cart[index].quantity || 0) + change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("shoesZoneCart", JSON.stringify(cart));
  updateCartCount();
  renderCartPage(cart);
};

window.removeItem = function (index) {
  const cart = readCart();
  cart.splice(index, 1);
  localStorage.setItem("shoesZoneCart", JSON.stringify(cart));
  updateCartCount();
  renderCartPage(cart);
};

function renderCheckoutPage(cart) {
  const checkoutItemsContainer = document.getElementById("checkout-items");
  const checkoutSubtotal = document.getElementById("checkout-subtotal");
  const checkoutTotal = document.getElementById("checkout-total");
  const checkoutForm = document.getElementById("checkoutForm");

  if (!checkoutItemsContainer || !checkoutSubtotal || !checkoutTotal) return;

  if (cart.length === 0) {
    alert("Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán!");
    window.location.href = "products.html";
    return;
  }

  let html = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = Number(item.price || 0) * Number(item.quantity || 0);
    subtotal += itemTotal;

    html += `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <img src="${item.image || "https://via.placeholder.com/50"}" alt="${item.name || "Sản phẩm"}" style="width: 50px; height: 50px; object-fit: cover;" class="rounded">
          <div>
            <h6 class="mb-0 fw-semibold" style="font-size: 14px;">${item.name || "Sản phẩm"}</h6>
            <small class="text-muted">Size: ${item.size || "40"} | SL: ${item.quantity || 1}</small>
          </div>
        </div>
        <span class="fw-semibold">${itemTotal.toLocaleString("vi-VN")} đ</span>
      </div>
    `;
  });

  checkoutItemsContainer.innerHTML = html;
  checkoutSubtotal.textContent = subtotal.toLocaleString("vi-VN") + " đ";
  checkoutTotal.textContent = subtotal.toLocaleString("vi-VN") + " đ";

  if (checkoutForm) {
    checkoutForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const nameInput = document.getElementById("customerName");
      const phoneInput = document.getElementById("customerPhone");
      const addressInput = document.getElementById("customerAddress");

      const name = nameInput ? nameInput.value.trim() : "";
      const phone = phoneInput ? phoneInput.value.trim() : "";
      const address = addressInput ? addressInput.value.trim() : "";

      if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng trước khi đặt hàng!");
        return;
      }

      alert(`Cảm ơn bạn ${name} đã đặt hàng thành công tại Shoes Zone!\nĐơn hàng sẽ được giao đến: ${address}`);
      localStorage.removeItem("shoesZoneCart");
      window.location.href = "index.html";
    });
  }
}