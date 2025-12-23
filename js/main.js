// Основной JavaScript файл для сайта судов
document.addEventListener('DOMContentLoaded', function() {
    
    // Инициализация всех компонентов
    initNewsSlider();
    initFAQ();
    initModals();
    initCourtFilter();
    initDateFilter();
    initAccessibility();
    initCourtCategories();
    initTableInteractions();
    
    // Дополнительная инициализация модальных окон после загрузки DOM
    setTimeout(() => {
        initModalCloseButtons();
    }, 100);
    
    // Функция для инициализации кнопок закрытия модальных окон
    function initModalCloseButtons() {
        const closeButtons = document.querySelectorAll('.modal__close');
        closeButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    // Слайдер новостей
    function initNewsSlider() {
        const slider = document.querySelector('.news__slider');
        if (!slider) return;
        
        const prevBtn = slider.querySelector('.news__arrow--prev');
        const nextBtn = slider.querySelector('.news__arrow--next');
        const dots = slider.querySelectorAll('.news__dot');
        
        let currentSlide = 0;
        const slides = [
            {
                image: 'images/news1.jpg',
                text: 'Сергиево-Посадский городской суд составил в июле Верховное представление Суда о динамике дел по заместителю председателя Сергиево-Посадского городского суда Московской области Шапиро Е.Г. в качестве председателя по делу о дисциплинарной ответственности по ФЗ, событий Московской области.'
            },
            {
                image: 'images/news2.jpg',
                text: 'В Сергиево-Посадском городском суде прошло совещание по вопросам совершенствования судебного делопроизводства и повышения качества рассмотрения дел.'
            },
            {
                image: 'images/news3.jpg',
                text: 'Председатель суда принял участие в региональном совещании председателей судов Московской области по обсуждению актуальных вопросов судебной практики.'
            }
        ];
        
        function updateSlide(index) {
            const content = slider.querySelector('.news__content');
            const img = content.querySelector('.news__img');
            const text = content.querySelector('.news__text p');
            
            if (img && text) {
                img.src = slides[index].image;
                img.alt = `Новость ${index + 1}`;
                text.textContent = slides[index].text;
            }
            
            // Обновляем точки
            dots.forEach((dot, i) => {
                dot.classList.toggle('news__dot--active', i === index);
            });
            
            currentSlide = index;
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const newIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
                updateSlide(newIndex);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const newIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
                updateSlide(newIndex);
            });
        }
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlide(index);
            });
        });
        
        // Автопрокрутка
        setInterval(() => {
            const newIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
            updateSlide(newIndex);
        }, 5000);
    }
    
    // FAQ аккордеон
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq__question, .faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqId = question.getAttribute('data-faq');
                const answer = document.getElementById(`faq-${faqId}`);
                
                // Для старой структуры FAQ
                const icon = question.querySelector('.faq__icon');
                if (icon) {
                    const isActive = answer.classList.contains('active');
                    
                    // Закрываем все другие ответы
                    document.querySelectorAll('.faq__answer').forEach(ans => {
                        ans.classList.remove('active');
                    });
                    document.querySelectorAll('.faq__icon').forEach(ic => {
                        ic.textContent = '+';
                        ic.style.transform = 'rotate(0deg)';
                    });
                    
                    if (!isActive) {
                        answer.classList.add('active');
                        icon.textContent = '−';
                        icon.style.transform = 'rotate(180deg)';
                    }
                }
                
                // Для новой структуры FAQ (help.html)
                if (question.classList.contains('faq-question')) {
                    const isActive = question.classList.contains('active');
                    
                    // Закрываем все другие ответы
                    document.querySelectorAll('.faq-question').forEach(q => {
                        q.classList.remove('active');
                    });
                    document.querySelectorAll('.faq-answer').forEach(ans => {
                        ans.classList.remove('active');
                    });
                    
                    if (!isActive && answer) {
                        question.classList.add('active');
                        answer.classList.add('active');
                    }
                }
            });
        });
    }
    
    // Модальные окна
    function initModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        let modals = document.querySelectorAll('.modal');
        
        // Создаем модальные окна если их нет
        createModals();
        
        // Обновляем список модальных окон после создания
        modals = document.querySelectorAll('.modal');
        const modalCloses = document.querySelectorAll('.modal__close');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalName = trigger.getAttribute('data-modal');
                const modal = document.getElementById(`modal-${modalName}`);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
        
        // Обработчики для крестиков закрытия
        function attachCloseHandlers() {
            const closeButtons = document.querySelectorAll('.modal__close');
            closeButtons.forEach(close => {
                // Удаляем старые обработчики
                close.replaceWith(close.cloneNode(true));
            });
            
            // Добавляем новые обработчики
            document.querySelectorAll('.modal__close').forEach(close => {
                close.addEventListener('click', (e) => {
                    e.preventDefault();
                    const modal = close.closest('.modal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
        
        // Вызываем функцию для привязки обработчиков
        attachCloseHandlers();
        
        // Закрытие по клику на фон
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        });
    }
    
    function createModals() {
        // Модальное окно с графиком работы
        if (!document.getElementById('modal-schedule')) {
            const scheduleModal = document.createElement('div');
            scheduleModal.id = 'modal-schedule';
            scheduleModal.className = 'modal';
            scheduleModal.innerHTML = `
                <div class="modal__content">
                    <button class="modal__close" type="button">&times;</button>
                    <h2 class="modal__title">График работы суда</h2>
                    <table class="schedule__table">
                        <thead>
                            <tr>
                                <th>День недели</th>
                                <th>Часы работы</th>
                                <th>Обеденный перерыв</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Понедельник</td><td>9:00-18:00</td><td>13:00-14:00</td></tr>
                            <tr><td>Вторник</td><td>9:00-18:00</td><td>13:00-14:00</td></tr>
                            <tr><td>Среда</td><td>9:00-18:00</td><td>13:00-14:00</td></tr>
                            <tr><td>Четверг</td><td>9:00-18:00</td><td>13:00-14:00</td></tr>
                            <tr><td>Пятница</td><td>9:00-16:45</td><td>13:00-14:00</td></tr>
                            <tr><td>Суббота</td><td>Выходной</td><td>—</td></tr>
                            <tr><td>Воскресенье</td><td>Выходной</td><td>—</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
            document.body.appendChild(scheduleModal);
        }
        
        // Модальное окно с контактами
        if (!document.getElementById('modal-contacts')) {
            const contactsModal = document.createElement('div');
            contactsModal.id = 'modal-contacts';
            contactsModal.className = 'modal';
            contactsModal.innerHTML = `
                <div class="modal__content">
                    <button class="modal__close" type="button">&times;</button>
                    <h2 class="modal__title">Контактная информация</h2>
                    <div class="contact-info">
                        <div class="contact-info__item">
                            <h3 class="contact-info__title">Канцелярия суда</h3>
                            <p class="contact-info__text">
                                <strong>Телефон:</strong> +7 (496) 540-22-90<br>
                                <strong>Время работы:</strong> Пн-Пт: 9:00-17:00
                            </p>
                        </div>
                        <div class="contact-info__item">
                            <h3 class="contact-info__title">Архив суда</h3>
                            <p class="contact-info__text">
                                <strong>Телефон:</strong> +7 (496) 153-23-20<br>
                                <strong>Время работы:</strong> Вт, Чт: 10:00-16:00
                            </p>
                        </div>
                        <div class="contact-info__item">
                            <h3 class="contact-info__title">Адрес</h3>
                            <p class="contact-info__text">
                                141300, Московская обл., г. Сергиев Посад, пл. Советская, д. 2, 255 Б
                            </p>
                        </div>
                        <div class="contact-info__item">
                            <h3 class="contact-info__title">Электронная почта</h3>
                            <p class="contact-info__text">
                                📧 sergiev.pos@sudrf.ru
                            </p>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(contactsModal);
        }
    }
    
    // Фильтр судов
    function initCourtFilter() {
        const filterBtn = document.getElementById('apply-filter');
        const courtTypeSelect = document.getElementById('court-type');
        const courtRegionSelect = document.getElementById('court-region');
        const courtCards = document.querySelectorAll('.court-card');
        
        if (filterBtn) {
            filterBtn.addEventListener('click', () => {
                const selectedType = courtTypeSelect ? courtTypeSelect.value : '';
                const selectedRegion = courtRegionSelect ? courtRegionSelect.value : '';
                
                courtCards.forEach(card => {
                    const cardType = card.getAttribute('data-type');
                    const cardRegion = card.getAttribute('data-region');
                    
                    const typeMatch = !selectedType || cardType === selectedType;
                    const regionMatch = !selectedRegion || cardRegion === selectedRegion;
                    
                    if (typeMatch && regionMatch) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Фильтр дат для судебного делопроизводства
    function initDateFilter() {
        const dateInput = document.getElementById('date-filter');
        const applyBtn = document.getElementById('apply-date-filter');
        const selectedDateSpan = document.getElementById('selected-date');
        
        if (dateInput && applyBtn && selectedDateSpan) {
            applyBtn.addEventListener('click', () => {
                const selectedDate = dateInput.value;
                if (selectedDate) {
                    // Форматируем дату в читаемый вид
                    const date = new Date(selectedDate);
                    const options = { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    };
                    const formattedDate = date.toLocaleDateString('ru-RU', options);
                    
                    // Обновляем текст в заголовке
                    selectedDateSpan.textContent = formattedDate;
                    
                    // Здесь можно добавить логику для фильтрации дел по дате
                    console.log(`Фильтр применен для даты: ${formattedDate}`);
                    
                    // Показываем уведомление
                    showNotification(`Показаны дела на ${formattedDate}`);
                } else {
                    alert('Пожалуйста, выберите дату');
                }
            });
            
            // Обработка Enter в поле даты
            dateInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyBtn.click();
                }
            });
        }
    }
    
    // Функция для показа уведомлений
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Показываем уведомление
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Функция доступности
    function initAccessibility() {
        const accessibilityToggle = document.getElementById('accessibility-toggle');
        let isHighContrast = false;
        
        if (accessibilityToggle) {
            accessibilityToggle.addEventListener('click', () => {
                isHighContrast = !isHighContrast;
                
                if (isHighContrast) {
                    document.body.classList.add('high-contrast');
                    accessibilityToggle.textContent = '👁️‍🗨️';
                } else {
                    document.body.classList.remove('high-contrast');
                    accessibilityToggle.textContent = '👁';
                }
            });
        }
        
        // Добавляем стили для высокого контраста
        if (!document.getElementById('accessibility-styles')) {
            const style = document.createElement('style');
            style.id = 'accessibility-styles';
            style.textContent = `
                .high-contrast {
                    filter: contrast(150%) brightness(120%);
                }
                .high-contrast .header {
                    background-color: #000 !important;
                }
                .high-contrast .footer {
                    background-color: #000 !important;
                }
                .high-contrast .header__nav-item--active {
                    background-color: #fff !important;
                    color: #000 !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Категории судов
    function initCourtCategories() {
        const categoryBtns = document.querySelectorAll('.court-categories__btn');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                
                // Анимация нажатия
                btn.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
                
                // Здесь можно добавить логику для показа подробной информации о суде
                console.log(`Выбрана категория: ${category}`);
                
                // Можно добавить модальное окно или переход на другую страницу
                showCourtDetails(category);
            });
        });
    }
    
    function showCourtDetails(category) {
        // Создаем модальное окно с информацией о суде
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal__content">
                <button class="modal__close">&times;</button>
                <h2 class="modal__title">Информация о суде</h2>
                <p>Подробная информация о суде категории: ${category}</p>
                <p>Здесь будет отображаться контактная информация, адрес, график работы и другие данные.</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Обработчик закрытия
        const closeBtn = modal.querySelector('.modal__close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    }
    
    // Интерактивность таблиц
    function initTableInteractions() {
        const tableRows = document.querySelectorAll('.proceedings__table tbody tr');
        
        tableRows.forEach(row => {
            row.addEventListener('click', () => {
                // Подсветка выбранной строки
                tableRows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
                
                // Анимация
                row.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    row.style.transform = 'scale(1)';
                }, 200);
            });
        });
        
        // Добавляем стили для выбранной строки
        if (!document.getElementById('table-styles')) {
            const style = document.createElement('style');
            style.id = 'table-styles';
            style.textContent = `
                .proceedings__table tbody tr.selected {
                    background-color: var(--primary-color) !important;
                    color: white;
                }
                .proceedings__table tbody tr {
                    transition: all 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Поиск по сайту
    const searchInput = document.querySelector('.header__search-input');
    const searchBtn = document.querySelector('.header__search-btn');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Простая реализация поиска по содержимому страницы
            const content = document.body.textContent.toLowerCase();
            if (content.includes(query.toLowerCase())) {
                alert(`Найдено совпадение для: "${query}"`);
                // Здесь можно добавить подсветку найденного текста
                highlightSearchResults(query);
            } else {
                alert(`По запросу "${query}" ничего не найдено`);
            }
        }
    }
    
    function highlightSearchResults(query) {
        // Простая подсветка найденного текста
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<mark>$1</mark>');
                const span = document.createElement('span');
                span.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(span, textNode);
            }
        });
        
        // Убираем подсветку через 5 секунд
        setTimeout(() => {
            const marks = document.querySelectorAll('mark');
            marks.forEach(mark => {
                const parent = mark.parentNode;
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
                parent.normalize();
            });
        }, 5000);
    }
    
    // Анимации при скролле
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами
        const animatedElements = document.querySelectorAll('.court-card, .function-card, .faq__item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Инициализируем анимации при скролле
    initScrollAnimations();
    
    // Обработка кнопок судебных актов
    const actButtons = document.querySelectorAll('.proceedings__table td:last-child');
    actButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('Открытие судебного акта...');
            // Здесь можно добавить логику для открытия PDF или другого документа
        });
    });
    
    // Делегирование событий для модальных окон
    document.addEventListener('click', function(e) {
        // Обработка кнопок закрытия модальных окон
        if (e.target.classList.contains('modal__close')) {
            e.preventDefault();
            e.stopPropagation();
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        
        // Обработка кликов по фону модального окна
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Обработка формы сообщения об ошибке
    initErrorReportForm();
    
    function initErrorReportForm() {
        const errorForm = document.getElementById('error-form');
        const closeModalBtns = document.querySelectorAll('[data-close-modal]');
        
        if (errorForm) {
            errorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Получаем данные формы
                const formData = new FormData(errorForm);
                const errorData = {
                    type: formData.get('error-type'),
                    page: formData.get('error-page'),
                    description: formData.get('error-description'),
                    email: formData.get('user-email'),
                    name: formData.get('user-name'),
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                };
                
                // Показываем индикатор загрузки
                const submitBtn = errorForm.querySelector('.form-btn--primary');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                // Симуляция отправки (в реальном проекте здесь был бы AJAX запрос)
                setTimeout(() => {
                    // Показываем сообщение об успехе
                    showFormMessage('success', 'Ваше сообщение об ошибке успешно отправлено! Спасибо за помощь в улучшении сайта.');
                    
                    // Очищаем форму
                    errorForm.reset();
                    
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    
                    // Закрываем модальное окно через 3 секунды
                    setTimeout(() => {
                        const modal = document.getElementById('modal-error-report');
                        if (modal) {
                            modal.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                    }, 3000);
                    
                    // В реальном проекте здесь был бы код отправки на сервер
                    console.log('Отправлены данные об ошибке:', errorData);
                    
                }, 1500); // Симуляция задержки сети
            });
        }
        
        // Обработчики для кнопок закрытия
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = document.getElementById('modal-error-report');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }
    
    function showFormMessage(type, message) {
        const errorForm = document.getElementById('error-form');
        if (!errorForm) return;
        
        // Удаляем предыдущие сообщения
        const existingMessages = errorForm.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());
        
        // Создаем новое сообщение
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
        messageDiv.textContent = message;
        
        // Вставляем сообщение в начало формы
        errorForm.insertBefore(messageDiv, errorForm.firstChild);
        
        // Прокручиваем к сообщению
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    console.log('Все компоненты инициализированы успешно!');
});
// АДАПТИВНЫЕ УЛУЧШЕНИЯ ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ

// Инициализация адаптивных функций
document.addEventListener('DOMContentLoaded', function() {
    initMobileEnhancements();
    initTouchGestures();
    initResponsiveNavigation();
    initMobileTableScroll();
    initViewportHeightFix();
});

// Основные мобильные улучшения
function initMobileEnhancements() {
    // Определение типа устройства
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
    
    if (isTablet) {
        document.body.classList.add('tablet-device');
    }
    
    // Улучшение производительности на мобильных
    if (isMobile) {
        // Отключаем анимации на слабых устройствах
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.body.classList.add('reduced-motion');
        }
        
        // Оптимизация скролла
        document.addEventListener('touchstart', function() {}, { passive: true });
        document.addEventListener('touchmove', function() {}, { passive: true });
    }
}

