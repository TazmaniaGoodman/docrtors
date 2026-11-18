const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const whatsappNumber = "5535997191553";

// Mobile navigation: focus containment, Escape and a background that cannot be tabbed into.
const menuToggle = $(".menu-toggle");
const mobileMenu = $("#mobile-menu");
function setMenu(open, returnFocus = false) {
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Fechar menu de navegação" : "Abrir menu de navegação",
  );
  mobileMenu.inert = !open;
  mobileMenu.classList.toggle("is-open", open);
  document.body.classList.toggle("modal-open", open);
  $("main").inert = open;
  $(".footer").inert = open;
  $(".floating-whatsapp").inert = open;
  if (open)
    requestAnimationFrame(() =>
      $("a", mobileMenu).focus({ preventScroll: true }),
    );
  else if (returnFocus) menuToggle.focus({ preventScroll: true });
}
menuToggle.addEventListener("click", () =>
  setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
);
$$("a", mobileMenu).forEach((link) =>
  link.addEventListener("click", () => setMenu(false)),
);
const desktopQuery = matchMedia("(min-width: 900px)");
desktopQuery.addEventListener("change", (event) => {
  if (event.matches) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (menuToggle.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") {
    event.preventDefault();
    setMenu(false, true);
  }
  if (event.key === "Tab") {
    const links = $$("a", mobileMenu);
    if (
      event.shiftKey &&
      (document.activeElement === links[0] ||
        document.activeElement === menuToggle)
    ) {
      event.preventDefault();
      links.at(-1).focus();
    } else if (!event.shiftKey && document.activeElement === links.at(-1)) {
      event.preventDefault();
      menuToggle.focus();
    }
  }
});

// Only animate elements when an observer is available; content remains visible otherwise.
if ("IntersectionObserver" in window && !motionPreference.matches) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
  );
  $$(".reveal").forEach((element) => revealObserver.observe(element));
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      document.documentElement.classList.remove("motion-ready");
      revealObserver.disconnect();
    }
  });
}

// A very small scroll offset gives the desktop emblem depth. No scroll work on phones.
if ("IntersectionObserver" in window) {
  let heroVisible = true;
  let heroFrame = 0;
  const heroObserver = new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
  });
  heroObserver.observe($(".hero"));
  addEventListener(
    "scroll",
    () => {
      if (
        !heroVisible ||
        !desktopQuery.matches ||
        motionPreference.matches ||
        heroFrame
      )
        return;
      heroFrame = requestAnimationFrame(() => {
        $(".emblem").style.translate = `0 ${Math.min(16, scrollY * 0.035)}px`;
        heroFrame = 0;
      });
    },
    { passive: true },
  );
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) $(".emblem").style.translate = "";
  });
  desktopQuery.addEventListener("change", (event) => {
    if (!event.matches) $(".emblem").style.translate = "";
  });
}

// Lightweight lightbox. Full original framing, keyboard navigation and horizontal touch gestures.
const photos = [
  {
    src: "./assets/images/fachada-1360.webp",
    title: "Bem-vindo à Doctors",
    description: "Fachada · Rua Afonso Pena, 103, Centro de Pouso Alegre.",
    alt: "Fotografia completa da fachada real da Doctors Odontologia e Saúde.",
    width: 1360,
    height: 1017,
  },
  {
    src: "./assets/images/consultorio-800.webp",
    title: "Um encontro com o cuidado",
    description: "Consultório com mesa, cadeiras e maca de atendimento.",
    alt: "Fotografia completa do consultório da Doctors, com mesa e maca.",
    width: 765,
    height: 1020,
  },
  {
    src: "./assets/images/sala-odontologica-800.webp",
    title: "Seu conforto tem lugar aqui",
    description: "Sala de atendimento com cadeira odontológica.",
    alt: "Fotografia completa da sala com cadeira odontológica da Doctors.",
    width: 764,
    height: 1020,
  },
];
const lightbox = $("#lightbox");
let activePhoto = 0;
let galleryTrigger;
function showPhoto(index) {
  activePhoto = (index + photos.length) % photos.length;
  const photo = photos[activePhoto];
  const image = $("#lightbox-image");
  image.src = photo.src;
  image.alt = photo.alt;
  image.width = photo.width;
  image.height = photo.height;
  $("#lightbox-title").textContent = photo.title;
  $("#lightbox-description").textContent = photo.description;
  $("#lightbox-counter").textContent = `0${activePhoto + 1} / 03`;
}
$$("[data-photo]").forEach((button) =>
  button.addEventListener("click", () => {
    galleryTrigger = button;
    showPhoto(Number(button.dataset.photo));
    lightbox.showModal();
    document.body.classList.add("modal-open");
    $(".lightbox-close").focus({ preventScroll: true });
  }),
);
$(".lightbox-close").addEventListener("click", () => lightbox.close());
$(".lightbox-prev").addEventListener("click", () => showPhoto(activePhoto - 1));
$(".lightbox-next").addEventListener("click", () => showPhoto(activePhoto + 1));
lightbox.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  galleryTrigger?.focus({ preventScroll: true });
});
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(activePhoto + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPhoto(activePhoto - 1);
  }
});
let touchStart;
$(".lightbox-stage").addEventListener(
  "touchstart",
  (event) => {
    if (event.touches.length === 1)
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    else touchStart = null;
  },
  { passive: true },
);
$(".lightbox-stage").addEventListener(
  "touchend",
  (event) => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
      showPhoto(activePhoto + (dx < 0 ? 1 : -1));
    touchStart = null;
  },
  { passive: true },
);
$(".lightbox-stage").addEventListener(
  "touchcancel",
  () => {
    touchStart = null;
  },
  { passive: true },
);

