"use strict";

// BƯỚC 2: Chuẩn hóa dữ liệu API về cấu trúc mà giỏ hàng cũ đang dùng.
function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.title,
    desc: product.description || "Chưa có mô tả.",
    image: product.thumbnail,
    price: Math.round(product.price * API_CONFIG.DEMO_USD_TO_VND),
    stock: product.stock,
  };
}

async function fetchProducts() {
  const url = `${API_CONFIG.BASE_URL}/products/category/${API_CONFIG.CATEGORY}?limit=${API_CONFIG.LIMIT}`;
  const response = await fetch(url);
  // fetch không tự ném lỗi khi server trả HTTP 404/500.
  if (!response.ok) throw new Error(`Không tải được giày (HTTP ${response.status}).`);
  const data = await response.json();
  // API trả object { products: [...] }, không phải một mảng trực tiếp.
  if (!Array.isArray(data.products)) throw new Error("API trả dữ liệu không đúng cấu trúc products.");
  return data.products.map(normalizeProduct);
}

async function fetchProductById(id) {
  const productId = Number(id);
  if (!Number.isSafeInteger(productId) || productId < 1) {
    throw new Error("Mã sản phẩm không hợp lệ.");
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/products/${productId}`);
  if (!response.ok) throw new Error(`Không tải được sản phẩm (HTTP ${response.status}).`);

  const product = await response.json();
  if (!product || typeof product !== "object" || !Number.isSafeInteger(product.id)) {
    throw new Error("API trả dữ liệu sản phẩm không đúng cấu trúc.");
  }
  return normalizeProduct(product);
}
