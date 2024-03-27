// ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ
function toggleFavorite(productId, event) {
    fetch(`/toggle_favorite/${productId}`, { method: 'POST' })
        .then(response => {
            if (response.status === 401) { // Проверяем, не вернул ли сервер статус 401
                throw new Error('AuthRequired');
            }
            if (!response.ok) {
                throw new Error('Failed to toggle favorite status');
            }
            return response.json();
        })
        .then(data => {
            const heartIcon = event.target;
            if (data.favorite) {
                heartIcon.src = "../static/image/cart-on.png";
                showMessage('Товар добавлен в корзину');
            } else {
                heartIcon.src = "../static/image/cart-off.png";
                showMessage('Товар удален из корзины');
            }
        })
        .catch(error => {
            if (error.message === 'AuthRequired') {
                showMessage('Для добавления товара в корзину необходимо авторизоваться');
            } else {
                console.error('Error:', error);
            }
        });
}

// СООБЩЕНИЕ О ДОБАВЛЕНИИ ТОВАРА В КОРЗИНУ
function showMessage(message) {
    const container = document.getElementById('message-container');
    if (!container) return; // Если контейнер для сообщений не найден, выходим из функции

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = message;

    container.appendChild(messageDiv);
    setTimeout(() => messageDiv.classList.add('message-show'), 10); // Добавляем класс для показа сообщения

    // Удаляем сообщение через 3 секунды, позволяя ему плавно исчезнуть
    setTimeout(() => {
        messageDiv.classList.remove('message-show'); // Подготавливаем сообщение к исчезновению
        setTimeout(() => messageDiv.remove(), 500); // Удаляем после исчезновения
    }, 1000);
}

// СОРТИРОВКА ТОВАРОВ
function sortProductsByPriceAsc() {
    var productsContainer = document.querySelector('.products');
    var products = Array.from(productsContainer.getElementsByClassName('product'));

    products.sort(function(a, b) {
        var priceA = parseInt(a.querySelector('.price').textContent.replace(/\D/g,''));
        var priceB = parseInt(b.querySelector('.price').textContent.replace(/\D/g,''));
        return priceA - priceB; // Сортировка по возрастанию
    });

    productsContainer.innerHTML = '';
    products.forEach(product => productsContainer.appendChild(product));
}

function sortProductsByPriceDesc() {
    var productsContainer = document.querySelector('.products');
    var products = Array.from(productsContainer.getElementsByClassName('product'));

    products.sort(function(a, b) {
        var priceA = parseInt(a.querySelector('.price').textContent.replace(/\D/g,''));
        var priceB = parseInt(b.querySelector('.price').textContent.replace(/\D/g,''));
        return priceB - priceA; // Сортировка по убыванию
    });

    productsContainer.innerHTML = '';
    products.forEach(product => productsContainer.appendChild(product));
}

// Привязка функций сортировки к кнопкам
document.getElementById('sort-price-asc-btn').addEventListener('click', sortProductsByPriceAsc);
document.getElementById('sort-price-desc-btn').addEventListener('click', sortProductsByPriceDesc);

// ФИЛЬТР
document.getElementById('apply-filter').addEventListener('click', function() {
    const minPrice = parseInt(document.getElementById('min-price').value, 10) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value, 10) || Infinity;
    const selectedSize = document.getElementById('size-filter').value;

    const products = Array.from(document.getElementsByClassName('product'));

    products.forEach(product => {
        const price = parseInt(product.querySelector('.price').textContent.replace(/\D/g, ''), 10);

        // Предполагается, что размеры товара находятся в элементе с классом .size
        // И размеры перечислены через запятую. Например: "38, 39, 40"
        // Исправление начинается здесь
        const sizeText = product.querySelector('.size').textContent;
        const sizes = sizeText.split(',').map(size => parseInt(size.trim(), 10));
        // Исправление заканчивается здесь

        const matchesPrice = price >= minPrice && price <= maxPrice;
        const matchesSize = !selectedSize || sizes.includes(parseInt(selectedSize, 10));

        product.style.display = (matchesPrice && matchesSize) ? '' : 'none';
    });
});

  