// Dates are civil dates in the clinic's timezone; no UTC conversion can move a day.
function clinicToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const part = (type) => Number(parts.find((item) => item.type === type).value);
  return new Date(part("year"), part("month") - 1, part("day"), 12);
}
function civilKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function displayDate(date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}
const dateInput = $("#desired-date");
const calendar = $("#date-picker");
const calendarDays = $("#calendar-days");
let calendarMonth = new Date(
  clinicToday().getFullYear(),
  clinicToday().getMonth(),
  1,
  12,
);
let chosenDate = null;
function renderCalendar(focusDate) {
  const today = clinicToday();
  const currentMonthKey = today.getFullYear() * 12 + today.getMonth();
  const visibleMonthKey =
    calendarMonth.getFullYear() * 12 + calendarMonth.getMonth();
  $(".calendar-prev").disabled = visibleMonthKey <= currentMonthKey;
  $("#calendar-month").textContent = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(calendarMonth);
  calendarDays.replaceChildren();
  for (let offset = 0; offset < calendarMonth.getDay(); offset++)
    calendarDays.append(document.createElement("span"));
  const count = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0,
  ).getDate();
  for (let day = 1; day <= count; day++) {
    const date = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day,
      12,
    );
    const key = civilKey(date);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.textContent = day;
    button.dataset.date = key;
    button.disabled = key < civilKey(today);
    button.setAttribute(
      "aria-label",
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date),
    );
    if (key === civilKey(today)) {
      button.classList.add("today");
      button.setAttribute("aria-current", "date");
    }
    const selected = chosenDate && key === civilKey(chosenDate);
    button.classList.toggle("selected", Boolean(selected));
    button.setAttribute("aria-pressed", String(Boolean(selected)));
    button.addEventListener("click", () => {
      chosenDate = date;
      dateInput.value = displayDate(date);
      dateInput.dataset.value = key;
      clearError(dateInput);
      closeCalendar(true);
    });
    calendarDays.append(button);
  }
  if (focusDate)
    $(`[data-date="${civilKey(focusDate)}"]`, calendarDays)?.focus();
}
function openCalendar() {
  const today = clinicToday();
  const start =
    chosenDate && civilKey(chosenDate) >= civilKey(today) ? chosenDate : today;
  calendarMonth = new Date(start.getFullYear(), start.getMonth(), 1, 12);
  calendar.hidden = false;
  dateInput.setAttribute("aria-expanded", "true");
  renderCalendar(start);
}
function closeCalendar(focus = false) {
  calendar.hidden = true;
  dateInput.setAttribute("aria-expanded", "false");
  if (focus) dateInput.focus({ preventScroll: true });
}
dateInput.addEventListener("click", () =>
  calendar.hidden ? openCalendar() : closeCalendar(),
);
$(".date-toggle").addEventListener("click", () =>
  calendar.hidden ? openCalendar() : closeCalendar(true),
);
dateInput.addEventListener("keydown", (event) => {
  if (["Enter", " ", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    openCalendar();
  }
});
$(".calendar-prev").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() - 1);
  renderCalendar();
});
$(".calendar-next").addEventListener("click", () => {
  calendarMonth.setMonth(calendarMonth.getMonth() + 1);
  renderCalendar();
});
$("#calendar-close").addEventListener("click", () => closeCalendar(true));
document.addEventListener("click", (event) => {
  if (!calendar.hidden && !event.target.closest(".date-field")) closeCalendar();
});
calendar.addEventListener("focusout", (event) => {
  // relatedTarget is reliable while the browser transfers focus between calendar buttons.
  // Reading activeElement during focusout can temporarily return <body> and close it early.
  if (event.relatedTarget && !$(".date-field").contains(event.relatedTarget))
    closeCalendar();
});
calendar.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    event.stopPropagation();
    closeCalendar(true);
  }
  const focused = document.activeElement;
  if (!focused.matches(".calendar-day")) return;
  const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 };
  if (event.key in moves) {
    event.preventDefault();
    const [year, month, day] = focused.dataset.date.split("-").map(Number);
    const next = new Date(year, month - 1, day + moves[event.key], 12);
    if (civilKey(next) < civilKey(clinicToday())) return;
    calendarMonth = new Date(next.getFullYear(), next.getMonth(), 1, 12);
    renderCalendar(next);
  }
});

