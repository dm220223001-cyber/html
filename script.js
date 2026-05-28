// Товары
const products = [
    {
        id: 1,
        name: "Сумка спортивная PRO",
        desc: "Вместительная сумка с отделениями для обуви и одежды",
        price: 3990,
        colors: [
            { name: "black", code: "#1a1a1a", img: "https://ir.ozone.ru/s3/multimedia-n/w1200/6755102663.jpg" },
            { name: "blue", code: "#1a5276", img: "https://ir.ozone.ru/s3/multimedia-n/w1200/6755102663.jpg" },
            { name: "gray", code: "#5d6d7e", img: "https://ir.ozone.ru/s3/multimedia-n/w1200/6755102663.jpg" }
        ]
    },
    {
        id: 2,
        name: "Дуффель-сумка ELITE",
        desc: "Прочная водонепроницаемая сумка для тренажерного зала",
        price: 4990,
        colors: [
            { name: "black", code: "#1a1a1a", img: "https://i.ebayimg.com/images/g/pMQAAOSw86JoQJJn/s-l400.jpg" },
            { name: "red", code: "#7b241c", img: "https://i.ebayimg.com/images/g/pMQAAOSw86JoQJJn/s-l400.jpg" }
        ]
    },
    {
        id: 3,
        name: "Боксёрская сумка",
        desc: "Специальная сумка для бокса и единоборств",
        price: 5990,
        colors: [
            { name: "black", code: "#1a1a1a", img: "https://ir.ozone.ru/s3/multimedia-4/6006562588.jpg" },
            { name: "blue", code: "#1a5276", img: "https://ir.ozone.ru/s3/multimedia-4/6006562588.jpg" }
        ]
    },
    {
        id: 4,
        name: "Рюкзак-сумка TRAVEL",
        desc: "Трансформер: рюкзак и сумка в одном",
        price: 6990,
        colors: [
            { name: "black", code: "#1a1a1a", img: "https://img-edg.joomcdn.net/aecdf126672a4ecbc3d589f9e30436343863f7ec_original.jpeg" },
            { name: "green", code: "#1e8449", img: "https://img-edg.joomcdn.net/aecdf126672a4ecbc3d589f9e30436343863f7ec_original.jpeg" }
        ]
    },
];

let cart = [];
let currentReviews = [
    { name: "Алексей", text: "Отличная сумка! Всё вмещается, качество на высоте.", rating: 5, date: "2025-03-15" },
    { name: "Дмитрий", text: "Покупал для зала, очень доволен. Прочная, удобная.", rating: 4, date: "2025-03-10" },
    { name: "Иван", text: "Быстрая доставка, сумка как на фото. Рекомендую!", rating: 5, date: "2025-03-05" }
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    renderReviews();
    createParticles();
    updateCartCount();
    setupEventListeners();
    setAnimationDelays();
});

// Создание частиц
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = Math.random() * 10 + 5 + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        container.appendChild(particle);
    }
}

// Отрисовка товаров
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}" style="transition: background-color 0.3s">
            <div class="product-image" style="background: ${product.colors[0].code}20">
                <img src="${product.colors[0].img}" alt="${product.name}" class="product-img">
                <span class="product-badge">Хит продаж</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <div class="color-options">
                    ${product.colors.map((color, idx) => `
                        <div class="color-btn ${idx === 0 ? 'active' : ''}" 
                             style="background: ${color.code}"
                             data-color="${color.name}"
                             data-color-code="${color.code}"
                             data-img="${color.img}">
                        </div>
                    `).join('')}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> В корзину
                </button>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для выбора цвета
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const colorBtns = card.querySelectorAll('.color-btn');
            colorBtns.forEach(cb => cb.classList.remove('active'));
            btn.classList.add('active');
            
            const img = btn.dataset.img;
            const productImage = card.querySelector('.product-img');
            const colorCode = btn.dataset.colorCode;
            
            productImage.src = img;
            card.style.backgroundColor = `${colorCode}10`;
            card.querySelector('.product-image').style.background = `${colorCode}20`;
        });
    });
    
    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === productId);
            const card = btn.closest('.product-card');
            const activeColor = card.querySelector('.color-btn.active');
            const color = activeColor ? activeColor.dataset.color : product.colors[0].name;
            const img = activeColor ? activeColor.dataset.img : product.colors[0].img;
            
            addToCart(product, color, img);
            
            // Анимация
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 200);
        });
    });
    
    // Эффект при движении мыши
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
        });
    });
}

