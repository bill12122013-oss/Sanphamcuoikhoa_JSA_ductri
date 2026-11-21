"use strict";

// BƯỚC 1: Cấu hình tập trung; GET sản phẩm DummyJSON không cần API key.
// Tài liệu: https://dummyjson.com/docs/products
const API_CONFIG = {
  BASE_URL: "https://dummyjson.com",
  CATEGORY: "mens-shoes",
  LIMIT: 24,
  // Hệ số minh họa cho bài tập, KHÔNG phải tỷ giá hiện hành.
  // Quy đổi để trang mẫu dùng cùng đơn vị VND với cart.js đang có.
  DEMO_USD_TO_VND: 25000,
};

// TODO HS: Thử CATEGORY = "womens-shoes" rồi tải lại để xem dữ liệu thay đổi.