// Жесты для сенсорных устройств
function initTouchGestures() {
    let startX = 0;
    let startY = 0;
    let isScrolling = false;
    
    // Свайп для слайдера новостей
    const newsSlider = document.querySelector('.news__slider');
    if (newsSlider) {
        newsSlider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        }, { passive: true });
        
        newsSlider.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            const diffX = Math.abs(e.touches[0].clientX - startX);
            const diffY = Math.abs(e.touches[0].clientY - startY);
            
            if (diffY > diffX) {
                isScrolling = true;
            }
        }, { passive: true });
        
        newsSlider.addEventListener('touchend', function(e) {
            if (isScrolling) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Минимальное расстояние для свайпа
                if (diffX > 0) {
                    // Свайп влево - следующий слайд
                    const nextBtn = newsSlider.querySelector('.news__arrow--next');
                    if (nextBtn) nextBtn.click();
                } else {
                    // Свайп вправо - предыдущий слайд
                    const prevBtn = newsSlider.querySelector('.news__arrow--prev');
                    if (prevBtn) prevBtn.click();
                }
            }
            
            startX = 0;
            startY = 0;
        }, { passive: true });
    }
}

// Адаптивная навигация
function initResponsiveNavigation() {
    const nav = document.querySelector('.header__nav');
    if (!nav) return;
    
    // Добавляем индикатор прокрутки для навигации только на мобильных
    function updateScrollIndicator() {
        // Проверяем, что мы на мобильном устройстве
        if (window.innerWidth > 768) return;
        
        const scrollLeft = nav.scrollLeft;
        const scrollWidth = nav.scrollWidth;
        const clientWidth = nav.clientWidth;
        
        // Удаляем старые индикаторы
        nav.classList.remove('scroll-start', 'scroll-middle', 'scroll-end');
        
        if (scrollLeft === 0) {
            nav.classList.add('scroll-start');
        } else if (scrollLeft + clientWidth >= scrollWidth - 1) {
            nav.classList.add('scroll-end');
        } else {
            nav.classList.add('scroll-middle');
        }
    }
    
    nav.addEventListener('scroll', updateScrollIndicator, { passive: true });
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', updateScrollIndicator);
    
    updateScrollIndicator(); // Инициализация
    
    // Плавная прокрутка к активному элементу только на мобильных
    const activeNavItem = nav.querySelector('.header__nav-item--active');
    if (activeNavItem && window.innerWidth <= 768) {
        setTimeout(() => {
            activeNavItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }, 100);
    }
}

