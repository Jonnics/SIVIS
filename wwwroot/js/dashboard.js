document.addEventListener("DOMContentLoaded", async () => {
  // tenta múltiplos ids para ficar tolerante a variações
  const container = document.getElementById("sistemas-container")
                 || document.getElementById("systemsContainer")
                 || document.getElementById("systemContainer");
  const logoutBtn = document.getElementById("logoutBtn");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (!container) {
    console.error("Container de sistemas não encontrado (ids esperados: 'sistemas-container' ou 'systemsContainer').");
    return;
  }

  // Carrega o JSON de sistemas
  try {
    const resp = await fetch("sistemas.json");
    if (!resp.ok) throw new Error("Falha ao carregar sistemas.json");
    const sistemas = await resp.json();

    container.innerHTML = ""; // limpa

    sistemas.forEach((sistema, index) => {
      const card = document.createElement("article");
      card.className = "card";

      // botão olho (SVG inline minimalista) + botão acessar
      card.innerHTML = `
        <div>
          <h3 class="card-title">${escapeHtml(sistema.nome)}</h3>
          <p class="card-desc">${escapeHtml(sistema.descricao)}</p>
          <p class="card-owner">Owner: ${escapeHtml(sistema.owner || "")}</p>
        </div>

        <div class="card-actions">
          <a class="access-btn" href="${escapeAttr(sistema.link || '#')}" target="_blank" rel="noopener">Acessar</a>

          <button class="eye-btn" data-index="${index}" aria-label="Ver detalhes de ${escapeHtml(sistema.nome)}" title="Detalhes">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      `;

      // adiciona no container
      container.appendChild(card);

      // adiciona listener diretamente no botão criado (mais confiável)
      const btn = card.querySelector(".eye-btn");
      if (btn) {
        btn.addEventListener("click", () => {
          openModalWith(sistemas[Number(btn.dataset.index)]);
        });
      }
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:#b00">Erro ao carregar sistemas.</p>`;
  }

  // Functions
  function openModalWith(s) {
    if (!modal || !modalTitle || !modalBody) return;
    modalTitle.textContent = s.nome || "Detalhes";
    modalBody.textContent = `🧑‍💻 Owner: ${s.owner || ''}\n\n📝 Descrição: ${s.descricao || ''}\n\n🌐 Link: ${s.link || ''}`;
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  // fecha modal
  if (modalClose) modalClose.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  });
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
      }
    });
  }

  // logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // pequenas helpers para escapar conteúdo (segurança)
  function escapeHtml(str) {
    if (!str && str !== 0) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  function escapeAttr(str) {
    if (!str && str !== 0) return "#";
    return String(str).replace(/"/g, "&quot;");
  }
});
