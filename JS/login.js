document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail")?.value.trim().toLowerCase() || "";
    const password = document.getElementById("loginPassword")?.value || "";

    if (!email || !password) {
      alert("Vui lòng nhập email và mật khẩu!");
      return;
    }

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem("shoesZoneUsers")) || [];
    } catch (error) {
      users = [];
    }

    const user = users.find(
      (storedUser) => storedUser.email.toLowerCase() === email && storedUser.password === password
    );

    if (!user) {
      alert("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
      return;
    }

    localStorage.setItem(
      "shoesZoneUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
        isLoggedIn: true,
      })
    );

    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
  });
});
