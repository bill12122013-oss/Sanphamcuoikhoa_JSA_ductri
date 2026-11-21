"use strict";

const homeProductList = document.querySelector("#home-product-list");
const homeProductStatus = document.querySelector("#home-product-status");
const retryHomeProducts = document.querySelector("#retry-home-products");
let isLoadingHomeProducts = false;

function formatHomePrice(value) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

function createHomeProductCard(product) {
  const card = document.querySelector("#home-product-card-template").content.cloneNode(true);
  const image = card.querySelector("img");
  image.src = product.image || "Cuoikhoaweb/assets/giay_trangchu.png";
  image.alt = product.name;
  image.addEventListener("error", () => {
    image.src = "Cuoikhoaweb/assets/giay_trangchu.png";
  }, { once: true });

  card.querySelector(".product-title").textContent = product.name;
  card.querySelector(".product-price").textContent = formatHomePrice(product.price);
  card.querySelector(".product-detail-link").href = `product-detail.html?id=${encodeURIComponent(product.id)}`;
  return card;
}

async function loadHomeProducts() {
  if (isLoadingHomeProducts) return;
  isLoadingHomeProducts = true;
  retryHomeProducts.hidden = true;
  homeProductList.setAttribute("aria-busy", "true");
  homeProductStatus.className = "text-secondary mb-3";
  homeProductStatus.textContent = "Đang tải sản phẩm...";

  try {
    const products = await fetchProducts();
    const featuredProducts = products.slice(0, 4);
    homeProductList.replaceChildren();
    featuredProducts.forEach(product => homeProductList.append(createHomeProductCard(product)));
    homeProductStatus.textContent = featuredProducts.length
      ? `Hiển thị ${featuredProducts.length} sản phẩm nổi bật`
      : "Hiện chưa có sản phẩm để hiển thị.";
  } catch (error) {
    homeProductList.replaceChildren();
    homeProductStatus.className = "alert alert-danger";
    homeProductStatus.textContent = `${error.message} Hãy kiểm tra kết nối và thử lại.`;
    retryHomeProducts.hidden = false;
  } finally {
    isLoadingHomeProducts = false;
    homeProductList.setAttribute("aria-busy", "false");
  }
}

retryHomeProducts.addEventListener("click", loadHomeProducts);
loadHomeProducts();
