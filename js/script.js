// ==================== БУРГЕР-МЕНЮ ====================
const burgerIcon = document.getElementById("burger-icon");
const menuLeft = document.getElementById("menu-left");
const menuRight = document.getElementById("menu-right");

if (burgerIcon) {
  burgerIcon.addEventListener("click", () => {
    menuLeft.classList.toggle("active");
    menuRight.classList.toggle("active");
    burgerIcon.classList.toggle("active");
  });
}

// ==================== ДАННЫЕ МЕРОПРИЯТИЙ (с разными городами) ====================
const events = {
  "2026-04-15": {
    title: "Встреча спикеров и создателей",
    time: "19:00",
    city: "Минск",
    address: "ул. Октябрьская, 16",
  },
  "2026-05-10": {
    title: "Концерт в EventSpace",
    time: "20:00",
    city: "Гомель",
    address: "ул. Советская, 8",
  },
  "2026-06-05": {
    title: "Нетворкинг вечер",
    time: "18:30",
    city: "Москва",
    address: "ул. Тверская, 12",
  },
  "2026-06-20": {
    title: "Мастер-класс по креативному мышлению",
    time: "17:00",
    city: "Санкт-Петербург",
    address: "Невский проспект, 45",
  },
  "2026-07-12": {
    title: "Летний перформанс",
    time: "21:00",
    city: "Гродно",
    address: "ул. Советская, 22",
  },
  "2026-08-15": {
    title: "Августовский концерт",
    time: "20:00",
    city: "Минск",
    address: "ул. Долгобродская, 16",
  },
};

let currentDate = new Date();

// ==================== КАЛЕНДАРЬ ====================
function renderCalendar() {
  const monthYear = document.getElementById("month-year");
  const daysContainer = document.getElementById("calendar-days");
  if (!monthYear || !daysContainer) return;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthYear.textContent = currentDate.toLocaleString("ru-RU", {
    month: "long",
    year: "numeric",
  });

  daysContainer.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = firstDay === 0 ? 6 : firstDay - 1;

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("other-month");
    daysContainer.appendChild(empty);
  }

  const todayStr = new Date().toISOString().slice(0, 10);

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEl = document.createElement("div");
    dayEl.textContent = day;

    if (dateStr === todayStr) dayEl.classList.add("today");
    if (events[dateStr]) {
      dayEl.classList.add("event-day");
      dayEl.style.cursor = "pointer";
      dayEl.title = events[dateStr].title;
      dayEl.addEventListener("click", () => openRegisterModal(dateStr));
    }
    daysContainer.appendChild(dayEl);
  }
}

// Навигация по месяцам
document.getElementById("prev-month")?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

document.getElementById("next-month")?.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// ==================== СЧЁТЧИК ====================
function startCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const targetDate = new Date("2026-05-10T20:00:00").getTime();

  setInterval(() => {
    const distance = targetDate - Date.now();
    if (distance < 0) {
      el.textContent = "Мероприятие уже началось!";
      return;
    }
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);
    el.innerHTML = `${d}д ${h}ч ${m}м ${s}с`;
  }, 1000);
}

// ==================== МОДАЛЬНОЕ ОКНО ====================
const modal = document.getElementById("register-modal");
const form = document.getElementById("register-form");
const eventSelect = document.getElementById("event-select");

function fillEventsSelect(selectedDate = null) {
  if (!eventSelect) return;
  eventSelect.innerHTML = '<option value="">— Выберите мероприятие —</option>';

  Object.keys(events).forEach((date) => {
    const opt = document.createElement("option");
    opt.value = date;
    opt.textContent = `${events[date].title} — ${date} в ${events[date].time}`;
    if (date === selectedDate) opt.selected = true;
    eventSelect.appendChild(opt);
  });
}

function openRegisterModal(selectedDate = null) {
  if (modal) {
    modal.style.display = "flex";
    fillEventsSelect(selectedDate);
  }
}

document
  .getElementById("open-register-btn")
  ?.addEventListener("click", () => openRegisterModal());

document.getElementById("close-modal")?.addEventListener("click", () => {
  if (modal) modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (modal && e.target === modal) modal.style.display = "none";
});

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    if (name && email) {
      alert(`Спасибо, ${name}!\nВы успешно зарегистрированы!`);
      if (modal) modal.style.display = "none";
      form.reset();
    } else {
      alert("Пожалуйста, заполните ФИО и Email.");
    }
  });
}

// ==================== ГЕНЕРАЦИЯ КАРТОЧЕК С SCHEMA.ORG ====================
function generateEventCards() {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  grid.innerHTML = "";

  Object.keys(events).forEach((dateStr) => {
    const event = events[dateStr];
    const eventDate = new Date(dateStr);

    const formattedDate = eventDate.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const cardHTML = `
      <article class="event-card" itemscope itemtype="https://schema.org/Event">
        <div class="event-card__date">
          <span itemprop="startDate" content="${dateStr}T${event.time}:00+03:00">
            ${formattedDate}
          </span>
          <span class="event-time">${event.time}</span>
        </div>
        
        <h3 itemprop="name">${event.title}</h3>
        
        <div class="event-card__location" itemprop="location" itemscope itemtype="https://schema.org/Place">
          <span itemprop="name">EventSpace ${event.city}</span><br>
          <span itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
            ${event.address}, ${event.city}
          </span>
        </div>

        <div class="event-card__actions">
          <button class="btn btn--small" onclick="openRegisterModal('${dateStr}')">
            Записаться
          </button>
        </div>

        <meta itemprop="eventStatus" content="https://schema.org/EventScheduled" />
        <meta itemprop="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
      </article>
    `;

    grid.innerHTML += cardHTML;
  });
}

// ==================== ФУНКЦИЯ ДЛЯ КНОПОК ====================
window.scrollToCalendar = function () {
  const section = document.getElementById("calendar-section");
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    console.error("Ошибка: Секция с id='calendar-section' не найдена!");
  }
};

// ==================== ЗАПУСК ====================
renderCalendar();
startCountdown();
generateEventCards();