// Улучшение прокрутки таблиц на мобильных
function initMobileTableScroll() {
    const tables = document.querySelectorAll('.schedule__table, .proceedings__table');
    
    tables.forEach(table => {
        const wrapper = table.parentElement;
        
        // Добавляем индикатор прокрутки
        const scrollIndicator = document.createElement('div');
        scrollIndicator.className = 'table-scroll-indicator';
        scrollIndicator.innerHTML = '← Прокрутите для просмотра →';
        
        // Стили для индикатора
        scrollIndicator.style.cssText = `
            text-align: center;
            font-size: 12px;
            color: var(--gray-dark);
            padding: 5px;
            background: var(--gray-light);
            border-radius: 4px;
            margin-bottom: 10px;
            display: none;
        `;
        
        wrapper.insertBefore(scrollIndicator, table);
        
        // Показываем индикатор только на мобильных если таблица прокручивается
        function checkScrollable() {
            if (window.innerWidth <= 768 && table.scrollWidth > table.clientWidth) {
                scrollIndicator.style.display = 'block';
            } else {
                scrollIndicator.style.display = 'none';
            }
        }
        
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        
        // Скрываем индикатор после первой прокрутки
        table.addEventListener('scroll', function() {
            scrollIndicator.style.display = 'none';
        }, { once: true });
    });
}