// Patient data only builds a WhatsApp URL; nothing is persisted or sent to a server.
const form = $("#booking-form");
const phoneInput = $("#phone");
phoneInput.addEventListener("input", () => {
  const numbers = phoneInput.value.replace(/\D/g, "").slice(0, 11);
  let formatted = numbers;
  if (numbers.length > 2)
    formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  else if (numbers.length) formatted = `(${numbers}`;
  if (numbers.length > 6) {
    const split = numbers.length > 10 ? 7 : 6;
    formatted = `(${numbers.slice(0, 2)}) ${numbers.slice(2, split)}-${numbers.slice(split)}`;
  }
  phoneInput.value = formatted;
});
const errorIds = {
  name: "name-error",
  phone: "phone-error",
  interest: "interest-error",
  date: "date-error",
};
function clearError(input) {
  input.removeAttribute("aria-invalid");
  const id = errorIds[input.name];
  if (id) $("#" + id).textContent = "";
}
$$("input, textarea", form).forEach((input) =>
  input.addEventListener("input", () => {
    clearError(input);
    $("#form-status").replaceChildren();
  }),
);
function setError(input, message) {
  input.setAttribute("aria-invalid", "true");
  $("#" + errorIds[input.name]).textContent = message;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("#full-name");
  const interest = $("#interest");
  const notes = $("#notes");
  [name, phoneInput, interest, dateInput].forEach(clearError);
  if (
    name.value.trim().split(/\s+/).filter(Boolean).length < 2 ||
    name.value.trim().length < 5
  )
    setError(name, "Informe seu nome e sobrenome.");
  if (
    !/^[1-9]{2}(?:9\d{8}|[2-8]\d{7})$/.test(phoneInput.value.replace(/\D/g, ""))
  )
    setError(phoneInput, "Informe um telefone válido com DDD.");
  if (interest.value.trim().length < 3)
    setError(interest, "Conte o que você procura ou escreva “avaliação”.");
  if (!chosenDate || civilKey(chosenDate) < civilKey(clinicToday()))
    setError(dateInput, "Selecione hoje ou uma data futura.");
  const firstError = $('[aria-invalid="true"]', form);
  if (firstError) {
    firstError.focus();
    return;
  }
  const message = `Olá, equipe Doctors! Gostaria de consultar a disponibilidade para uma avaliação odontológica.\n\nNome: ${name.value.trim()}\nTelefone: ${phoneInput.value}\nTratamento de interesse: ${interest.value.trim()}\nData desejada: ${displayDate(chosenDate)}\nObservações: ${notes.value.trim() || "Não informadas."}\n\nVocês possuem disponibilidade para essa data?`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  const status = $("#form-status");
  const text = document.createElement("span");
  text.textContent =
    "Sua mensagem está pronta. Continue no WhatsApp para conversar com a equipe. ";
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Se não abriu, toque aqui.";
  status.replaceChildren(text, link);
});

// Keep the floating control clear of the main form and the footer.
if ("IntersectionObserver" in window) {
  const hiddenBy = new Set();
  const floatingObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) hiddenBy.add(entry.target);
        else hiddenBy.delete(entry.target);
      });
      const hidden = hiddenBy.size > 0;
      $(".floating-whatsapp").classList.toggle("is-hidden", hidden);
      $(".floating-whatsapp").inert = hidden;
    },
    { threshold: 0.12 },
  );
  floatingObserver.observe(form);
  floatingObserver.observe($(".footer"));
}
$("#year").textContent = String(clinicToday().getFullYear());
