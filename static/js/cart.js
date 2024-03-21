document.addEventListener("DOMContentLoaded", function() {
    loadFavorites();
});

function loadFavorites() {
    fetch('/get_favorites')
        .then(response => response.json())
        .then(data => {
            const productsContainer = document.querySelector('.products');
            productsContainer.innerHTML = ''; // Очищаем содержимое контейнера перед добавлением новых товаров
            data.forEach(product => {
                const productCard = createProductCard(product);
                productsContainer.appendChild(productCard);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product');
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <div class="product-rows">
            <div class="left-row">
                <p class="brand">${product.brand}</p>
                <p class="size">Размер: ${product.size}</p>
                <p class="price">${product.price} ₽</p>
            </div>
            <div class="right-row">
                <img src="../static/image/product-heart.png" alt="heart" class="add-to-fav" onclick="removeFromFavorites(${product.id})">
            </div>
        </div>
    `;
    return productCard;
}

function removeFromFavorites(productId) {
    fetch('/remove_from_favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
    })
        .then(response => {
            if (response.ok) {
                loadFavorites(); // Перезагружаем список избранных товаров после удаления
                alert('Товар удален из избранного!');
            } else {
                alert('Ошибка при удалении товара из избранного!');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
        });
}

function toggleFavorite(productId, element) {
    fetch(`/toggle_favorite/${productId}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (!data.favorite) {
                // Если товар был удален из избранных, удаляем его карточку из DOM
                element.closest('.product').remove();
            }
        })
        .catch(error => console.error('Error:', error));
}

// КНОПКА ОФОРМЛЕНИЯ ЗАКАЗА В КОРЗИНЕ  
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('.submit'); // Кнопка оформления заказа
    const emptyCartMessage = document.getElementById('empty-cart-message'); // Сообщение о пустой корзине

    const updateCartButton = () => {
        const products = document.querySelectorAll('.product');
        let totalQuantity = 0;
        let totalPrice = 0;

        products.forEach(product => {
            const quantityInput = product.querySelector('input[type="number"]');
            const quantity = quantityInput ? parseInt(quantityInput.value, 10) : 0;
            const priceText = product.querySelector('.price').textContent || '';
            const price = parseFloat(priceText.replace(/\D/g, '')) || 0;
            totalQuantity += quantity;
            totalPrice += price * quantity;
        });

        if (totalQuantity > 0) {
            // Есть товары в корзине, показываем кнопку и обновляем информацию
            submitButton.style.display = 'flex';
            const orderDetails = submitButton.querySelector('.order-details');
            orderDetails.textContent = `${totalQuantity} товара(-ов) на сумму ${totalPrice} ₽`;
            emptyCartMessage.style.display = 'none'; // Скрываем сообщение о пустой корзине
        } else {
            // Товаров в корзине нет, скрываем кнопку и показываем сообщение
            submitButton.style.display = 'none';
            emptyCartMessage.style.display = 'block'; // Показываем сообщение о пустой корзине
        }
    };

    const productsContainer = document.querySelector('.products-container');
    productsContainer.addEventListener('click', event => {
        if (event.target.matches('.delete-product')) {
            const product = event.target.closest('.product');
            product.remove();
            updateCartButton();
        }
    });

    productsContainer.addEventListener('change', event => {
        if (event.target.matches('input[type="number"], .product select')) {
            updateCartButton();
        }
    });

    updateCartButton(); // Вызываем сразу при загрузке, чтобы правильно установить видимость кнопки и сообщения
});
