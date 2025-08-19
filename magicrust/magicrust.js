document.addEventListener('DOMContentLoaded', function () {
    // Получаем все кнопки серверов
    const serverBtns = document.querySelectorAll('.server-btn'); 
    // Кнопка "Назад"
    const backBtn = document.querySelector('.back-btn'); 

    // Обработчик для кнопки "Назад"
    backBtn.addEventListener('click', function () {
        // Возвращаемся на предыдущую страницу
        window.history.back();
    });

    // Добавляем обработчик события для каждой кнопки сервера
    serverBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            // Получаем URL, указанный в атрибуте data-url
            const serverUrl = btn.getAttribute('data-url');
            // Открываем ссылку в новой вкладке
            window.open(serverUrl, '_blank');
        });
    });
});
// ======= Переводы =======
const translations = {
  ru: {
    title: "SurviveNet",
    heading: "Magic Rust — Список серверов",
    play: "▶",
    back: "← Назад"
  },
  en: {
    title: "SurviveNet",
    heading: "Magic Rust — Server List",
    play: "▶",
    back: "← Back"
  },
  ua: {
    title: "SurviveNet",
    heading: "Magic Rust — Список серверів",
    play: "▶",
    back: "← Повернутись"
  }
};

// ======= Установка языка =======
function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.title = dict.title;

  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = dict.heading;

  // Обновляем символ "▶" у всех серверов
  const serverBtns = document.querySelectorAll(".server-btn");
  serverBtns.forEach(btn => {
    const arrow = btn.querySelector("span");
    if (arrow) arrow.textContent = dict.play;
  });

  // Обновляем кнопку "Назад"
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) backBtn.textContent = dict.back;

  localStorage.setItem("siteLang", lang);

  const switcherSpan = document.querySelector("#lang-switcher span");
  if (switcherSpan) switcherSpan.textContent = lang.toUpperCase();
}

// ======= Создание переключателя языка =======
function createLangSwitcher() {
  const container = document.createElement("div");
  container.id = "lang-switcher";
  container.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #222;
    padding: 8px 12px;
    border-radius: 8px;
    color: white;
    font-family: sans-serif;
    cursor: pointer;
    user-select: none;
    z-index: 9999;
  `;
  container.innerHTML = `🌐 <span>RU</span>`;

  const menu = document.createElement("div");
  menu.style.cssText = `
    display: none;
    position: absolute;
    right: 0;
    margin-top: 5px;
    background: #333;
    border-radius: 6px;
    overflow: hidden;
  `;

  ["ru", "en", "ua"].forEach(lang => {
    const item = document.createElement("div");
    item.textContent = lang.toUpperCase();
    item.style.cssText = `padding: 6px 12px; cursor: pointer;`;
    item.addEventListener("click", () => {
      setLanguage(lang);
      menu.style.display = "none";
    });
    item.addEventListener("mouseover", () => item.style.background = "#444");
    item.addEventListener("mouseout", () => item.style.background = "transparent");
    menu.appendChild(item);
  });

  container.appendChild(menu);

  container.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  document.body.appendChild(container);

  // Установить сохранённый язык при загрузке
  const savedLang = localStorage.getItem("siteLang") || "ru";
  setLanguage(savedLang);
}

// ======= Кнопка "Назад" =======
const backBtn = document.querySelector(".back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    const url = backBtn.getAttribute("aria-label") || "index.html";
    window.location.href = url;
  });
}

// ======= Кнопки серверов =======
document.querySelectorAll(".server-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const url = btn.dataset.url;
    if (url) window.open(url, "_blank");
  });
});

// ======= Инициализация =======
document.addEventListener("DOMContentLoaded", () => {
  createLangSwitcher();
});
