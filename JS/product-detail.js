"use strict";

const detailStatus = document.querySelector("#detail-status");
const retryDetail = document.querySelector("#retry-detail");
const detailContent = document.querySelector("#detail-content");
const detailCartMessage = document.querySelector("#detail-cart-message");
const productId = new URLSearchParams(window.location.search).get("id");
let currentProduct = null;
let isLoadingDetail = false;

function formatDetailPrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function readDetailCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("shoesZoneCart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function updateDetailCartCount() {
  const count = readDetailCart().reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
  const badge = document.querySelector("#cart-count");
  if (badge) badge.textContent = count;
}

function renderProduct(product) {
  const image = document.querySelector("#detail-image");
  image.src = product.image || "Cuoikhoaweb/assets/giay_trangchu.png";
  image.alt = product.name;
  image.addEventListener("error", () => {
    image.src = "Cuoikhoaweb/assets/giay_trangchu.png";
  }, { once: true });

  document.querySelector("#detail-name").textContent = product.name;
  document.querySelector("#detail-price").textContent = formatDetailPrice(product.price);
  document.querySelector("#detail-description").textContent = product.desc;
  document.querySelector("#detail-stock").textContent = `Tồn kho mẫu: ${product.stock}`;
  document.querySelector("#detail-add-to-cart").disabled = product.stock < 1;
  detailContent.hidden = false;
  detailStatus.textContent = "";
}

async function loadProductDetail() {
  if (isLoadingDetail) return;
  isLoadingDetail = true;
  retryDetail.hidden = true;
  detailContent.hidden = true;
  detailStatus.className = "text-secondary mb-3";
  detailStatus.textContent = "Đang tải sản phẩm...";

  try {
    currentProduct = await fetchProductById(productId);
    renderProduct(currentProduct);
  } catch (error) {
    detailStatus.className = "alert alert-danger";
    detailStatus.textContent = `${error.message} Hãy kiểm tra kết nối và thử lại.`;
    retryDetail.hidden = !Number.isSafeInteger(Number(productId)) || Number(productId) < 1;
  } finally {
    isLoadingDetail = false;
  }
}

function addDetailProductToCart() {
  if (!currentProduct) return;
  const size = document.querySelector("#detail-size").value;
  detailCartMessage.className = "text-danger mt-3 mb-0";
  if (!["39", "40", "41", "42"].includes(size)) {
    detailCartMessage.textContent = "Vui lòng chọn size hợp lệ.";
    return;
  }

  const cart = readDetailCart();
  const item = cart.find(entry => entry?.id === currentProduct.id && entry.size === size);
  const total = cart
    .filter(entry => entry?.id === currentProduct.id)
    .reduce((sum, entry) => sum + (Number(entry.quantity) || 0), 0);
  if (total >= currentProduct.stock) {
    detailCartMessage.textContent = "Số lượng trong giỏ đã đạt tồn kho mẫu của sản phẩm.";
    return;
  }

  if (item) item.quantity = (Number(item.quantity) || 0) + 1;
  else cart.push({
    id: currentProduct.id,
    name: currentProduct.name,
    image: currentProduct.image,
    price: currentProduct.price,
    size,
    quantity: 1,
  });

  try {
    localStorage.setItem("shoesZoneCart", JSON.stringify(cart));
    updateDetailCartCount();
    detailCartMessage.className = "text-success mt-3 mb-0";
    detailCartMessage.textContent = `Đã thêm ${currentProduct.name}, size ${size}, vào giỏ.`;
  } catch {
    detailCartMessage.textContent = "Không lưu được giỏ hàng. Kiểm tra quyền Local Storage của trình duyệt.";
  }
}

retryDetail.addEventListener("click", loadProductDetail);
document.querySelector("#detail-add-to-cart").addEventListener("click", addDetailProductToCart);
window.addEventListener("storage", updateDetailCartCount);
updateDetailCartCount();

if (!productId || !Number.isSafeInteger(Number(productId)) || Number(productId) < 1) {
  detailStatus.className = "alert alert-warning";
  detailStatus.textContent = "Thiếu hoặc sai mã sản phẩm. Hãy mở chi tiết từ một sản phẩm trong danh sách.";
} else {
  loadProductDetail();
}