// Исправление высоты viewport на мобильных устройствах
function initViewportHeightFix() {
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
}

// Улучшение работы с формами на мобильных
function initMobileFormEnhancements() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Предотвращаем зум при фокусе на iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            input.addEventListener('focus', function() {
                if (parseFloat(getComputedStyle(input).fontSize) < 16) {
                    input.style.fontSize = '16px';
                }
            });
            
            input.addEventListener('blur', function() {
                input.style.fontSize = '';
            });
        }
        
        // Улучшение UX для обязательных полей
        if (input.hasAttribute('required')) {
            input.addEventListener('invalid', function() {
                input.classList.add('error');
            });
            
            input.addEventListener('input', function() {
                if (input.validity.valid) {
                    input.classList.remove('error');
                }
            });
        }
    });
}

// Оптимизация изображений для мобильных
function initMobileImageOptimization() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Ленивая загрузка для изображений
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        } else {
            // Полифилл для старых браузеров
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        }
        
        // Обработка ошибок загрузки изображений
        img.addEventListener('error', function() {
            this.style.display = 'none';
            
            // Создаем заглушку
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = `
                width: 100%;
                height: 200px;
                background: var(--gray-light);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--gray-dark);
                font-size: 14px;
                border-radius: 8px;
            `;
            placeholder.textContent = 'Изображение недоступно';
            
            this.parentNode.insertBefore(placeholder, this);
        });
    });
}

