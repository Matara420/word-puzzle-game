document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const msg = document.getElementById("login-msg");
  
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value;
  
      const users = JSON.parse(localStorage.getItem("users")) || [];
  
      const matchedUser = users.find(user => user.username === username && user.password === password);
  
      if (matchedUser) {
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        window.location.href = "game.html";
      } else {
        msg.textContent = "Incorrect username or password.";
      }
    });
  });
  
  