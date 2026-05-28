/**
 * ==========================================================================
 * LOGICA DEL CALENDARIO DE EVENTOS - PEÑA DE LAS BELLAS ARTES DE LA PLATA
 * Interacciones, renderizado de grilla mensual y persistencia de temas
 * ==========================================================================
 */

// 1. DATOS DE LOS EVENTOS (Mock Data de alta calidad para Mayo y Junio 2026)
const EVENTOS_DATA = [
  {
    id: "evt-1",
    title: "Apertura del Salón de Otoño",
    category: "Pintura",
    date: "2026-05-10",
    time: "19:00 hs",
    location: "Salón Ambrosio Aliverti",
    speaker: "Junta de Artistas de la Peña",
    description: "Gran exposición colectiva anual donde nuestros socios exponen sus óleos, acuarelas y grabados inspirados en la estación otoñal. Se servirá un vino de honor en la inauguración."
  },
  {
    id: "evt-2",
    title: "Charla de Restauración Artística",
    category: "Charlas",
    date: "2026-05-15",
    time: "18:00 hs",
    location: "Salón Multiuso de la Peña",
    speaker: "Dra. Dolores López Rosales",
    description: "Una conferencia magistral sobre la preservación de pinturas al óleo antiguas y el rescate de patrimonio cultural histórico en la Provincia de Buenos Aires."
  },
  {
    id: "evt-3",
    title: "Concierto de Cámara: Clásicos Platenses",
    category: "Conciertos",
    date: "2026-05-22",
    time: "20:00 hs",
    location: "Auditorio Principal de la Sede",
    speaker: "Quinteto de Vientos de la UNLP",
    description: "Presentación musical en vivo interpretando composiciones clásicas locales y nacionales en conmemoración de la música de cámara del siglo XX."
  },
  {
    id: "evt-4",
    title: "Café Literario y Lectura de Poesía",
    category: "Literatura",
    date: "2026-05-28", // Hoy
    time: "19:00 hs",
    location: "Galería de los Socios",
    speaker: "Dra. Silvina Palermo (Presidente)",
    description: "Un encuentro ameno y participativo para compartir poemas, escritos y relatos breves junto a una infusión caliente en nuestra galería central."
  },
  {
    id: "evt-5",
    title: "Salón de Grabado: Homenaje a Cleto Ciocchini",
    category: "Pintura",
    date: "2026-06-05",
    time: "19:30 hs",
    location: "Sala de Exposiciones 1",
    speaker: "Prof. Amelia San Martín",
    description: "Exhibición especial dedicada a la obra del maestro grabador Cleto Ciocchini, histórico integrante de la Peña que plasmó la vida costera bonaerense."
  },
  {
    id: "evt-6",
    title: "Demostración de Torno Alfarero en Vivo",
    category: "Cerámica",
    date: "2026-06-12",
    time: "17:00 hs",
    location: "Taller de Alfarería y Escultura",
    speaker: "Lic. Valeria Rosales",
    description: "Clase abierta e interactiva donde se mostrarán técnicas de centrado, modelado veloz en torno y la composición de piezas cerámicas tradicionales."
  },
  {
    id: "evt-7",
    title: "Acto Central: 90° Aniversario de la Peña",
    category: "Especiales",
    date: "2026-06-20",
    time: "18:00 hs",
    location: "Edificio Central de la Peña",
    speaker: "Comisión Directiva",
    description: "Celebración por las casi nueve décadas de fomento y difusión cultural en La Plata. Palabras de la Presidente, recorrido histórico especial y brindis."
  },
  {
    id: "evt-8",
    title: "Seminario de Acuarela al Aire Libre",
    category: "Talleres",
    date: "2026-06-26",
    time: "14:00 hs",
    location: "Paseo del Bosque de La Plata",
    speaker: "Prof. Carlos Aliverti",
    description: "Taller práctico intensivo para pintar paisajes naturales con acuarelas aprovechando las luces de la tarde platense. Punto de encuentro: Pórtico del Bosque."
  }
];

class CalendarApp {
  constructor() {
    this.currentDate = new Date(2026, 4, 28); // Mayo 28, 2026 (De acuerdo a la fecha actual del sistema)
    this.selectedMonth = 4; // Mayo (0-indexed)
    this.selectedYear = 2026;
    this.currentFilter = "all";
    
    this.initTheme();
    this.initDOM();
    this.render();
  }

