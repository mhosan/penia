/**
 * ==========================================================================
 * LÓGICA DE LA APLICACIÓN - PEÑA DE LAS BELLAS ARTES DE LA PLATA (4 VÍAS)
 * SPA nativa con persistencia en localStorage y 4 estructuras independientes
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. DATOS DE INICIALIZACIÓN POR DEFECTO (Mock Data de Alta Calidad)
// --------------------------------------------------------------------------
const INITIAL_DATA = {
  profile: {
    name: "Peña de las Bellas Artes",
    founded: "20 de junio de 1936",
    location: "La Plata, Provincia de Buenos Aires",
    address: "Calle 50 Nro. 543 e/ 5 y 6, La Plata",
    phone: "+54 (221) 422-8765",
    email: "contacto@penadebellasartes.org.ar",
    schedule: "Lunas a Viernes de 14:00 a 21:00 hs y Sábados de 9:00 a 13:00 hs.",
    description: "La Peña de las Bellas Artes es una entidad civil, sin fines de lucro, fundada el 20 de junio de 1936 por un grupo de jóvenes entusiastas de la ciudad de La Plata que entendieron que era una tarea enriquecedora para la sociedad difundir el arte en todas sus formas. Poetas, escritores, músicos, pintores, escultores, ceramistas fueron los sólidos cimientos donde se apoyó la Peña, la ilustrada ciudadanía la proveyó de alumnos que, con el tiempo, fueron artistas orgullo de la joven urbe. A pesar de los avatares de la economía y la política del país, la Institución nunca claudicó en sus principios y, con mayor o menor fortuna, transitó estos ya casi 90 años de vida que nos encuentra disfrutando del sólido edificio propio en el centro de la ciudad, con talleres cómodos y confortables, salón de exposiciones, salón multipropósito que es utilizado como sala de conferencias, Museo, para presentaciones de libros, etc, y otras dependencias."
  },
  authorities: [
    { role: "Presidente", name: "Dra. Silvina Palermo", specialty: "Escritora y Gestora Cultural" },
    { role: "Vicepresidente", name: "Prof. Carlos Aliverti", specialty: "Artista Plástico" },
    { role: "Secretario General", name: "Lic. Clara Della Crocce", specialty: "Historiadora de Arte (UNLP)" },
    { role: "Tesorera", name: "Cra. Mercedes Giudice", specialty: "Contadora y Pintora Aficionada" },
    { role: "Vocal 1", name: "Prof. Alberto Ortiz", specialty: "Director de Orquesta y Docente" },
    { role: "Vocal 2", name: "Dra. Dolores López Rosales", specialty: "Restauradora de Bienes Culturales" }
  ],
  teachers: [
    {
      id: "doc-1",
      name: "Prof. Amelia San Martín",
      specialty: "Pintura y Óleo",
      bio: "Egresada de la Facultad de Artes de la UNLP. Cuenta con más de 20 años de trayectoria docente y múltiples exhibiciones individuales en el Salón Ambrosio Aliverti.",
      experience: "Ex-Directora del Taller de Pintura de la Provincia de Buenos Aires."
    },
    {
      id: "doc-2",
      name: "Mtro. Dante Frassoni",
      specialty: "Escultura y Modelado",
      bio: "Escultor especializado en mármol y bronce. Premio Salón Aniversario de La Plata. Apasionado por la transmisión del oficio de tallado tradicional.",
      experience: "Profesor titular de la cátedra de Escultura y modelado espacial."
    },
    {
      id: "doc-3",
      name: "Lic. Valeria Rosales",
      specialty: "Cerámica Artística y Alfarería",
      bio: "Investigadora en técnicas de cocción autóctonas americanas. Sus piezas forman parte del acervo del Museo Permanente de la Peña.",
      experience: "Docente de cerámica y curadora independiente en centros culturales bonaerenses."
    },
    {
      id: "doc-4",
      name: "Prof. Esteban Varela",
      specialty: "Dibujo Académico y Carboncillo",
      bio: "Ilustrador independiente y docente de dibujo anatómico. Especialista en carboncillo, tiza pastel y técnicas secas tradicionales.",
      experience: "Ilustrador de editoriales nacionales y jurado de concursos artísticos de La Plata."
    }
  ],
  courses: [
    {
      id: "cur-1",
      title: "Taller de Óleo y Técnicas Mixtas",
      teacherId: "doc-1",
      schedule: "Martes y Jueves 17:30 a 19:30 hs",
      duration: "Cuatrimestral",
      description: "Taller teórico-práctico orientado a explorar el círculo cromático, la composición espacial, texturas sobre lienzo y el uso de pigmentos tradicionales. Ideal tanto para principiantes como para estudiantes avanzados.",
      price: "$15.000 mensual",
      category: "Pintura",
      studentsCount: 24
    },
    {
      id: "cur-2",
      title: "Escultura en Arcilla y Moldes de Yeso",
      teacherId: "doc-2",
      schedule: "Sábados 10:00 a 13:00 hs",
      duration: "Anual",
      description: "Aprenderás el volumen espacial, el modelado figurativo y abstracto en arcilla, y la creación de moldes de yeso y caucho de silicona para reproducir piezas únicas.",
      price: "$18.000 mensual",
      category: "Escultura",
      studentsCount: 16
    },
    {
      id: "cur-3",
      title: "Alfarería y Esmaltado de Cerámica",
      teacherId: "doc-3",
      schedule: "Lunes y Miércoles 18:00 a 20:00 hs",
      duration: "Cuatrimestral",
      description: "Introducción al uso del torno alfarero, modelado manual (pellizco, placas y rollos), uso de engobes y técnicas de esmaltado a alta y baja temperatura.",
      price: "$16.000 mensual",
      category: "Cerámica",
      studentsCount: 19
    },
    {
      id: "cur-4",
      title: "Dibujo de Figura Humana con Modelo Vivo",
      teacherId: "doc-4",
      schedule: "Viernes 18:00 a 21:00 hs",
      duration: "Trimestral",
      description: "Estudio del cuerpo humano, proporción, anatomía artística, claroscuro y soltura del trazo usando modelo vivo en todas las clases.",
      price: "$14.000 mensual",
      category: "Dibujo",
      studentsCount: 28
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Otoño Platense",
      artist: "Estela Giudice",
      category: "Pintura",
      description: "Óleo sobre lienzo representando el follaje otoñal en el Paseo del Bosque de La Plata. Ganadora de mención de honor en el Salón de Otoño.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23c2410c'/><circle cx='400' cy='300' r='200' fill='%23eab308' opacity='0.7'/><circle cx='500' cy='250' r='120' fill='%23db2777' opacity='0.5'/><rect x='100' y='400' width='600' height='20' fill='white' opacity='0.2'/><text x='50%25' y='90%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white'>Otoño Platense - Óleo</text></svg>"
    },
    {
      id: "gal-2",
      title: "El Vuelo de la Materia",
      artist: "Dante Frassoni",
      category: "Escultura",
      description: "Talla en mármol de Carrara representando la ligereza del viento chocando contra una estructura rígida. Exhibido en el Salón Ambrosio Aliverti.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%23475569'/><path d='M200 450 Q 400 150, 600 450 T 700 300' fill='none' stroke='%23e2e8f0' stroke-width='12'/><circle cx='400' cy='300' r='80' fill='%23cbd5e1'/><text x='50%25' y='90%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white'>El Vuelo de la Materia - Mármol</text></svg>"
    },
    {
      id: "gal-3",
      title: "Vasija del Plata",
      artist: "Valeria Rosales",
      category: "Cerámica",
      description: "Cerámica de arcilla roja extraída de los alrededores de la región, decorada con engobes naturales y bruñida a mano. Cocida en horno de leña.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%2378350f'/><path d='M300 200 C300 100, 500 100, 500 200 C500 350, 600 400, 500 500 C400 530, 400 530, 300 500 C200 400, 300 350, 300 200 Z' fill='%23d97706'/><text x='50%25' y='90%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white'>Vasija del Plata - Arcilla</text></svg>"
    },
    {
      id: "gal-4",
      title: "Catedral Escondida",
      artist: "Carlos Aliverti",
      category: "Concursos",
      description: "Carboncillo sobre papel de alto gramaje que retrata las torres góticas de la Catedral de La Plata emergiendo de la bruma. Primer Premio Concurso Aniversario.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='100%' height='100%' fill='%231e293b'/><line x1='400' y1='100' x2='400' y2='500' stroke='%23f97316' stroke-width='8'/><line x1='300' y1='250' x2='500' y2='250' stroke='%23f97316' stroke-width='8'/><polygon points='400,50 350,150 450,150' fill='%23eab308'/><text x='50%25' y='90%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='24' fill='white'>Catedral Platense - Carboncillo</text></svg>"
    }
  ],
  stats: {
    monthlyVisits: [350, 420, 510, 490, 620, 710, 850, 990, 1100, 1150, 1310, 1420],
    activeMembers: 142, // socios
    visitorsToday: 67
  },
  registrations: [
    { id: "reg-1", name: "Mariano Espósito", email: "mariano@gmail.com", phone: "2214321098", courseId: "cur-1", date: "2026-05-24" },
    { id: "reg-2", name: "Estefanía Paz", email: "estefaniap@hotmail.com", phone: "2215678321", courseId: "cur-3", date: "2026-05-25" }
  ]
};

// Historia redactada en formato de párrafos estructurados
const HISTORY_PARAGRAPHS = [
  '<strong>"La Peña"</strong> inició sus actividades en <strong>junio de 1936</strong> y su primer local estuvo emplazado en la <strong>calle 6 entre 49 y 50</strong> de la ciudad de La Plata. En sus inicios, formó a un gran número de adolescentes, muchos de los cuales alcanzaron en el mediano plazo lugares muy destacados y reconocidos en el ámbito de las artes plásticas nacionales e internacionales.',
  'Años después, gracias al esfuerzo mancomunado de sus miembros y socios protectores, logró adquirir la casa edilicia que ocupa actualmente en pleno <strong>centro neurálgico platense</strong> (Calle 50 entre 5 y 6).',
  'Fueron sus fundadores un entusiasta y comprometido grupo de jóvenes enamorados del arte provenientes de diversas corrientes creativas: pintores, músicos, escritores, poetas, escultores y ceramistas. Hoy, los actuales componentes de la Comisión Directiva, continúan con renovados bríos la tarea propuesta por aquellos creadores pioneros, transmitiéndole la impronta renovadora que los tiempos actuales imponen.',
  'Cultivando diversas actividades creadoras (pintura, poesía, música, literatura, escultura, etc.) accedieron a la presidencia, desde su inicio y sucesivamente, los siguientes artistas a quienes les rendimos desde aquí un pequeño pero sincero y justo homenaje: <em>José M. De la Torre, Arturo González, José Mutti, Dolores López Aranguren, Cleto Ciocchini, Carmelo Yorio, Roberto Della Crocce, Ambrosio Aliverti, José Gaspar Mancuso, Rubén Giudice, Edgard Ortiz y René Palermo.</em>'
];

// --------------------------------------------------------------------------
// 2. CONTROLADOR DE ESTADO (AppState)
// --------------------------------------------------------------------------
class AppState {
  constructor() {
    this.data = this.loadFromStorage() || INITIAL_DATA;
    this.currentTheme = localStorage.getItem("penia-theme") || "mixed";
    this.currentLayout = "classic";
    this.currentView = "home"; // Específico para el Layout Clásico
    this.currentAdminTab = "metrics";
    this.sociosTrimestralFee = 5000;
    this.isAdminActive = false; // Estado si el panel de control está abierto o no

    this.saveToStorage();
  }

  loadFromStorage() {
    try {
      const dataStr = localStorage.getItem("penia-app-data");
      return dataStr ? JSON.parse(dataStr) : null;
    } catch (e) {
      console.error("Error al cargar de localStorage", e);
      return null;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem("penia-app-data", JSON.stringify(this.data));
    } catch (e) {
      console.error("Error al guardar en localStorage", e);
    }
  }

  setTheme(themeName) {
    this.currentTheme = themeName;
    localStorage.setItem("penia-theme", themeName);
    document.body.className = document.body.className.replace(/theme-\S+/g, `theme-${themeName}`);
    this.updateThemeSelectorUI();
  }

  setLayout(layoutName) {
    this.currentLayout = "classic";
    localStorage.setItem("penia-layout", "classic");
    
    // Cambiar clases en el body
    document.body.className = document.body.className.replace(/layout-\S+/g, `layout-classic`);
    
    // Si el administrador está activo, forzar el layout-admin en el body
    if (this.isAdminActive) {
      document.body.classList.add("layout-admin");
    } else {
      document.body.classList.remove("layout-admin");
    }

    this.renderAllActiveLayouts();
  }

  toggleAdminView() {
    this.isAdminActive = !this.isAdminActive;
    if (this.isAdminActive) {
      document.body.classList.add("layout-admin");
      document.querySelectorAll(".admin-btn-text").forEach(el => el.innerText = "Salir de Admin");
      this.renderAdminTabContent(this.currentAdminTab);
    } else {
      document.body.classList.remove("layout-admin");
      document.querySelectorAll(".admin-btn-text").forEach(el => el.innerText = "Panel de Administración");
      // Volver a renderizar la maqueta activa
      this.renderAllActiveLayouts();
    }
  }

  setView(viewName) {
    // Para navegación interna de pestañas del Layout Clásico
    this.currentView = viewName;
    document.querySelectorAll(".classic-view").forEach(sec => {
      sec.classList.remove("active");
    });
    const targetView = document.getElementById(`classic-view-${viewName}`);
    if (targetView) targetView.classList.add("active");

    // Navbar botones
    document.querySelectorAll(".classic-header .nav-link").forEach(lnk => {
      lnk.classList.remove("active");
      if (lnk.getAttribute("data-target") === viewName) {
        lnk.classList.add("active");
      }
    });

    // Cerrar menú móvil si está abierto
    document.querySelector("#classic-nav-links")?.classList.remove("mobile-open");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navigateClassic(viewName) {
    this.setView(viewName);
  }

  toggleClassicMenu() {
    const navLinks = document.querySelector("#classic-nav-links");
    if (navLinks) {
      navLinks.classList.toggle("mobile-open");
    }
  }

  setAdminTab(tabName) {
    this.currentAdminTab = tabName;
    document.querySelectorAll(".admin-view").forEach(v => {
      v.classList.remove("active");
    });
    const targetTab = document.getElementById(`admin-tab-${tabName}`);
    if (targetTab) targetTab.classList.add("active");

    document.querySelectorAll(".admin-side-btn").forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-tab") === tabName) {
        btn.classList.add("active");
      }
    });

    this.renderAdminTabContent(tabName);
  }

  // --------------------------------------------------------------------------
  // 3. RENDERIZACIÓN GLOBAL (Alimenta las 4 Maquetas)
  // --------------------------------------------------------------------------
  renderAllActiveLayouts() {
    this.renderLayoutClassic();
  }

  // --- LAYOUT 1: CLÁSICO ---
  renderLayoutClassic() {
    // Perfil
    const pShort = document.querySelector("#classic-profile-desc-short");
    if (pShort) pShort.innerText = this.data.profile.description.substring(0, 310) + "...";
    
    const pFull = document.querySelector("#classic-profile-desc-full");
    if (pFull) pFull.innerText = this.data.profile.description;

    const fFounded = document.querySelector("#classic-info-founded");
    if (fFounded) fFounded.innerText = this.data.profile.founded;

    const fLoc = document.querySelector("#classic-info-location");
    if (fLoc) fLoc.innerText = this.data.profile.address + ", " + this.data.profile.location;

    // Fines / Features
    const featGrid = document.querySelector("#classic-features-container");
    if (featGrid) {
      featGrid.innerHTML = `
        <div class="card">
          <h3>Difusión Artística</h3>
          <p>Mantenemos desde ${this.data.profile.founded.split('e').pop()} la vocación de difundir las bellas artes en la ciudad de La Plata.</p>
        </div>
        <div class="card">
          <h3>Formación Continua</h3>
          <p>Talleres dictados por nuestro plantel docente calificado que cuenta con ${this.data.teachers.length} especialistas.</p>
        </div>
        <div class="card">
          <h3>Comunidad de Socios</h3>
          <p>Sostenida gracias al aporte voluntario de más de ${this.data.stats.activeMembers} socios activos platenses.</p>
        </div>
      `;
    }

    // Autoridades
    const authList = document.querySelector("#classic-authorities-list");
    if (authList) {
      authList.innerHTML = this.data.authorities.map(auth => `
        <div class="authority-item">
          <div>
            <span class="authority-role">${auth.role}</span>
            <div class="authority-name">${auth.name}</div>
          </div>
          <span class="authority-desc">${auth.specialty}</span>
        </div>
      `).join('');
    }

    // Historia
    const histText = document.querySelector("#classic-history-text-container");
    if (histText) {
      histText.innerHTML = HISTORY_PARAGRAPHS.map(p => `<p>${p}</p>`).join('');
    }

    // Galería (Filtros y Grid)
    this.renderClassicFilters();
    this.renderClassicGallery();

    // Docentes
    const teachGrid = document.querySelector("#classic-teachers-grid");
    if (teachGrid) {
      teachGrid.innerHTML = this.data.teachers.map(teach => `
        <div class="teacher-card">
          <div>
            <div class="teacher-name">${teach.name}</div>
            <div class="teacher-specialty">${teach.specialty}</div>
            <p class="teacher-bio">${teach.bio}</p>
          </div>
          <div class="teacher-experience">
            <strong>Experiencia:</strong> ${teach.experience}
          </div>
        </div>
      `).join('');
    }

    // Cursos
    const coursesGrid = document.querySelector("#classic-courses-grid");
    if (coursesGrid) {
      coursesGrid.innerHTML = this.data.courses.map(course => {
        const teacher = this.data.teachers.find(t => t.id === course.teacherId) || { name: "A designar" };
        return `
          <div class="card course-card">
            <div>
              <h3>${course.title}</h3>
              <span class="gallery-category-badge" style="position:static; display:inline-block; margin-bottom:0.5rem;">${course.category}</span>
              <p>${course.description}</p>
            </div>
            <div>
              <div class="course-meta">
                <span><strong>Docente:</strong> ${teacher.name}</span>
                <span><strong>Horario:</strong> ${course.schedule}</span>
                <span><strong>Duración:</strong> ${course.duration}</span>
                <span><strong>Alumnos:</strong> ${course.studentsCount}</span>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="course-price">${course.price}</span>
                <button class="btn btn-primary" onclick="app.openInscripcionModal('${course.id}')">Inscribirme</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Contacto
    const contactContainer = document.querySelector("#classic-contact-container");
    if (contactContainer) {
      contactContainer.innerHTML = `
        <div class="contact-info-list">
          <div class="contact-info-item">
            <div class="contact-info-icon">📍</div>
            <div class="contact-info-text">
              <h4>Sede Social</h4>
              <p>${this.data.profile.address}, ${this.data.profile.location}</p>
            </div>
          </div>
          <div class="contact-info-item">
            <div class="contact-info-icon">📞</div>
            <div class="contact-info-text">
              <h4>Teléfono</h4>
              <p>${this.data.profile.phone}</p>
            </div>
          </div>
          <div class="contact-info-item">
            <div class="contact-info-icon">✉️</div>
            <div class="contact-info-text">
              <h4>Correo</h4>
              <p>${this.data.profile.email}</p>
            </div>
          </div>
          <div class="map-placeholder">
            <strong>Ubicación de la Sede</strong>
            <span>${this.data.profile.schedule}</span>
          </div>
        </div>
        <form class="contact-form" style="padding:2rem;" onsubmit="app.handleContactSubmit(event)">
          <h3>Déjenos su Consulta</h3><br>
          <div class="form-group">
            <label>Nombre:</label>
            <input type="text" class="form-control" required id="classic-c-name">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input type="email" class="form-control" required id="classic-c-email">
          </div>
          <div class="form-group">
            <label>Mensaje:</label>
            <textarea class="form-control" rows="4" required id="classic-c-msg"></textarea>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">Enviar Mensaje</button>
        </form>
      `;
    }

    // Footer
    const footerContainer = document.querySelector("#classic-footer-container");
    if (footerContainer) {
      footerContainer.innerHTML = `
        <div class="container footer-grid">
          <div>
            <h3>${this.data.profile.name}</h3>
            <p>Fomentando la cultura en La Plata desde 1936.</p>
          </div>
          <div>
            <h3>Secciones</h3>
            <ul class="footer-links">
              <li><a href="#" onclick="app.setView('home'); return false;">Inicio</a></li>
              <li><a href="#" onclick="app.setView('info'); return false;">Perfil</a></li>
              <li><a href="#" onclick="app.setView('gallery'); return false;">Galería</a></li>
              <li><a href="calendario.html">Calendario de Eventos</a></li>
            </ul>
          </div>
          <div>
            <h3>Datos</h3>
            <p>${this.data.profile.address}<br>Tel: ${this.data.profile.phone}</p>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2026 Asociación Civil Peña de las Bellas Artes.</p>
        </div>
      `;
    }
  }

  renderClassicFilters() {
    const fCont = document.querySelector("#classic-gallery-filters");
    if (!fCont) return;
    const categories = ["all", "Pintura", "Escultura", "Cerámica", "Dibujo", "Concursos"];
    fCont.innerHTML = categories.map(cat => {
      const activeClass = cat === "all" ? "active" : "";
      const label = cat === "all" ? "Todas" : cat;
      return `<button class="filter-btn ${activeClass}" data-filter="${cat}" onclick="app.filterClassicGallery(event, '${cat}')">${label}</button>`;
    }).join('');
  }

  filterClassicGallery(e, cat) {
    const filters = e.target.parentElement.querySelectorAll(".filter-btn");
    filters.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    this.renderClassicGallery(cat);
  }

  renderClassicGallery(cat = "all") {
    const grid = document.querySelector("#classic-gallery-grid");
    if (!grid) return;
    let items = this.data.gallery;
    if (cat !== "all") {
      items = items.filter(i => i.category.toLowerCase() === cat.toLowerCase());
    }

    grid.innerHTML = items.map(item => `
      <div class="gallery-item" onclick="app.openGalleryModal('${item.id}')">
        <div class="gallery-img-container">
          ${item.image.startsWith("data:") ? item.image : `<img src="${item.image}"/>`}
          <span class="gallery-category-badge">${item.category}</span>
        </div>
        <div class="gallery-info">
          <div>
            <h4>${item.title}</h4>
            <div class="gallery-artist">${item.artist}</div>
            <p class="gallery-desc">${item.description}</p>
          </div>
        </div>
      </div>
    `).join('');
  }






  // --- MÉTODOS DE ENVÍO DE FORMULARIOS COMUNES ---
  handleContactSubmit(e) {
    e.preventDefault();
    alert("¡Mensaje despachado con éxito a la administración de la Peña!");
    e.target.reset();
  }


  // --------------------------------------------------------------------------
  // 4. RENDERIZACIÓN DE CONTENIDO PANEL DE CONTROL (ADMIN)
  // --------------------------------------------------------------------------
  renderAdminTabContent(tabName) {
    switch (tabName) {
      case "metrics":
        this.renderAdminMetrics();
        break;
      case "profile":
        this.renderAdminProfile();
        break;
      case "courses":
        this.renderAdminCourses();
        break;
      case "gallery":
        this.renderAdminGallery();
        break;
      case "backup":
        // Estático en HTML
        break;
    }
  }

  renderAdminMetrics() {
    document.querySelector("#metric-total-courses").innerText = this.data.courses.length;
    document.querySelector("#metric-total-teachers").innerText = this.data.teachers.length;
    document.querySelector("#metric-total-gallery").innerText = this.data.gallery.length;
    document.querySelector("#metric-total-socios").innerText = this.data.stats.activeMembers;

    this.updateIncomeEstimator();
    this.drawVisitsChart();
    this.drawCoursesChart();
  }

  updateIncomeEstimator() {
    const slider = document.querySelector("#slider-socios");
    const numSociosText = document.querySelector("#calc-socios-count");
    const totalIncomeText = document.querySelector("#calc-total-income");
    const activeMembersCount = this.data.stats.activeMembers;

    if (slider) {
      slider.value = activeMembersCount;
      numSociosText.innerText = activeMembersCount;
    }

    const calculatedIncome = activeMembersCount * this.sociosTrimestralFee;
    if (totalIncomeText) {
      totalIncomeText.innerText = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(calculatedIncome);
    }

    // Progreso circular
    const progressCircle = document.querySelector("#income-progress-circle");
    if (progressCircle) {
      const percent = Math.min((calculatedIncome / 1000000) * 100, 100);
      const circumference = 2 * Math.PI * 35; // r=35
      const strokeDashoffset = circumference - (percent / 100) * circumference;
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = strokeDashoffset;
      document.querySelector("#income-progress-text").innerText = `${Math.round(percent)}%`;
    }
  }

  drawVisitsChart() {
    const container = document.querySelector("#visits-chart-svg");
    if (!container) return;

    const data = this.data.stats.monthlyVisits;
    const months = ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic", "Ene", "Feb", "Mar", "Abr", "May"];

    const width = 500;
    const height = 180;
    const padding = 30;

    const maxVal = Math.max(...data) * 1.1;
    const points = data.map((val, index) => {
      const x = padding + (index * (width - 2 * padding) / (data.length - 1));
      const y = height - padding - (val * (height - 2 * padding) / maxVal);
      return { x, y, val, month: months[index] };
    });

    const pathData = points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(ratio => {
      const y = padding + ratio * (height - 2 * padding);
      const val = Math.round(maxVal * (1 - ratio));
      return `
        <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="var(--border-color)" stroke-dasharray="4,4" />
        <text x="${padding - 5}" y="${y + 4}" fill="var(--text-secondary)" font-size="8" text-anchor="end">${val}</text>
      `;
    }).join('');

    const circles = points.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="var(--accent)" class="chart-point">
        <title>Mes: ${p.month} | Visitas: ${p.val}</title>
      </circle>
      <text x="${p.x}" y="${height - 8}" fill="var(--text-secondary)" font-size="8" text-anchor="middle">${p.month}</text>
    `).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
        ${gridLines}
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="var(--text-primary)" stroke-width="1" />
        <path d="${pathData}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z" fill="var(--accent)" opacity="0.1" />
        ${circles}
      </svg>
    `;
  }

  drawCoursesChart() {
    const container = document.querySelector("#courses-chart-svg");
    if (!container) return;

    const data = this.data.courses;
    const width = 350;
    const height = 180;
    const padding = 35;
    const barSpacing = 12;

    const maxVal = Math.max(...data.map(c => c.studentsCount)) * 1.1 || 10;
    const barWidth = (width - 2 * padding - (data.length - 1) * barSpacing) / data.length;

    const bars = data.map((c, i) => {
      const x = padding + i * (barWidth + barSpacing);
      const barHeight = c.studentsCount * (height - 2 * padding) / maxVal;
      const y = height - padding - barHeight;
      const categoryShort = c.category.substring(0, 4) + ".";

      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="var(--accent)" rx="4" class="chart-bar">
          <title>${c.title}\nAlumnos: ${c.studentsCount}</title>
        </rect>
        <text x="${x + barWidth / 2}" y="${y - 8}" fill="var(--text-primary)" font-size="10" font-weight="bold" text-anchor="middle">${c.studentsCount}</text>
        <text x="${x + barWidth / 2}" y="${height - 12}" fill="var(--text-secondary)" font-size="9" text-anchor="middle">${categoryShort}</text>
      `;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="100%">
        <line x1="${padding - 5}" y1="${height - padding}" x2="${width - padding + 5}" y2="${height - padding}" stroke="var(--text-primary)" stroke-width="1" />
        ${bars}
      </svg>
    `;
  }

  renderAdminProfile() {
    document.querySelector("#edit-prof-name").value = this.data.profile.name;
    document.querySelector("#edit-prof-founded").value = this.data.profile.founded;
    document.querySelector("#edit-prof-loc").value = this.data.profile.location;
    document.querySelector("#edit-prof-addr").value = this.data.profile.address;
    document.querySelector("#edit-prof-phone").value = this.data.profile.phone;
    document.querySelector("#edit-prof-email").value = this.data.profile.email;
    document.querySelector("#edit-prof-sched").value = this.data.profile.schedule;
    document.querySelector("#edit-prof-desc").value = this.data.profile.description;

    const authTableBody = document.querySelector("#admin-authorities-tbody");
    if (authTableBody) {
      authTableBody.innerHTML = this.data.authorities.map((auth, index) => `
        <tr>
          <td><strong>${auth.role}</strong></td>
          <td>${auth.name}</td>
          <td>${auth.specialty}</td>
          <td class="table-actions">
            <button class="action-btn" onclick="app.editAuthority(${index})">
              Editar
            </button>
            <button class="action-btn del" onclick="app.deleteAuthority(${index})">
              Eliminar
            </button>
          </td>
        </tr>
      `).join('');
    }
  }

  saveProfileChanges(e) {
    e.preventDefault();
    this.data.profile.name = document.querySelector("#edit-prof-name").value;
    this.data.profile.founded = document.querySelector("#edit-prof-founded").value;
    this.data.profile.location = document.querySelector("#edit-prof-loc").value;
    this.data.profile.address = document.querySelector("#edit-prof-addr").value;
    this.data.profile.phone = document.querySelector("#edit-prof-phone").value;
    this.data.profile.email = document.querySelector("#edit-prof-email").value;
    this.data.profile.schedule = document.querySelector("#edit-prof-sched").value;
    this.data.profile.description = document.querySelector("#edit-prof-desc").value;

    this.saveToStorage();
    alert("¡Perfil institucional actualizado!");
    this.renderAllActiveLayouts();
  }

  editAuthority(index) {
    const auth = this.data.authorities[index];
    if (!auth) return;
    const r = prompt("Editar Cargo:", auth.role);
    if (r === null) return;
    const n = prompt("Editar Nombre:", auth.name);
    if (n === null) return;
    const s = prompt("Editar Especialidad:", auth.specialty);
    if (s === null) return;

    this.data.authorities[index] = { role: r, name: n, specialty: s };
    this.saveToStorage();
    this.renderAdminProfile();
    this.renderAllActiveLayouts();
  }

  addAuthority() {
    const r = prompt("Nuevo Cargo:");
    if (!r) return;
    const n = prompt("Nombre completo:");
    if (!n) return;
    const s = prompt("Especialidad/Formación:");
    if (!s) return;

    this.data.authorities.push({ role: r, name: n, specialty: s });
    this.saveToStorage();
    this.renderAdminProfile();
    this.renderAllActiveLayouts();
  }

  deleteAuthority(index) {
    if (confirm(`¿Eliminar a ${this.data.authorities[index].name} de la Comisión Directiva?`)) {
      this.data.authorities.splice(index, 1);
      this.saveToStorage();
      this.renderAdminProfile();
      this.renderAllActiveLayouts();
    }
  }

  renderAdminCourses() {
    // Tabla cursos
    const coursesTable = document.querySelector("#admin-courses-tbody");
    if (coursesTable) {
      coursesTable.innerHTML = this.data.courses.map(course => {
        const teacher = this.data.teachers.find(t => t.id === course.teacherId) || { name: "A designar" };
        return `
          <tr>
            <td><strong>${course.title}</strong></td>
            <td><span class="gallery-category-badge" style="position:static;">${course.category}</span></td>
            <td>${teacher.name}</td>
            <td>${course.schedule}</td>
            <td>${course.studentsCount}</td>
            <td class="table-actions">
              <button class="action-btn" onclick="app.openCourseDrawer('${course.id}')">Editar</button>
              <button class="action-btn del" onclick="app.deleteCourse('${course.id}')">Eliminar</button>
            </td>
          </tr>
        `;
      }).join('');
    }

    // Tabla docentes
    const teachersTable = document.querySelector("#admin-teachers-tbody");
    if (teachersTable) {
      teachersTable.innerHTML = this.data.teachers.map(teach => `
        <tr>
          <td><strong>${teach.name}</strong></td>
          <td>${teach.specialty}</td>
          <td><span style="font-size:0.8rem; max-width:200px; display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${teach.bio}</span></td>
          <td class="table-actions">
            <button class="action-btn" onclick="app.openTeacherDrawer('${teach.id}')">Editar</button>
            <button class="action-btn del" onclick="app.deleteTeacher('${teach.id}')">Eliminar</button>
          </td>
        </tr>
      `).join('');
    }

    // Select docentes en el drawer
    const selectDoc = document.querySelector("#course-form-teacher");
    if (selectDoc) {
      selectDoc.innerHTML = this.data.teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    }
  }

  openCourseDrawer(id = null) {
    const overlay = document.querySelector("#course-drawer-overlay");
    const titleH = document.querySelector("#course-drawer-title");
    const form = document.querySelector("#course-form");
    document.querySelector("#course-form-id").value = id || "";

    if (id) {
      titleH.innerText = "Editar Curso / Taller";
      const course = this.data.courses.find(c => c.id === id);
      if (course) {
        document.querySelector("#course-form-title").value = course.title;
        document.querySelector("#course-form-category").value = course.category;
        document.querySelector("#course-form-teacher").value = course.teacherId;
        document.querySelector("#course-form-schedule").value = course.schedule;
        document.querySelector("#course-form-duration").value = course.duration;
        document.querySelector("#course-form-price").value = course.price;
        document.querySelector("#course-form-desc").value = course.description;
      }
    } else {
      titleH.innerText = "Crear Nuevo Taller";
      form.reset();
    }
    overlay.style.display = "flex";
  }

  closeCourseDrawer() {
    document.querySelector("#course-drawer-overlay").style.display = "none";
  }

  handleCourseFormSubmit(e) {
    e.preventDefault();
    const id = document.querySelector("#course-form-id").value;
    const title = document.querySelector("#course-form-title").value;
    const category = document.querySelector("#course-form-category").value;
    const teacherId = document.querySelector("#course-form-teacher").value;
    const schedule = document.querySelector("#course-form-schedule").value;
    const duration = document.querySelector("#course-form-duration").value;
    const price = document.querySelector("#course-form-price").value;
    const description = document.querySelector("#course-form-desc").value;

    if (id) {
      const idx = this.data.courses.findIndex(c => c.id === id);
      if (idx !== -1) {
        this.data.courses[idx] = { ...this.data.courses[idx], title, category, teacherId, schedule, duration, price, description };
      }
    } else {
      this.data.courses.push({ id: "cur-" + Date.now(), title, category, teacherId, schedule, duration, price, description, studentsCount: 0 });
    }
    this.saveToStorage();
    this.closeCourseDrawer();
    this.renderAdminCourses();
    this.renderAllActiveLayouts();
  }

  deleteCourse(id) {
    if (confirm("¿Seguro de eliminar este curso/taller permanentemente?")) {
      this.data.courses = this.data.courses.filter(c => c.id !== id);
      this.saveToStorage();
      this.renderAdminCourses();
      this.renderAllActiveLayouts();
    }
  }

  openTeacherDrawer(id = null) {
    const overlay = document.querySelector("#teacher-drawer-overlay");
    const titleH = document.querySelector("#teacher-drawer-title");
    const form = document.querySelector("#teacher-form");
    document.querySelector("#teacher-form-id").value = id || "";

    if (id) {
      titleH.innerText = "Editar Docente";
      const teach = this.data.teachers.find(t => t.id === id);
      if (teach) {
        document.querySelector("#teacher-form-name").value = teach.name;
        document.querySelector("#teacher-form-specialty").value = teach.specialty;
        document.querySelector("#teacher-form-bio").value = teach.bio;
        document.querySelector("#teacher-form-exp").value = teach.experience;
      }
    } else {
      titleH.innerText = "Registrar Docente";
      form.reset();
    }
    overlay.style.display = "flex";
  }

  closeTeacherDrawer() {
    document.querySelector("#teacher-drawer-overlay").style.display = "none";
  }

  handleTeacherFormSubmit(e) {
    e.preventDefault();
    const id = document.querySelector("#teacher-form-id").value;
    const name = document.querySelector("#teacher-form-name").value;
    const specialty = document.querySelector("#teacher-form-specialty").value;
    const bio = document.querySelector("#teacher-form-bio").value;
    const experience = document.querySelector("#teacher-form-exp").value;

    if (id) {
      const idx = this.data.teachers.findIndex(t => t.id === id);
      if (idx !== -1) {
        this.data.teachers[idx] = { id, name, specialty, bio, experience };
      }
    } else {
      this.data.teachers.push({ id: "doc-" + Date.now(), name, specialty, bio, experience });
    }
    this.saveToStorage();
    this.closeTeacherDrawer();
    this.renderAdminCourses();
    this.renderAllActiveLayouts();
  }

  deleteTeacher(id) {
    const linked = this.data.courses.filter(c => c.teacherId === id);
    if (linked.length > 0) {
      alert(`No se puede eliminar: tiene los siguientes cursos asignados: ${linked.map(c=>c.title).join(", ")}`);
      return;
    }
    if (confirm("¿Desvincular a este docente?")) {
      this.data.teachers = this.data.teachers.filter(t => t.id !== id);
      this.saveToStorage();
      this.renderAdminCourses();
      this.renderAllActiveLayouts();
    }
  }

  renderAdminGallery() {
    const table = document.querySelector("#admin-gallery-tbody");
    if (!table) return;

    table.innerHTML = this.data.gallery.map(item => `
      <tr>
        <td>
          <div class="admin-gallery-preview">
            ${item.image.startsWith("data:") ? item.image : `<img src="${item.image}"/>`}
          </div>
        </td>
        <td><strong>${item.title}</strong></td>
        <td>${item.artist}</td>
        <td><span class="gallery-category-badge" style="position:static;">${item.category}</span></td>
        <td class="table-actions">
          <button class="action-btn del" onclick="app.deleteGalleryItem('${item.id}')">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  handleNewArtwork(e) {
    e.preventDefault();
    const title = document.querySelector("#art-form-title").value;
    const artist = document.querySelector("#art-form-artist").value;
    const category = document.querySelector("#art-form-category").value;
    const description = document.querySelector("#art-form-desc").value;
    const fileInput = document.querySelector("#art-form-file");

    const addArtwork = (imgSrc) => {
      this.data.gallery.unshift({ id: "gal-" + Date.now(), title, artist, category, description, image: imgSrc });
      this.saveToStorage();
      document.querySelector("#art-form").reset();
      this.renderAdminGallery();
      this.renderAllActiveLayouts();
      alert("¡Material artístico publicado en la Galería!");
    };

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => addArtwork(event.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      // Mock SVG
      const colors = ["#c2410c", "#7c3aed", "#eab308", "#15803d", "#0284c7"];
      const col = colors[Math.floor(Math.random() * colors.length)];
      const mockSvg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='${encodeURIComponent(col)}'/><circle cx='400' cy='300' r='180' fill='white' opacity='0.2'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-weight='bold' font-size='32' fill='white'>${encodeURIComponent(title)}</text></svg>`;
      addArtwork(mockSvg);
    }
  }

  deleteGalleryItem(id) {
    if (confirm("¿Seguro de quitar esta obra de la exhibición?")) {
      this.data.gallery = this.data.gallery.filter(g => g.id !== id);
      this.saveToStorage();
      this.renderAdminGallery();
      this.renderAllActiveLayouts();
    }
  }

  // --- MODAL DE DETALLE DE LA GALERÍA ---
  openGalleryModal(id) {
    const item = this.data.gallery.find(g => g.id === id);
    if (!item) return;

    const overlay = document.querySelector("#gallery-modal-overlay");
    const mImg = document.querySelector("#modal-img-container");
    const mTitle = document.querySelector("#modal-title");
    const mArtist = document.querySelector("#modal-artist");
    const mBadge = document.querySelector("#modal-category");
    const mDesc = document.querySelector("#modal-desc");

    mImg.innerHTML = item.image.startsWith("data:") ? item.image : `<img src="${item.image}"/>`;
    mTitle.innerText = item.title;
    mArtist.innerText = `Por ${item.artist}`;
    mBadge.innerText = item.category;
    mDesc.innerText = item.description;

    overlay.style.display = "flex";
  }

  closeGalleryModal() {
    document.querySelector("#gallery-modal-overlay").style.display = "none";
  }

  // --- INSCRIPCIÓN A TALLERES (MODAL) ---
  openInscripcionModal(courseId) {
    const course = this.data.courses.find(c => c.id === courseId);
    if (!course) return;

    const overlay = document.querySelector("#inscripcion-modal-overlay");
    document.querySelector("#inscripcion-course-title").innerText = course.title;
    document.querySelector("#inscripcion-course-id").value = course.id;
    overlay.style.display = "flex";
  }

  closeInscripcionModal() {
    document.querySelector("#inscripcion-modal-overlay").style.display = "none";
    document.querySelector("#inscripcion-form").reset();
  }

  handleInscripcionSubmit(e) {
    e.preventDefault();
    const courseId = document.querySelector("#inscripcion-course-id").value;
    const name = document.querySelector("#inscripcion-name").value;
    const email = document.querySelector("#inscripcion-email").value;
    const phone = document.querySelector("#inscripcion-phone").value;

    const idx = this.data.courses.findIndex(c => c.id === courseId);
    if (idx === -1) return;

    this.data.registrations.push({ id: "reg-" + Date.now(), name, email, phone, courseId, date: new Date().toISOString().split('T')[0] });
    this.data.courses[idx].studentsCount += 1;
    this.data.stats.visitorsToday += 1;

    this.saveToStorage();
    this.closeInscripcionModal();
    this.renderAllActiveLayouts();
    alert(`¡Felicidades ${name}! Tu solicitud de inscripción a "${this.data.courses[idx].title}" fue enviada.`);
  }

  // --- BACKUP CENTRALIZADO ---
  exportBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `peña-bellas-artes-backup-${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  }

  importBackup(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (importedData.profile && importedData.courses && importedData.teachers && importedData.gallery) {
          this.data = importedData;
          this.saveToStorage();
          alert("¡Material y base de datos restaurados con éxito!");
          window.location.reload();
        } else {
          alert("Estructura JSON inválida.");
        }
      } catch (err) {
        alert("Error al cargar JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  updateThemeSelectorUI() {
    document.querySelectorAll(".theme-opt").forEach(opt => {
      opt.classList.remove("active");
      if (opt.getAttribute("data-theme") === this.currentTheme) opt.classList.add("active");
    });
  }

  updateLayoutSelectorUI() {
    document.querySelectorAll(".layout-btn").forEach(btn => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-layout") === this.currentLayout) btn.classList.add("active");
    });
  }
}

// --------------------------------------------------------------------------
// 5. INICIALIZACIÓN GLOBAL
// --------------------------------------------------------------------------
let app;
window.addEventListener("DOMContentLoaded", () => {
  app = new AppState();
  window.app = app;

  // Cargar estados visuales
  app.setTheme(app.currentTheme);
  app.setLayout(app.currentLayout);
  app.setView("home"); // Para el layout clásico

  document.querySelectorAll(".theme-opt").forEach(opt => {
    opt.addEventListener("click", () => {
      app.setTheme(opt.getAttribute("data-theme"));
    });
  });

  // Listeners del Navbar Clásico
  document.querySelectorAll(".classic-header .nav-link").forEach(lnk => {
    lnk.addEventListener("click", () => {
      app.setView(lnk.getAttribute("data-target"));
    });
  });

  // Listeners del Sidebar de Administración
  document.querySelectorAll(".admin-side-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      app.setAdminTab(btn.getAttribute("data-tab"));
    });
  });

  // Modal click out
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        app.closeGalleryModal();
        app.closeInscripcionModal();
      }
    });
  });

  // Slider de socios cotizantes
  const slider = document.querySelector("#slider-socios");
  if (slider) {
    slider.addEventListener("input", (e) => {
      app.data.stats.activeMembers = parseInt(e.target.value);
      app.saveToStorage();
      app.updateIncomeEstimator();
      app.renderAllActiveLayouts();
    });
  }

  // Formularios en los diferentes layouts
  const formProfile = document.querySelector("#edit-profile-form");
  if (formProfile) formProfile.addEventListener("submit", (e) => app.saveProfileChanges(e));

  const formCourse = document.querySelector("#course-form");
  if (formCourse) formCourse.addEventListener("submit", (e) => app.handleCourseFormSubmit(e));

  const formTeacher = document.querySelector("#teacher-form");
  if (formTeacher) formTeacher.addEventListener("submit", (e) => app.handleTeacherFormSubmit(e));

  const formArtwork = document.querySelector("#art-form");
  if (formArtwork) formArtwork.addEventListener("submit", (e) => app.handleNewArtwork(e));

  const formInscripcion = document.querySelector("#inscripcion-form");
  if (formInscripcion) formInscripcion.addEventListener("submit", (e) => app.handleInscripcionSubmit(e));

  // Input de importación de Backup
  const fileBackupInput = document.querySelector("#backup-file-input");
  if (fileBackupInput) fileBackupInput.addEventListener("change", (e) => app.importBackup(e));
});