// Улучшение производительности на мобильных
function initPerformanceOptimizations() {
    // Дебаунс для событий resize и scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Оптимизированные обработчики
    const debouncedResize = debounce(() => {
        // Код для обработки изменения размера окна
        updateLayoutForViewport();
    }, 250);
    
    const throttledScroll = debounce(() => {
        // Код для обработки скролла
        updateScrollPosition();
    }, 16); // ~60fps
    
    window.addEventListener('resize', debouncedResize);
    window.addEventListener('scroll', throttledScroll, { passive: true });
}

function updateLayoutForViewport() {
    // Обновление макета при изменении размера окна
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    document.body.classList.toggle('mobile-layout', isMobile);
    document.body.classList.toggle('tablet-layout', isTablet);
    document.body.classList.toggle('desktop-layout', !isMobile && !isTablet);
}

function updateScrollPosition() {
    // Обновление позиции скролла для различных эффектов
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Параллакс эффект для заголовков (только на десктопе)
    if (window.innerWidth > 1024) {
        const headers = document.querySelectorAll('.page-title, .about-title, .help-title');
        headers.forEach(header => {
            header.style.transform = `translateY(${rate}px)`;
        });
    }
}

// Инициализация всех мобильных улучшений
document.addEventListener('DOMContentLoaded', function() {
    initMobileFormEnhancements();
    initMobileImageOptimization();
    initPerformanceOptimizations();
    updateLayoutForViewport();
});

