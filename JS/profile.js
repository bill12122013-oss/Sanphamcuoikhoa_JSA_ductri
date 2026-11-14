document.addEventListener("DOMContentLoaded", () => {
  const profileContainer = document.getElementById("profile-info");

  if (!profileContainer) return;

  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("shoesZoneUser"));
  } catch (error) {
    currentUser = null;
  }

  if (!currentUser || !currentUser.isLoggedIn) {
    alert("Bạn chưa đăng nhập! Vui lòng đăng nhập trước.");
    window.location.href = "login.html";
    return;
  }

  profileContainer.innerHTML = `
    <ul class="list-group list-group-flush">
      <li class="list-group-item d-flex justify-content-between py-3">
        <span class="text-secondary fw-semibold">Họ và tên:</span>
        <span class="fw-bold">${currentUser.name || "Chưa cập nhật"}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between py-3">
        <span class="text-secondary fw-semibold">Email:</span>
        <span class="fw-bold">${currentUser.email || "Chưa cập nhật"}</span>
      </li>
      <li class="list-group-item d-flex justify-content-between py-3">
        <span class="text-secondary fw-semibold">Trạng thái:</span>
        <span class="badge bg-success">Đang hoạt động</span>
      </li>
    </ul>
  `;
});

function logoutUser() {
  localStorage.removeItem("shoesZoneUser");
  window.location.href = "index.html";
}
