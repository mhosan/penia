import { Injectable, signal, computed } from '@angular/core';

export interface OrganizationProfile {
  name: string;
  founded: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  schedule: string;
  description: string;
}

export interface Authority {
  role: string;
  name: string;
  specialty: string;
}

export interface Teacher {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  experience: string;
}

export interface Course {
  id: string;
  title: string;
  teacherId: string;
  schedule: string;
  duration: string;
  description: string;
  price: string;
  category: string;
  studentsCount: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  artist: string;
  category: string;
  description: string;
  image: string;
}

export interface Stats {
  monthlyVisits: number[];
  activeMembers: number;
  visitorsToday: number;
}

export interface Registration {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  date: string;
}

export interface AppData {
  profile: OrganizationProfile;
  authorities: Authority[];
  teachers: Teacher[];
  courses: Course[];
  gallery: GalleryItem[];
  stats: Stats;
  registrations: Registration[];
}

const INITIAL_DATA: AppData = {
  profile: {
    name: "Peña de las Bellas Artes",
    founded: "20 de junio de 1936",
    location: "La Plata, Provincia de Buenos Aires",
    address: "Calle 50 Nro. 543 e/ 5 y 6, La Plata",
    phone: "+54 (221) 422-8765",
    email: "contacto@penadebellasartes.org.ar",
    schedule: "Lunes a Viernes de 14:00 a 21:00 hs y Sábados de 9:00 a 13:00 hs.",
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
    activeMembers: 142,
    visitorsToday: 67
  },
  registrations: [
    { id: "reg-1", name: "Mariano Espósito", email: "mariano@gmail.com", phone: "2214321098", courseId: "cur-1", date: "2026-05-24" },
    { id: "reg-2", name: "Estefanía Paz", email: "estefaniap@hotmail.com", phone: "2215678321", courseId: "cur-3", date: "2026-05-25" }
  ]
};