// Обработка изменения ориентации устройства
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        updateLayoutForViewport();
        
        // Принудительный перерасчет высоты на iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            window.scrollTo(0, window.pageYOffset);
        }
    }, 100);
});

// Добавляем CSS для мобильных улучшений
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    .mobile-device .court-card:hover,
    .mobile-device .function-card:hover {
        transform: none;
    }
    
    .mobile-device .news__arrow {
        opacity: 0.8;
    }
    
    .tablet-device .header__nav {
        padding-bottom: 5px;
    }
    
    .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    .table-scroll-indicator {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
    }
    
    .header__nav.scroll-start::after {
        content: "→";
        opacity: 1;
    }
    
    .header__nav.scroll-end::after {
        content: "←";
        opacity: 1;
    }
    
    .header__nav.scroll-middle::after {
        content: "↔";
        opacity: 0.7;
    }
    
    input.error,
    select.error,
    textarea.error {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2) !important;
    }
    
    @media (max-width: 768px) {
        .mobile-layout .court-card {
            margin-bottom: 15px;
        }
        
        .mobile-layout .function-card {
            margin-bottom: 15px;
        }
        
        .mobile-layout .modal__content {
            max-height: calc(100vh - 40px);
            overflow-y: auto;
        }
    }
    
    @media (max-width: 480px) {
        .mobile-layout .header__search-input {
            font-size: 16px !important;
        }
        
        .mobile-layout .form-input,
        .mobile-layout .form-select,
        .mobile-layout .form-textarea {
            font-size: 16px !important;
        }
    }
`;

document.head.appendChild(mobileStyles);

console.log('Мобильные улучшения инициализированы успешно!');