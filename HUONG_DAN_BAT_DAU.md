# Shoes Zone — Hướng dẫn khởi đầu API

## 1. Phạm vi và cách chạy

Trang chủ, danh sách `products.html` và một mẫu `product-detail.html` dùng dữ liệu giày từ API; đây chưa phải website thương mại hoàn chỉnh. Giữ chức năng chọn size/thêm giỏ, chuyển nguồn sản phẩm sang API để học sinh thấy cách nối vào mã cũ.

Mở project bằng VS Code → dùng Live Server mở `products.html`. Không cần cài thư viện/backend. Giữ kết nối Internet; không mở HTML bằng file://.

## 2. Nguồn dữ liệu và cấu hình

- Tài liệu: https://dummyjson.com/docs/products
- URL mẫu: https://dummyjson.com/products/category/mens-shoes?limit=24
- GET công khai không cần API key; dữ liệu là mẫu, không phải tồn kho cửa hàng thật.
- Danh sách nằm ở `data.products`, không gọi `data.map()` trên object phản hồi.
- `mens-shoes` là giày nam; học sinh thử đổi sang `womens-shoes`. LIMIT chỉ là giới hạn tối đa, không bảo đảm luôn có đủ 24 sản phẩm.
- Giá API được quy đổi bằng hệ số **demo 25.000 VND/USD**, không phải tỷ giá hiện hành. Hệ số nằm ở `JS/config.js`, giúp dùng chung VND với giỏ/checkout cũ.
- Size 39–42 là lựa chọn mô phỏng của website, không phải dữ liệu API. API không có tồn kho riêng từng size.

## 3. Thứ tự đọc và viết code

```text
products.html        Khung HTML, template card, input và thông báo
index.html           Khung template sản phẩm nổi bật
product-detail.html  Khung trang chi tiết dùng chung, nhận ID qua query string
  ↓
JS/config.js         BASE_URL, CATEGORY, LIMIT, hệ số giá demo
  ↓
JS/api.js            fetchProducts(), fetchProductById() và normalizeProduct()
  ↓
JS/product.js        Render danh sách và sự kiện, nối giỏ localStorage
JS/home.js           Render sản phẩm nổi bật trên trang chủ
JS/product-detail.js Nạp chi tiết theo ID và thêm giỏ
  ↓
style.css            Kích thước ảnh/card, menu và responsive
```

Ba script nạp theo thứ tự config → api → product, dùng `defer`. Không cần học module ở buổi đầu. Các file có comment BƯỚC 1–6 và TODO HS.

### Bước 1 — Tạo khung trong products.html

Tìm `#product-list`, `#product-search`, `#product-status`, `#retry-products`, `#cart-message` và `#product-card-template`.

Template là khung ẩn; JS sao chép nó để tạo card. Dùng riêng vùng thông báo tải và vùng thông báo thêm giỏ để không ghi đè kết quả lẫn nhau.

### Bước 2 — Cấu hình và fetch

Đọc `API_CONFIG` trước. Đổi danh mục ở một nơi, không sửa URL rải rác ở các trang.

Trong `api.js`: xây URL → `await fetch()` → kiểm tra `response.ok` → `await response.json()` → kiểm tra mảng → `map(normalizeProduct)`.

`normalizeProduct()` đổi `title` thành `name`, `description` thành `desc`, `thumbnail` thành `image`, quy đổi `price`. Giỏ cũ đang dùng các tên này nên cần chuẩn hóa một lần trước khi render. Hàm fetch chỉ xử lý dữ liệu, không sửa DOM.

### Bước 3 — Render mẫu

Trong `product.js`, đọc `createProductCard()` rồi `renderProducts()`:

```text
Một object → sao chép template → điền bằng textContent → card
Một mảng  → filter theo tên → tạo từng card → append vào danh sách
```

Tên/mô tả từ API đưa lên bằng textContent, không ghép trực tiếp vào innerHTML. Ảnh lỗi có placeholder cục bộ. Tìm kiếm dùng mảng đã tải, không fetch lại theo từng lần gõ.

### Bước 4 — Tải dữ liệu và sự kiện

Đọc `loadProducts()`: đang tải → fetch → render; lỗi → thông báo và Thử lại. `isLoading` tránh gửi chồng nhiều request. Sau cùng xem ba thao tác: nghe input tìm kiếm, nghe click thử lại, gọi hàm tải lần đầu.

### Bước 5 — Nối phần giỏ đã có

Đọc `readProductCart()`, `addToCart()`, `updateCartCount()` trong `product.js`. Key giữ nguyên là `shoesZoneCart`, cấu trúc gồm id/name/image/price/size/quantity để `JS/cart.js` tiếp tục đọc được.

