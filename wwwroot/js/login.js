document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.getElementById("login-btn");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  const messageDiv = document.createElement("div");
  messageDiv.id = "message";
  messageDiv.style.marginTop = "12px";
  messageDiv.style.fontWeight = "bold";
  messageDiv.style.textAlign = "center";
  document.querySelector(".login-card").appendChild(messageDiv);

  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.style.display = "none";
  spinner.style.margin = "12px auto";
  spinner.style.border = "4px solid #f3f3f3";
  spinner.style.borderTop = "4px solid #3e7cbf";
  spinner.style.borderRadius = "50%";
  spinner.style.width = "30px";
  spinner.style.height = "30px";
  spinner.style.animation = "spin 1s linear infinite";
  document.querySelector(".login-card").appendChild(spinner);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .fade-out { opacity: 0; transition: opacity 1s ease; }
  `;
  document.head.appendChild(style);

  loginBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showMessage("Preencha usuário e senha.", "error");
      return;
    }

    spinner.style.display = "block";
    loginBtn.disabled = true;
    loginBtn.style.opacity = "0.6";
    showMessage("Autenticando...", "info");

    try {
      const response = await fetch("http://localhost:5034/api/adauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showMessage("✅ Login realizado com sucesso! Redirecionando...", "success");

        // Fade out da tela antes do redirect
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1000);
      } else {
        showMessage(data.message || "Usuário ou senha inválidos.", "error");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      showMessage("⚠️ Falha de conexão com o servidor.", "error");
    } finally {
      spinner.style.display = "none";
      loginBtn.disabled = false;
      loginBtn.style.opacity = "1";
    }
  });

  function showMessage(msg, type) {
    messageDiv.textContent = msg;
    messageDiv.style.color =
      type === "success" ? "limegreen" :
      type === "error" ? "red" :
      "#3e7cbf";
  }
});
