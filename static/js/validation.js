function displayMessage(message) {
    const messageContainer = document.querySelector('.message-container');
    if (!messageContainer) return; // Если контейнер не найден, выходим из функции
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = message;
    messageContainer.appendChild(messageDiv);

    // Удаляем сообщение через 3 секунды
    setTimeout(() => messageDiv.remove(), 3000);
}

function setValidationIcon(inputElement, isValid) {
    const feedbackIcon = inputElement.closest('.input-container').querySelector('.valid-feedback');
    if (isValid) {
        feedbackIcon.style.display = 'block';
        inputElement.classList.add('input-valid');
    } else {
        feedbackIcon.style.display = 'none';
        inputElement.classList.remove('input-valid');
    }
}

document.querySelector('.registration-form').addEventListener('submit', function(event) {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    let errors = false;

    if (!usernameInput.value || usernameInput.value.length < 2) {
        displayMessage('Имя пользователя должно быть не менее 2 символов.');
        setValidationIcon(usernameInput, false);
        errors = true;
    } else {
        setValidationIcon(usernameInput, true);
    }
    
    if (!emailInput.value || !emailInput.value.match(/^[^@]+@[^@]+\.[^@]+$/)) {
        displayMessage('Введите корректный email адрес.');
        setValidationIcon(emailInput, false);
        errors = true;
    } else {
        setValidationIcon(emailInput, true);
    }

    if (!passwordInput.value || passwordInput.value.length < 6) {
        displayMessage('Пароль должен быть не менее 6 символов.');
        setValidationIcon(passwordInput, false);
        errors = true;
    } else {
        setValidationIcon(passwordInput, true);
    }

    if (passwordInput.value !== confirmPasswordInput.value) {
        displayMessage('Пароли не совпадают.');
        setValidationIcon(confirmPasswordInput, false);
        errors = true;
    } else if (passwordInput.value) {
        setValidationIcon(confirmPasswordInput, true);
    }    

    if (errors) {
        event.preventDefault(); // Отменяем отправку формы, если есть ошибки
    }
});
