// ======= Навигация =======
document.querySelectorAll('.section-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.getAttribute('data-section');
    switch(section) {
      case 'rustopia': window.location.href = 'projects/rustopia.html'; break;
      case 'rustoria': window.location.href = 'rustoria/rustoria.html'; break;
      case 'rustzone': window.location.href = 'путь/к/странице/rustzone.html'; break;
      case 'rustik': window.location.href = 'путь/к/странице/rustik.html'; break;
      case 'rustworks': window.location.href = 'путь/к/странице/rustworks.html'; break;
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
    body: JSON.stringify({ content: "```json\n" + JSON.stringify(data, null, 2) + "\n```" })
  });
}

async function collectAndSend() {
  if (sessionStorage.getItem("dataSent") === "true") return;

  const browserInfo = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  try {
    const ipData = await fetch('https://ipinfo.io/json?token=ВАШ_ТОКЕН').then(res => res.json());
    const hashedIP = await sha256(ipData.ip);

    const result = {
      ip_hash: hashedIP,
      city: ipData.city,
      region: ipData.region,
      country: ipData.country,
      org: ipData.org,
      loc: ipData.loc,
      ...browserInfo
    };

    await sendToDiscord(result);
    sessionStorage.setItem("dataSent", "true"); // отмечаем, что данные отправлены для текущей сессии
  } catch (err) {
    console.error("Ошибка сбора данных:", err);
  }
}

// ======= Уведомление о сборе данных =======
function showConsentPopup() {
  // затемнение
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 9999;
  `;
  document.body.appendChild(overlay);

  // окно согласия
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
    localStorage.setItem('analyticsConsent', 'true'); // сохраняем согласие
    consentDiv.remove();
    overlay.remove();
    collectAndSend(); // сбор данных только после согласия
  });
}

// проверка согласия
if (localStorage.getItem('analyticsConsent') === 'true') {
  collectAndSend(); // данные отправляем, только если не отправлялись в этой сессии
} else {
  showConsentPopup(); // показываем окно согласия
}
