// ---------------------------------------------------------------
// MEN'S SLIDER

document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');
    const slides = Array.from(slider.children);
    const nextArrow = document.querySelector('.next-arrow');
    const prevArrow = document.querySelector('.prev-arrow');
    let currentSlide = 0;

    function updateSlidePosition() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        slider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    }

    function updateArrowState() {
        prevArrow.disabled = currentSlide === 0;
    }

    function showNextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlidePosition();
        updateArrowState();
    }

    function showPrevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlidePosition();
        updateArrowState();
    }

    nextArrow.addEventListener('click', showNextSlide);

    prevArrow.addEventListener('click', showPrevSlide);

    // Добавляем автоматическое переключение слайдов каждые 3 секунды
    let slideInterval = setInterval(showNextSlide, 3000);

    // Останавливаем автоматическое переключение слайдов при наведении на слайдер
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Возобновляем автоматическое переключение слайдов при уходе с слайдера
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(showNextSlide, 3000);
    });

    updateSlidePosition();
    updateArrowState();
});




// NON SLIDER - STATIC IMAGE
// Возобновляем автоматическое переключение слайдов при уходе с слайдера
slider.addEventListener('mouseleave', () => {
    slideInterval = setInterval(showNextSlide, 3000);
});

// Array of images to cycle through
const images = [
    '../static/image/sl-1.png',
    '../static/image/sl-2.png',
    '../static/image/sl-3.png',
    // Add as many images as you like
];

let currentImageIndex = 0;

// Function to change to the next image
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    const imageContainer = document.querySelector('.static-image');
    imageContainer.src = images[currentImageIndex];
}

// Add click event listener to the image container
document.querySelector('.static-image-container').addEventListener('click', showNextImage);

// Добавляем автоматическое переключение статических изображений каждые 3 секунды
let imageInterval = setInterval(showNextImage, 3000);

// Останавливаем автоматическое переключение изображений при наведении на контейнер
document.querySelector('.static-image-container').addEventListener('mouseenter', () => {
    clearInterval(imageInterval);
});

// Возобновляем автоматическое переключение изображений при уходе с контейнера
document.querySelector('.static-image-container').addEventListener('mouseleave', () => {
    imageInterval = setInterval(showNextImage, 3000);
});
      