Chọn cùng ID và size thì tăng số lượng; size khác tạo dòng khác. Kiểm tra tổng lượng cùng ID không vượt tồn kho mẫu. Lưu xong mới báo thành công. Khi đổi sang API, nên xóa các món demo cũ trong giỏ trước khi kiểm tra để không trộn hai bộ dữ liệu.

## 4. Những việc cần làm tiếp

### Ưu tiên 1 — Tự mở rộng danh sách

- [ ] Thêm sắp xếp giá tăng/giảm trên mảng kết quả; không làm đổi mảng gốc.
- [ ] Thêm bộ chọn giày nam/nữ và gọi đúng danh mục API.
- [ ] Tự giải thích request, data.products, map và quá trình render.

### Ưu tiên 2 — Một trang chi tiết API dùng chung

- [x] Tạo `product-detail.html` chỉ có khung, không hardcode giày.
- [x] Tạo `JS/product-detail.js`, đọc ID từ query string.
- [x] Viết `fetchProductById(id)` trong `api.js`, dùng `/products/{id}`.
- [x] Dùng `normalizeProduct()` để giữ đơn vị giá và cấu trúc nhất quán.
- [x] Thêm link chi tiết đúng ID từ card, xử lý thiếu ID/không tìm thấy/lỗi mạng.
- [ ] Không cần tạo mỗi sản phẩm một trang hoặc hỗ trợ các URL chi tiết tĩnh cũ.

### Ưu tiên 3 — Trang chủ và dọn bản cũ

- [x] Tạo `JS/home.js`, fetch và render sản phẩm nổi bật trên `index.html`.
- [x] Bỏ các card sản phẩm hardcode trên trang chủ.
- [ ] Rà `main.html`, `trangchu.html`: chọn trang thực sự cần dùng, xóa bản trùng khi hoàn thiện. Không cần duy trì tương thích URL cũ.
- [ ] Chỉ giữ dữ liệu API cho tên/ảnh/giá sản phẩm; size/hệ số giá demo phải ghi rõ.

### Ưu tiên 4 — Giỏ, checkout và validate

- [ ] Giỏ đọc lại thông tin theo ID API; không tin tuyệt đối tên/giá/stock lưu từ trước.
- [ ] Cải tiến `JS/cart.js`: kiểm tra localStorage là mảng, kiểm tra số lượng nguyên và giới hạn stock, xử lý sản phẩm không còn tồn tại.
- [ ] Render an toàn dữ liệu tên/ảnh từ localStorage, tránh chèn thẳng chuỗi người dùng vào innerHTML.
- [ ] Thống nhất phí vận chuyển/điều kiện miễn phí với nội dung trang chủ.
- [ ] Checkout: trim tên/địa chỉ, kiểm tra điện thoại/email và báo lỗi dưới trường sai.
- [ ] Xác nhận đơn demo thành công mới xóa giỏ; form sai phải giữ dữ liệu.
- [ ] Viết `JS/contact.js` để validate và phản hồi form liên hệ; không giả vờ gửi email thật.

### Ưu tiên 5 — Tài khoản và profile

- [ ] Giữ các key đang dùng: `shoesZoneUsers` (tài khoản), `shoesZoneUser` (phiên).
- [ ] Kiểm tra cấu trúc dữ liệu sau JSON.parse, không chỉ bắt lỗi parse.
- [ ] Chặn tên chỉ có khoảng trắng, kiểm tra email trùng không phân biệt hoa thường, mật khẩu và xác nhận.
- [ ] Profile dùng textContent cho tên/email; hiện tên và Đăng xuất trên menu.
- [ ] Mật khẩu hiện lưu dạng rõ trong tài khoản demo. Không dùng mật khẩu thật; xác thực thực tế cần backend.

## 5. Tự kiểm tra trước khi nộp

| Kiểm tra | Kết quả |
|---|---|
| Mở danh sách khi có mạng | Request DummyJSON thành công, có ảnh/tên/giá |
| Tìm tên một món đang có | Chỉ còn kết quả phù hợp |
| Tìm chuỗi không tồn tại | Thông báo không có kết quả |
| Offline rồi reload | Hiện lỗi; Online rồi Thử lại thì tải được |
| Chọn size, thêm cùng món hai lần | Badge tăng, giỏ gộp đúng ID/size |
| Reload rồi mở giỏ/checkout | Giữ sản phẩm, giá VND quy đổi nhất quán |
| Mobile 390px | Không tràn ngang; card, nút và menu dễ dùng |
| Dữ liệu giỏ/tài khoản bị hỏng | Không crash hoặc hiển thị code HTML |

Kiểm tra UI trực tiếp trên trình duyệt là việc cần làm thêm. Chỉ hoàn thành một ưu tiên rồi chuyển sang bước tiếp theo; không cần làm xong toàn bộ shop trong buổi đầu.
