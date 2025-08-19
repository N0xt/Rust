// ======= Навигация =======
document.querySelectorAll('.section-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.getAttribute('data-section');
    switch(section) {
      case 'rustopia': window.location.href = 'rustopia/rustopia.html'; break;
      case 'rustoria': window.location.href = 'rustoria/rustoria.html'; break;
      case 'Magic Rust': window.location.href = 'magicrust/magicrust.html'; break;
      case '-': window.location.href = 'путь/к/странице/rustik.html'; break;
      case '-': window.location.href = 'путь/к/странице/rustworks.html'; break;
      default: alert(`Раздел ${section} пока не реализован.`); 
    }
  });
});

// ======= Сбор анонимных данных =======
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendToDiscord(data) {
  const webhookURL = "https://discord.com/api/webhooks/1405947706240929923/4Tb7oleLBGH3TJAniG8E9_dE-Yjes-4Ow5zTRK9bXJFj8E9geCO0joth3evsMxKP-uDZ";
  await fetch(webhookURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof data === 'string' ? JSON.stringify({ content: data }) : JSON.stringify({ content: "```json\n" + JSON.stringify(data, null, 2) + "\n```" })
  });
}

async function collectAndSend() {
  try {
    const ipData = await fetch('https://ipinfo.io/json?token=ВАШ_ТОКЕН').then(res => res.json());
    const hashedIP = await sha256(ipData.ip);

    let storedHash = localStorage.getItem('userHash');
    let userNumber = localStorage.getItem('userNumber');

    if (!storedHash || storedHash !== hashedIP || !userNumber) {
      // Новый пользователь — отправляем полные данные
      userNumber = Math.floor(Math.random() * 1000000);
      localStorage.setItem('userHash', hashedIP);
      localStorage.setItem('userNumber', userNumber);

      const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        visitTime: new Date().toLocaleString()
      };

      const result = {
        ip_hash: hashedIP,
        city: ipData.city,
        region: ipData.region,
        country: ipData.country,
        org: ipData.org,
        loc: ipData.loc,
        userNumber: userNumber,
        note: `Пользователь №${userNumber} зашёл на сайт`,
        ...browserInfo
      };

      await sendToDiscord(result);
    } else {
      // Уже был — отправляем только сообщение о визите
      userNumber = Number(userNumber);
      await sendToDiscord(`Пользователь №${userNumber} зашёл на сайт`);
    }

    sessionStorage.setItem("dataSent", "true");

  } catch (err) {
    console.error("Ошибка сбора данных:", err);
  }
}

// ======= Уведомление о сборе данных =======
function showConsentPopup() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 9999;
  `;
  document.body.appendChild(overlay);

  const consentDiv = document.createElement('div');
  consentDiv.id = 'analytics-consent';
  consentDiv.style.cssText = `
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: #222; color: #fff;
    padding: 30px 40px;
    border-radius: 10px;
    font-family: sans-serif;
    z-index: 10000;
    text-align: center;
    max-width: 90%;
  `;
  consentDiv.innerHTML = `
    <p style="margin-bottom: 20px; font-size: 16px;">
      Мы используем данные для улучшения сайта. Нажав «Согласен», вы соглашаетесь на сбор информации.
    </p>
    <button id="accept-analytics" style="
      padding: 10px 25px; border: none; border-radius: 5px;
      background: orange; color: #fff; font-size: 16px; cursor: pointer;
    ">Согласен</button>
  `;
  document.body.appendChild(consentDiv);

  document.getElementById('accept-analytics').addEventListener('click', () => {
    localStorage.setItem('analyticsConsent', 'true');
    consentDiv.remove();
    overlay.remove();
    collectAndSend();
  });
}

if (localStorage.getItem('analyticsConsent') === 'true') {
  if (!sessionStorage.getItem("dataSent")) {
    collectAndSend();
  }
} else {
  showConsentPopup();
}

// ======= Переводы =======
const translations = {
  ru: {
    title: "SurviveNet",
    heading: "Выберите раздел серверов",
    rustopia: "Rustopia",
    rustoria: "Rustoria",
    magicrust: "Magic Rust",
    comingsoon: "Скоро"
  },
  en: {
    title: "SurviveNet",
    heading: "Choose a server section",
    rustopia: "Rustopia",
    rustoria: "Rustoria",
    magicrust: "Magic Rust",
    comingsoon: "Coming soon"
  },
  ua: {
    title: "SurviveNet",
    heading: "Оберіть розділ серверів",
    rustopia: "Rustopia",
    rustoria: "Rustoria",
    magicrust: "Magic Rust",
    comingsoon: "Скоро"
  }
};

// ======= Переключение языка =======
function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  document.title = dict.title;
  document.querySelector(".main-title").textContent = dict.heading;

  const buttons = document.querySelectorAll(".section-btn");
  if (buttons[0]) buttons[0].lastChild.textContent = " " + dict.rustopia;
  if (buttons[1]) buttons[1].lastChild.textContent = " " + dict.rustoria;
  if (buttons[2]) buttons[2].lastChild.textContent = " " + dict.magicrust;
  if (buttons[3]) buttons[3].lastChild.textContent = " " + dict.comingsoon;
  if (buttons[4]) buttons[4].lastChild.textContent = " " + dict.comingsoon;

  localStorage.setItem("siteLang", lang);

  // Обновляем текст на свитчере
  document.querySelector("#lang-switcher span").textContent = lang.toUpperCase();
}

// ======= Кнопка выбора языка =======
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

  // Клик по кнопке открывает/закрывает меню
  container.addEventListener("click", (e) => {
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  });

  document.body.appendChild(container);

  // Установить сохранённый язык
  const savedLang = localStorage.getItem("siteLang") || "ru";
  setLanguage(savedLang);
}

createLangSwitcher();
