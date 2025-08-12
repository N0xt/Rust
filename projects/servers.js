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
