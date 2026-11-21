"use strict";

// BƯỚC 3: File này chỉ nạp trên products.html, sau config.js và api.js.
const productList = document.querySelector("#product-list");
const productSearch = document.querySelector("#product-search");
const productStatus = document.querySelector("#product-status");
const retryButton = document.querySelector("#retry-products");
const cartMessage = document.querySelector("#cart-message");
let products = [];
let isLoading = false;

function formatPrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

// BƯỚC 4: Một object -> một card. template là khung HTML ẩn trong products.html.
function createProductCard(product) {
  const card = document.querySelector("#product-card-template").content.cloneNode(true);
  const image = card.querySelector("img");
  image.src = product.image || "Cuoikhoaweb/assets/giay_trangchu.png";
  image.alt = product.name;
  image.addEventListener("error", () => { image.src = "Cuoikhoaweb/assets/giay_trangchu.png"; }, { once: true });
  // Không ghép dữ liệu bên ngoài vào innerHTML: tên/mô tả được điền bằng textContent.
  card.querySelector(".product-title").textContent = product.name;
  card.querySelector(".product-description").textContent = product.desc;
  card.querySelector(".product-price").textContent = formatPrice(product.price);
  card.querySelector(".product-stock").textContent = `Tồn kho mẫu: ${product.stock}`;
  const select = card.querySelector(".size-select");
  select.id = `size-${product.id}`;
  card.querySelector("label").htmlFor = select.id;
  const button = card.querySelector(".add-to-cart-btn");
  button.disabled = product.stock < 1;
  button.addEventListener("click", () => addToCart(product, select.value));
  card.querySelector(".product-detail-link").href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
  return card;
}

// BƯỚC 5: Tìm trên mảng đã tải; không gọi API theo từng ký tự.
function renderProducts() {
  const keyword = productSearch.value.trim().toLowerCase();
  const result = products.filter(product => product.name.toLowerCase().includes(keyword));
  productList.replaceChildren();
  result.forEach(product => productList.append(createProductCard(product)));
  productStatus.className = "text-secondary mb-3";
  productStatus.textContent = result.length ? `Hiển thị ${result.length} mẫu giày` : "Không tìm thấy giày phù hợp.";
  // TODO HS 03: Thêm select sắp xếp giá trên mảng result, không sửa mảng products gốc.
}

// BƯỚC 6: Nối fetch -> render, có trạng thái đang tải và lỗi/thử lại.
async function loadProducts() {
  if (isLoading) return;
  isLoading = true;
  productSearch.disabled = true;
  retryButton.hidden = true;
  productList.setAttribute("aria-busy", "true");
  productStatus.className = "text-secondary mb-3";
  productStatus.textContent = "Đang tải giày...";
  try {
    products = await fetchProducts();
    renderProducts();
    productSearch.disabled = false;
  } catch (error) {
    productList.replaceChildren();
    productStatus.className = "alert alert-danger";
    productStatus.textContent = `${error.message} Hãy kiểm tra kết nối và thử lại.`;
    retryButton.hidden = false;
  } finally {
    isLoading = false;
    productList.setAttribute("aria-busy", "false");
  }
}

// Giữ luồng localStorage đã có của học sinh và cấu trúc mà JS/cart.js đang đọc.
function readProductCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("shoesZoneCart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch { return []; }
}

function updateCartCount() {
  const cart = readProductCart();
  document.querySelector("#cart-count").textContent = cart.reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
}

function addToCart(product, size) {
  cartMessage.className = "text-danger mb-3";
  if (!["39", "40", "41", "42"].includes(size)) {
    cartMessage.textContent = "Vui lòng chọn size hợp lệ.";
    return;
  }
  const cart = readProductCart();
  const item = cart.find(item => item?.id === product.id && item.size === size);
  // Kiểm tra tổng số lượng của cùng một mẫu giày, kể cả các size khác nhau.
  const total = cart.filter(item => item?.id === product.id).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  if (total >= product.stock) {
    cartMessage.textContent = "Số lượng trong giỏ đã đạt tồn kho mẫu của sản phẩm.";
    return;
  }
  if (item) item.quantity = (Number(item.quantity) || 0) + 1;
  else cart.push({ id: product.id, name: product.name, image: product.image, price: product.price, size, quantity: 1 });
  try {
    localStorage.setItem("shoesZoneCart", JSON.stringify(cart));
    updateCartCount();
    cartMessage.className = "text-success mb-3";
    cartMessage.textContent = `Đã thêm ${product.name}, size ${size}, vào giỏ.`;
  } catch { cartMessage.textContent = "Không lưu được giỏ hàng. Kiểm tra quyền Local Storage của trình duyệt."; }
}

productSearch.addEventListener("input", renderProducts);
retryButton.addEventListener("click", loadProducts);
window.addEventListener("storage", updateCartCount);
updateCartCount();
loadProducts();

// TODO HS 05: Giỏ/checkout cần đọc lại giá, tên và stock từ API theo ID.
// Size 39-42 chỉ là lựa chọn DEMO; DummyJSON không trả tồn kho theo size.