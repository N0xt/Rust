// ======= Переводы =======
const translations = {
  ru: {
    title: "SurviveNet",
    back: "← Назад",
    heading: "Rustoria — Список серверов"
  },
  en: {
    title: "SurviveNet",
    back: "← Back",
    heading: "Rustoria — Server list"
  },
  ua: {
    title: "SurviveNet",
    back: "← Повернутись",
    heading: "Rustoria — Список серверів"
  }
};

// ======= Установка языка =======
function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  // Заголовок страницы
  document.title = dict.title;

  // Кнопка назад
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) backBtn.textContent = dict.back;

  // Заголовок h1
  const heading = document.querySelector("h1");
  if (heading) heading.textContent = dict.heading;

  // Сохраняем язык
  localStorage.setItem("siteLang", lang);

  // Обновляем на свитчере
  const switcher = document.querySelector("#lang-switcher span");
  if (switcher) switcher.textContent = lang.toUpperCase();
}

// ======= Переключатель языка =======
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

  // Основная кнопка
  container.innerHTML = `🌐 <span>RU</span>`;

  // Выпадающий список
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

  const langs = ["ru", "en", "ua"];
  langs.forEach(lang => {
    const item = document.createElement("div");
    item.textContent = lang.toUpperCase();
    item.style.cssText = `
      padding: 6px 12px;
      cursor: pointer;
    `;
    item.addEventListener("click", () => {
      setLanguage(lang);
      menu.style.display = "none";
    });
    item.addEventListener("mouseover", () => {
      item.style.background = "#444";
    });
    item.addEventListener("mouseout", () => {
      item.style.background = "transparent";
    });
    menu.appendChild(item);
  });

  container.appendChild(menu);

  // Открытие/закрытие меню
  container.addEventListener("click", () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  document.body.appendChild(container);

  // Установить сохранённый язык при загрузке
  const savedLang = localStorage.getItem("siteLang") || "ru";
  setLanguage(savedLang);
}

// ======= Переходы по кнопкам серверов =======
function initServerButtons() {
  const buttons = document.querySelectorAll(".server-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      if (url) window.open(url, "_blank");
    });
  });
}

// ======= Кнопка назад =======
function initBackButton() {
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) {
        // Возвращаемся на предыдущую страницу
        window.history.back();
      } else {
        // Если страницы в истории нет — переходим на главную
        window.location.href = "index.html";
      }
    });
  }
}

// ======= Инициализация =======
document.addEventListener("DOMContentLoaded", () => {
  createLangSwitcher();
  initServerButtons();
  initBackButton();
});
