document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("register-form");
    const msg = document.getElementById("register-msg");
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
  
      if (!username || !password) {
        msg.textContent = "Please fill in both fields.";
        return;
      }
  
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some(user => user.username === username);
  
      if (userExists) {
        msg.textContent = "Username already taken.";
        return;
      }
  
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      msg.style.color = "green";
      msg.textContent = "Account created. Redirecting...";
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    });
  });
  