  // Carga el tema guardado en localStorage por index.html
  initTheme() {
    const savedTheme = localStorage.getItem("penia-theme") || "mixed";
    document.body.className = `theme-${savedTheme} layout-classic`; // Estructura clasica para el calendario
    
    // Configurar listeners en caso de que existan botones de temas en calendario.html
    document.querySelectorAll(".theme-opt").forEach(opt => {
      opt.classList.remove("active");
      if (opt.getAttribute("data-theme") === savedTheme) opt.classList.add("active");
      
      opt.addEventListener("click", () => {
        const theme = opt.getAttribute("data-theme");
        localStorage.setItem("penia-theme", theme);
        document.body.className = `theme-${theme} layout-classic`;
        
        document.querySelectorAll(".theme-opt").forEach(o => o.classList.remove("active"));
        opt.classList.add("active");
      });
    });
  }

  initDOM() {
    // Selectores de mes
    document.querySelector("#btn-prev-month").addEventListener("click", () => this.changeMonth(-1));
    document.querySelector("#btn-next-month").addEventListener("click", () => this.changeMonth(1));

    // Filtros de categoria
    document.querySelectorAll(".calendar-filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".calendar-filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.getAttribute("data-filter");
        this.render();
      });
    });

    // Clic fuera del modal para cerrarlo
    const overlay = document.querySelector("#event-modal-overlay");
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        this.closeModal();
      }
    });
    
    document.querySelector("#event-modal-close").addEventListener("click", () => this.closeModal());
  }

  changeMonth(direction) {
    this.selectedMonth += direction;
    if (this.selectedMonth < 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else if (this.selectedMonth > 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    }
    this.render();
  }

  render() {
    const monthNames = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    // Actualizar titulo del mes
    document.querySelector("#month-display").innerText = `${monthNames[this.selectedMonth]} ${this.selectedYear}`;

    // Renderizar grilla
    this.renderGrid();
    
    // Renderizar lista responsiva alternativa
    this.renderAlternateList();
  }

  renderGrid() {
    const grid = document.querySelector("#calendar-grid-days");
    grid.innerHTML = "";

    // Primer dia del mes
    const firstDayIndex = new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    // Ajustar para que la semana comience en Lunes (0: Domingo, 1: Lunes, ... 6: Sábado)
    // index de Lunes en getDay() es 1. Hacemos (firstDayIndex === 0 ? 6 : firstDayIndex - 1)
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Ultimo dia del mes
    const totalDays = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    
    // Ultimo dia del mes anterior
    const prevMonthTotalDays = new Date(this.selectedYear, this.selectedMonth, 0).getDate();

    // 1. Renderizar dias del mes anterior que llenan la primera semana
    for (let i = startOffset; i > 0; i--) {
      const dayNum = prevMonthTotalDays - i + 1;
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day empty-day";
      emptyCell.innerHTML = `<span class="day-number">${dayNum}</span>`;
      grid.appendChild(emptyCell);
    }

    // 2. Renderizar los dias del mes actual
    for (let day = 1; day <= totalDays; day++) {
      const dayCell = document.createElement("div");
      dayCell.className = "calendar-day";
      
      // Chequear si es hoy (según nuestra fecha fija del sistema 28 de mayo de 2026)
      if (this.selectedYear === 2026 && this.selectedMonth === 4 && day === 28) {
        dayCell.classList.add("today-day");
      }

      dayCell.innerHTML = `<span class="day-number">${day}</span><div class="day-events-list"></div>`;

      // Formato YYYY-MM-DD para machear fecha
      const dateString = `${this.selectedYear}-${String(this.selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Filtrar y buscar eventos del dia
      const dayEvents = EVENTOS_DATA.filter(evt => {
        const matchesDate = evt.date === dateString;
        const matchesFilter = this.currentFilter === "all" || evt.category.toLowerCase() === this.currentFilter.toLowerCase();
        return matchesDate && matchesFilter;
      });

      const eventsContainer = dayCell.querySelector(".day-events-list");
      dayEvents.forEach(evt => {
        const badge = document.createElement("span");
        
        // Asignar clase de estilo segun categoria
        let catClass = "event-special";
        if (evt.category === "Pintura") catClass = "event-painting";
        else if (evt.category === "Escultura") catClass = "event-sculpture";
        else if (evt.category === "Cerámica") catClass = "event-ceramics";
        else if (evt.category === "Conciertos") catClass = "event-music";
        else if (evt.category === "Literatura") catClass = "event-literature";
        else if (evt.category === "Talleres") catClass = "event-special"; // color dorado/oro
        
        badge.className = `event-badge ${catClass}`;
        badge.innerText = evt.title;
        badge.title = `${evt.time} - ${evt.title}`;
        
        badge.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openModal(evt);
        });

        eventsContainer.appendChild(badge);
      });

      // Hacer click en la celda del dia
      dayCell.addEventListener("click", () => {
        if (dayEvents.length > 0) {
          this.openModal(dayEvents[0]); // Abre el primer evento si hay
        }
      });

      grid.appendChild(dayCell);
    }

    // 3. Completar la cuadrícula con dias del mes siguiente
    const totalCellsSoFar = startOffset + totalDays;
    const remainingCells = 42 - totalCellsSoFar; // 6 filas de 7 dias = 42 celdas
    for (let day = 1; day <= remainingCells; day++) {
      const emptyCell = document.createElement("div");
      emptyCell.className = "calendar-day empty-day";
      emptyCell.innerHTML = `<span class="day-number">${day}</span>`;
      grid.appendChild(emptyCell);
    }
  }

  // Renderizar la vista de lista de eventos para pantallas pequeñas o móviles
  renderAlternateList() {
    const listContainer = document.querySelector("#event-list-items");
    if (!listContainer) return;
    
    listContainer.innerHTML = "";

    // Filtrar todos los eventos de este mes y año seleccionados
    const monthlyEvents = EVENTOS_DATA.filter(evt => {
      const evtDate = new Date(evt.date);
      // Notar que la fecha en string es local, por lo que convertiremos usando split
      const parts = evt.date.split('-');
      const evtYear = parseInt(parts[0]);
      const evtMonth = parseInt(parts[1]) - 1;

      const matchesMonth = evtYear === this.selectedYear && evtMonth === this.selectedMonth;
      const matchesFilter = this.currentFilter === "all" || evt.category.toLowerCase() === this.currentFilter.toLowerCase();
      
      return matchesMonth && matchesFilter;
    });

    // Ordenar eventos por fecha
    monthlyEvents.sort((a, b) => a.date.localeCompare(b.date));

    if (monthlyEvents.length === 0) {
      listContainer.innerHTML = `<p style="color:var(--text-secondary); text-align:center; font-style:italic; padding:1rem;">No hay eventos agendados para este mes con los filtros activos.</p>`;
      return;
    }

    monthlyEvents.forEach(evt => {
      const parts = evt.date.split('-');
      const dayNum = parts[2];
      const monthDisplay = new Date(parts[0], parts[1]-1, parts[2]).toLocaleDateString("es-AR", { month: "short" });

      const card = document.createElement("div");
      card.className = "event-list-card";
      card.innerHTML = `
        <div class="event-list-card-info">
          <span class="event-list-card-date">${dayNum} ${monthDisplay} - ${evt.time}</span>
          <h4 style="margin-top:0.2rem;">${evt.title}</h4>
          <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.25rem;">${evt.speaker} | ${evt.location}</p>
        </div>
        <span class="modal-badge" style="margin-bottom:0;">${evt.category}</span>
      `;

      card.addEventListener("click", () => this.openModal(evt));
      listContainer.appendChild(card);
    });
  }

  openModal(evt) {
    const overlay = document.querySelector("#event-modal-overlay");
    document.querySelector("#modal-evt-title").innerText = evt.title;
    document.querySelector("#modal-evt-category").innerText = evt.category;
    
    // Darle color a la categoria
    const badge = document.querySelector("#modal-evt-category");
    badge.className = "modal-badge";
    if (evt.category === "Pintura") badge.style.backgroundColor = "var(--badge-bg)";
    
    // Formatear fecha
    const parts = evt.date.split('-');
    const formattedDate = new Date(parts[0], parts[1]-1, parts[2]).toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.querySelector("#modal-evt-date").innerText = formattedDate;
    document.querySelector("#modal-evt-time").innerText = evt.time;
    document.querySelector("#modal-evt-speaker").innerText = evt.speaker;
    document.querySelector("#modal-evt-location").innerText = evt.location;
    document.querySelector("#modal-evt-desc").innerText = evt.description;

    overlay.style.display = "flex";
  }

  closeModal() {
    document.querySelector("#event-modal-overlay").style.display = "none";
  }
}

// Inicializar la aplicacion
window.addEventListener("DOMContentLoaded", () => {
  window.calendarApp = new CalendarApp();
});
