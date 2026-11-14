document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      id: 1,
      name: "Shoes Zone Running Pro",
      desc: "Giày chạy bộ thoáng khí",
      price: 1250000,
      image: "assets/Running shoes.avif",
      badge: "HOT",
    },
    {
      id: 2,
      name: "Sneaker Streetwear Red",
      desc: "Phong cách năng động",
      price: 990000,
      image: "https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mokqa2092gb3ad",
      badge: "",
    },
    {
      id: 3,
      name: "Basketball Star High",
      desc: "Giày bóng rổ cổ cao",
      price: 1480000,
      image: "https://static.ftshp.digital/img/p/5/5/6/4/1/7/556417-thickbox.jpg",
      badge: "-20%",
    },
    {
      id: 4,
      name: "Daily Walk Classic",
      desc: "Giày đi học, đi làm êm chân",
      price: 750000,
      image: "assets/Daily Walk Classic.png",
      badge: "",
    },
  ];

  updateCartCount();
  renderProducts(products);
});

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderProducts(productsArray) {
  const productListContainer = document.getElementById("product-list");
  if (!productListContainer) return;

  const html = productsArray
    .map((product) => {
      const badgeClass = product.badge === "-20%" ? "bg-warning text-dark" : "bg-danger";
      const safeName = escapeHtml(product.name);
      const safeDesc = escapeHtml(product.desc);
      const safeImage = escapeHtml(product.image);

      return `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="card h-100 border-0 shadow-sm rounded-3 overflow-hidden position-relative">
            ${product.badge ? `<span class="badge ${badgeClass} position-absolute top-0 start-0 m-2" style="z-index: 2;">${product.badge}</span>` : ""}
            <img src="${safeImage}" class="card-img-top bg-light p-3" alt="${safeName}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title h6 fw-bold">${safeName}</h5>
              <p class="text-secondary small mb-2">${safeDesc}</p>

              <div class="mb-3 mt-auto">
                <label class="form-label small text-muted mb-1">Chọn Size:</label>
                <select class="form-select form-select-sm size-select" id="size-${product.id}">
                  <option value="39">Size 39</option>
                  <option value="40" selected>Size 40</option>
                  <option value="41">Size 41</option>
                  <option value="42">Size 42</option>
                </select>
              </div>

              <div class="mt-auto">
                <div class="fw-bold text-danger mb-2">${product.price.toLocaleString("vi-VN")} đ</div>
                <button class="btn btn-outline-danger w-100 btn-sm add-to-cart-btn" data-id="${product.id}" data-name="${encodeURIComponent(product.name)}" data-price="${product.price}" data-image="${encodeURIComponent(product.image)}">
                  <i class="fa-solid fa-cart-plus me-1"></i>Thêm giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");

  productListContainer.innerHTML = html;

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      const name = decodeURIComponent(button.dataset.name || "");
      const price = Number(button.dataset.price || 0);
      const image = decodeURIComponent(button.dataset.image || "");
      addToCart(id, name, price, image);
    });
  });
}

window.addToCart = function (id, name, price, image) {
  const sizeSelect = document.getElementById(`size-${id}`);
  const selectedSize = sizeSelect ? sizeSelect.value : "40";

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("shoesZoneCart")) || [];
  } catch (error) {
    cart = [];
  }

  const existingIndex = cart.findIndex((item) => item.id === id && item.size === selectedSize);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      size: selectedSize,
      quantity: 1,
    });
  }

  localStorage.setItem("shoesZoneCart", JSON.stringify(cart));
  updateCartCount();

  alert(`Đã thêm "${name}" (Size ${selectedSize}) vào giỏ hàng thành công!`);
};

function updateCartCount() {
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem("shoesZoneCart")) || [];
  } catch (error) {
    cart = [];
  }

  const totalCount = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = totalCount;
  }
}