// Добавление в корзину
function addToCart(product, color, img) {
    const existingItem = cart.find(item => item.id === product.id && item.color === color);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            color: color,
            img: img,
            quantity: 1
        });
    }
    renderCart();
    updateCartCount();
    showNotification(`Товар "${product.name}" добавлен в корзину!`);
    
    // Анимация корзины
    const cartIcon = document.querySelector('.cart-icon');
    cartIcon.style.transform = 'scale(1.1)';
    setTimeout(() => { cartIcon.style.transform = ''; }, 300);
}

// Отрисовка корзины
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Корзина пуста</p>
                <span>Добавьте товары из каталога</span>
            </div>
        `;
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${(item.price * item.quantity).toLocaleString()} ₽</div>
                <div class="cart-item-color">Цвет: ${item.color}</div>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                    <button class="quantity-btn" data-id="${item.id}" data-color="${item.color}" data-change="-1">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-color="${item.color}" data-change="1">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}" data-color="${item.color}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `${total.toLocaleString()} ₽`;
    
    // Обработчики для корзины
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const color = btn.dataset.color;
            cart = cart.filter(item => !(item.id === id && item.color === color));
            renderCart();
            updateCartCount();
            showNotification('Товар удален из корзины');
        });
    });
    
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const color = btn.dataset.color;
            const change = parseInt(btn.dataset.change);
            const item = cart.find(i => i.id === id && i.color === color);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => !(i.id === id && i.color === color));
                }
                renderCart();
                updateCartCount();
            }
        });
    });
}

// Обновление счетчика корзины
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Отрисовка отзывов
function renderReviews() {
    const container = document.getElementById('reviewsContainer');
    container.innerHTML = currentReviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="review-name">${review.name}</span>
                <div class="review-stars">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
}

// Добавление отзыва
function addReview(name, text, rating) {
    currentReviews.unshift({
        name: name,
        text: text,
        rating: rating,
        date: new Date().toISOString().split('T')[0]
    });
    renderReviews();
    showNotification('Спасибо за ваш отзыв!');
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00f2fe, #4facfe);
        color: #0a0a0a;
        padding: 15px 25px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Корзина
    const cartIcon = document.getElementById('cartIcon');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const clearCartBtn = document.getElementById('clearCartBtn');
    
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    });
    
    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('active');
    });
    
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Очистить корзину?')) {
            cart = [];
            renderCart();
            updateCartCount();
            showNotification('Корзина очищена');
        }
    });
    
    // Форма отзыва
    const reviewForm = document.getElementById('reviewForm');
    let selectedRating = 0;
    
    document.querySelectorAll('.rating i').forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            document.querySelectorAll('.rating i').forEach(s => {
                if (parseInt(s.dataset.rating) <= selectedRating) {
                    s.classList.remove('far');
                    s.classList.add('fas', 'active');
                } else {
                    s.classList.remove('fas', 'active');
                    s.classList.add('far');
                }
            });
        });
    });
    
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewName').value;
        const text = document.getElementById('reviewText').value;
        if (name && text && selectedRating > 0) {
            addReview(name, text, selectedRating);
            reviewForm.reset();
            selectedRating = 0;
            document.querySelectorAll('.rating i').forEach(s => {
                s.classList.remove('fas', 'active');
                s.classList.add('far');
            });
        } else {
            alert('Пожалуйста, заполните все поля и поставьте оценку');
        }
    });
    
    // Мобильное меню
    const mobileMenu = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    mobileMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        if (navMenu.classList.contains('active')) {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '80px';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'rgba(10,10,20,0.95)';
            navMenu.style.backdropFilter = 'blur(20px)';
            navMenu.style.padding = '20px';
            navMenu.style.gap = '20px';
        } else {
            navMenu.style.display = '';
        }
    });
    
    // Навигация
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navMenu.style.display = '';
            }
        });
    });
    
    // Подписка
    const subscribeForm = document.querySelector('.subscribe-form');
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = subscribeForm.querySelector('input');
        if (input.value) {
            showNotification('Подписка оформлена!');
            input.value = '';
        }
    });
}

// Анимация появления
function setAnimationDelays() {
    document.querySelectorAll('.product-card, .feature-card').forEach((el, idx) => {
        el.style.animationDelay = `${idx * 0.05}s`;
        el.style.opacity = '1';
    });
}

// Добавляем стили анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .nav-menu.active {
        display: flex !important;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);