export const HISTORY_PARAGRAPHS = [
  '<strong>"La Peña"</strong> inició sus actividades en <strong>junio de 1936</strong> y su primer local estuvo emplazado en la <strong>calle 6 entre 49 y 50</strong> de la ciudad de La Plata. En sus inicios, formó a un gran número de adolescentes, muchos de los cuales alcanzaron en el mediano plazo lugares muy destacados y reconocidos en el ámbito de las artes plásticas nacionales e internacionales.',
  'Años después, gracias al esfuerzo mancomunado de sus miembros y socios protectores, logró adquirir la casa edilicia que ocupa actualmente en pleno <strong>centro neurálgico platense</strong> (Calle 50 entre 5 e/ 5 y 6).',
  'Fueron sus fundadores un entusiasta y comprometido grupo de jóvenes enamorados del arte provenientes de diversas corrientes creativas: pintores, músicos, escritores, poetas, escultores y ceramistas. Hoy, los actuales componentes de la Comisión Directiva, continúan con renovados bríos la tarea propuesta por aquellos creadores pioneros, transmitiéndole la impronta renovadora que los tiempos actuales imponen.',
  'Cultivando diversas actividades creadoras (pintura, poesía, música, literatura, escultura, etc.) accedieron a la presidencia, desde su inicio y sucesivamente, los siguientes artistas a quienes les rendimos desde aquí un pequeño pero sincero y justo homenaje: <em>José M. De la Torre, Arturo González, José Mutti, Dolores López Aranguren, Cleto Ciocchini, Carmelo Yorio, Roberto Della Crocce, Ambrosio Aliverti, José Gaspar Mancuso, Rubén Giudice, Edgard Ortiz y René Palermo.</em>'
];

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  // Signals para gestionar el estado reactivo
  public theme = signal<string>(localStorage.getItem('penia-theme') || 'mixed');
  public layout = signal<string>(localStorage.getItem('penia-layout') || 'classic');
  public isAdminActive = signal<boolean>(false);
  
  // Vistas internas
  public currentClassicView = signal<string>('home');
  public currentAdminTab = signal<string>('metrics');
  
  // Señal principal de datos
  public appData = signal<AppData>(this.loadFromStorage() || INITIAL_DATA);
  
  // Costo cuota de socios
  public sociosTrimestralFee = 5000;
  
  // Calculos derivados reactivos mediante computed()
  public calculatedIncome = computed(() => {
    return this.appData().stats.activeMembers * this.sociosTrimestralFee;
  });

  public incomePercent = computed(() => {
    return Math.min((this.calculatedIncome() / 1000000) * 100, 100);
  });

  constructor() {
    // Escuchar cambios de tema y aplicarlos al body del DOM
    this.applyTheme(this.theme());
    this.applyLayout(this.layout(), this.isAdminActive());
  }

  private loadFromStorage(): AppData | null {
    try {
      const dataStr = localStorage.getItem('penia-app-data');
      return dataStr ? JSON.parse(dataStr) : null;
    } catch (e) {
      console.error('Error al cargar de localStorage', e);
      return null;
    }
  }

  public saveToStorage() {
    try {
      localStorage.setItem('penia-app-data', JSON.stringify(this.appData()));
    } catch (e) {
      console.error('Error al guardar en localStorage', e);
    }
  }

  public setTheme(newTheme: string) {
    this.theme.set(newTheme);
    localStorage.setItem('penia-theme', newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(themeName: string) {
    // Reemplaza la clase theme-xxx en el body
    const body = document.body;
    body.className = body.className.replace(/theme-\S+/g, `theme-${themeName}`);
    if (!body.classList.contains(`theme-${themeName}`)) {
      body.classList.add(`theme-${themeName}`);
    }
  }

  public setLayout(newLayout: string) {
    this.layout.set(newLayout);
    localStorage.setItem('penia-layout', newLayout);
    this.applyLayout(newLayout, this.isAdminActive());
  }

  public toggleAdminView() {
    this.isAdminActive.update(val => !val);
    this.applyLayout(this.layout(), this.isAdminActive());
  }

  private applyLayout(layoutName: string, adminActive: boolean) {
    const body = document.body;
    // Limpia layouts anteriores
    body.className = body.className.replace(/layout-\S+/g, `layout-${layoutName}`);
    
    if (!body.classList.contains(`layout-${layoutName}`)) {
      body.classList.add(`layout-${layoutName}`);
    }

    if (adminActive) {
      body.classList.add('layout-admin');
    } else {
      body.classList.remove('layout-admin');
    }
  }

  public setClassicView(viewName: string) {
    this.currentClassicView.set(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public setAdminTab(tabName: string) {
    this.currentAdminTab.set(tabName);
  }

  // --- MUTADORES DE DATOS ---

  public updateProfile(updatedProfile: OrganizationProfile) {
    this.appData.update(state => {
      const newState = { ...state, profile: updatedProfile };
      return newState;
    });
    this.saveToStorage();
  }

  public updateActiveMembers(membersCount: number) {
    this.appData.update(state => {
      const newState = {
        ...state,
        stats: {
          ...state.stats,
          activeMembers: membersCount
        }
      };
      return newState;
    });
    this.saveToStorage();
  }

  // Autoridades CD
  public addAuthority(auth: Authority) {
    this.appData.update(state => {
      const newState = {
        ...state,
        authorities: [...state.authorities, auth]
      };
      return newState;
    });
    this.saveToStorage();
  }

  public editAuthority(index: number, updatedAuth: Authority) {
    this.appData.update(state => {
      const updatedList = [...state.authorities];
      updatedList[index] = updatedAuth;
      return {
        ...state,
        authorities: updatedList
      };
    });
    this.saveToStorage();
  }

  public deleteAuthority(index: number) {
    this.appData.update(state => {
      const updatedList = state.authorities.filter((_, i) => i !== index);
      return {
        ...state,
        authorities: updatedList
      };
    });
    this.saveToStorage();
  }

  // Talleres / Cursos
  public saveCourse(course: Course) {
    this.appData.update(state => {
      const existsIndex = state.courses.findIndex(c => c.id === course.id);
      const updatedList = [...state.courses];
      if (existsIndex > -1) {
        updatedList[existsIndex] = course;
      } else {
        updatedList.push(course);
      }
      return { ...state, courses: updatedList };
    });
    this.saveToStorage();
  }

  public deleteCourse(id: string) {
    this.appData.update(state => {
      const updatedList = state.courses.filter(c => c.id !== id);
      return { ...state, courses: updatedList };
    });
    this.saveToStorage();
  }

  // Docentes
  public saveTeacher(teacher: Teacher) {
    this.appData.update(state => {
      const existsIndex = state.teachers.findIndex(t => t.id === teacher.id);
      const updatedList = [...state.teachers];
      if (existsIndex > -1) {
        updatedList[existsIndex] = teacher;
      } else {
        updatedList.push(teacher);
      }
      return { ...state, teachers: updatedList };
    });
    this.saveToStorage();
  }

  public deleteTeacher(id: string) {
    this.appData.update(state => {
      // Al eliminar docente, dejamos a los cursos huérfanos o con string vacío
      const updatedCourses = state.courses.map(c => c.teacherId === id ? { ...c, teacherId: '' } : c);
      const updatedTeachers = state.teachers.filter(t => t.id !== id);
      return {
        ...state,
        teachers: updatedTeachers,
        courses: updatedCourses
      };
    });
    this.saveToStorage();
  }

  // Galería de Obras
  public addGalleryItem(item: GalleryItem) {
    this.appData.update(state => {
      return {
        ...state,
        gallery: [...state.gallery, item]
      };
    });
    this.saveToStorage();
  }

  public deleteGalleryItem(id: string) {
    this.appData.update(state => {
      return {
        ...state,
        gallery: state.gallery.filter(item => item.id !== id)
      };
    });
    this.saveToStorage();
  }

  // Inscripciones
  public addRegistration(reg: Registration) {
    this.appData.update(state => {
      // Incrementar contador de alumnos en el curso
      const updatedCourses = state.courses.map(c => {
        if (c.id === reg.courseId) {
          return { ...c, studentsCount: c.studentsCount + 1 };
        }
        return c;
      });
      return {
        ...state,
        registrations: [...state.registrations, reg],
        courses: updatedCourses
      };
    });
    this.saveToStorage();
  }

  // Exportar / Importar
  public importBackup(importedData: AppData) {
    this.appData.set(importedData);
    this.saveToStorage();
  }
}
