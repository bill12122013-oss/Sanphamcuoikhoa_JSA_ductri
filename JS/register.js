document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (!registerForm) return;

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("regName")?.value.trim() || "";
    const email = document.getElementById("regEmail")?.value.trim().toLowerCase() || "";
    const password = document.getElementById("regPassword")?.value || "";
    const confirmPassword = document.getElementById("regConfirmPassword")?.value || "";

    if (!name || !email || !password || !confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Email không hợp lệ. Vui lòng kiểm tra lại!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.");
      return;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("shoesZoneUsers")) || [];
    } catch (error) {
      users = [];
    }

    const existingUser = users.find((user) => user.email.toLowerCase() === email);
    if (existingUser) {
      alert("Email này đã được đăng ký cho tài khoản khác!");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("shoesZoneUsers", JSON.stringify(users));

    alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
    window.location.href = "login.html";
  });
});
