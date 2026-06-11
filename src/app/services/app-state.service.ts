import { Injectable, signal, computed, inject } from '@angular/core';
import { PersistenceService } from './persistence.service';

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

export interface Member {
  id: string;
  name: string;
  apellido: string;
  phone: string;
  email: string;
  description: string;
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
  members: Member[];
}

const EMPTY_DATA: AppData = {
  profile: {
    name: "", founded: "", location: "", address: "", phone: "", email: "", schedule: "", description: ""
  },
  authorities: [],
  teachers: [],
  courses: [],
  gallery: [],
  stats: { monthlyVisits: [], activeMembers: 0, visitorsToday: 0 },
  registrations: [],
  members: []
};

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // Inyección del servicio de persistencia para manejar el almacenamiento de datos
  private persistence = inject(PersistenceService);

  // Signals para gestionar el estado reactivo
  public layout = signal<string>(localStorage.getItem('penia-layout') || 'classic');
  public isAdminActive = signal<boolean>(false);

  // Vistas internas
  public currentClassicView = signal<string>('home');
  public currentAdminTab = signal<string>('metrics');

  // Señal principal de datos
  public appData = signal<AppData>(EMPTY_DATA);
  public historyParagraphs = signal<string[]>([]);

  // Costo cuota de socios
  public sociosTrimestralFee = 5000;

  // Calculos derivados reactivos mediante computed()
  public calculatedIncome = computed(() => {
    return this.appData().stats.activeMembers * this.sociosTrimestralFee;
  });

  // Estado del menú móvil
  public incomePercent = computed(() => {
    return Math.min((this.calculatedIncome() / 1000000) * 100, 100);
  });

  constructor() {
    this.applyLayout(this.layout(), this.isAdminActive());
  this.initData();  // ← nuevo método async
  }

  private async initData() {
  const saved = await this.persistence.load();
  if (saved) {
    if (!saved.members) saved.members = [];
    this.appData.set(saved);
  } else {
    await this.loadInitialData();
  }
}
  private async loadInitialData() {
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      const appData = data.appData;
      if (!appData.members) {
        appData.members = [];
      }
      this.appData.set(appData);
      this.historyParagraphs.set(data.historyParagraphs);

    // Guardar en Supabase para que la próxima carga lo encuentre
    await this.persistence.save(appData);
    } catch (e) {
      console.error('Error al cargar datos iniciales', e);
    }
  }

  /***********************************************************************
   * Metodo para cargar los datos del estado desde localStorage. Intenta
   * obtener la cadena JSON almacenada en localStorage bajo la clave
   * 'penia-app-data' y la convierte en un objeto AppData. Si ocurre algún
   * error durante este proceso (por ejemplo, si el almacenamiento está lleno
   * o no se permite el acceso), se captura la excepción y se muestra un
   * mensaje de error en la consola.
   * @returns AppData | null - Los datos cargados o null si no hay datos
   **********************************************************************/
  /* private loadFromStorage(): AppData | null {
    try {
      const dataStr = localStorage.getItem('penia-app-data');
      if (!dataStr) return null;
      const data = JSON.parse(dataStr) as AppData;
      if (!data.members) {
        data.members = [];
      }
      return data;
    } catch (e) {
      console.error('Error al cargar de localStorage', e);
      return null;
    }
  } */


  /***********************************************************************
   * Metodo para guardar el estado actual en persistencia (localStorage o API).
   * Delegado al servicio de persistencia para permitir migración futura a 
   * bases de datos sin cambiar esta interfaz.
   * **********************************************************************/
  public async saveToStorage() {
    await this.persistence.save(this.appData());
  }


  /***********************************************************************
   * Metodo para limpiar el estado persistido (para logout, reset, etc).
   * Delegado al servicio de persistencia para permitir migración futura a
   * bases de datos sin cambiar esta interfaz.
   * **********************************************************************/
  public async clearStorage() {
    await this.persistence.clear();
  }


  /************************************************************************
   * Metodo para actualizar el diseño de la interfaz. Recibe el nombre del diseño
   * y un booleano que indica si la vista de administración está activa, y aplica
   * las clases correspondientes al body del DOM.
   * @param layoutName - Nombre del diseño a aplicar
   * @param adminActive - Indica si la vista de administración está activa
   **********************************************************************/
  public setLayout(newLayout: string) {
    this.layout.set(newLayout);
    localStorage.setItem('penia-layout', newLayout);
    this.applyLayout(newLayout, this.isAdminActive());
  }

  /************************************************************************
   * Metodo para alternar la vista de administración. Cambia el valor de la
   * señal isAdminActive a su valor contrario (true/false) y luego reaplica
   * el layout para que se actualicen las clases del body del DOM según el 
   * nuevo estado.    
   ************************************************************************/
  public toggleAdminView() {
    this.isAdminActive.update(val => !val);
    this.applyLayout(this.layout(), this.isAdminActive());
  }


  /***********************************************************************
   * Metodo para aplicar el diseño de la interfaz. Recibe el nombre del diseño
   * y un booleano que indica si la vista de administración está activa, y aplica
   * las clases correspondientes al body del DOM.
   * @param layoutName - Nombre del diseño a aplicar
   * @param adminActive - Indica si la vista de administración está activa
   **********************************************************************/
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


  /**********************************************************************
   * Metodo para actualizar la vista clásica. Recibe el nombre de la vista
   * a activar y actualiza la señal currentClassicView con ese nombre para
   * que la vista se actualice y muestre el contenido correspondiente.
   * @param viewName - Nombre de la vista a activar
   **********************************************************************/
  public setClassicView(viewName: string) {
    this.currentClassicView.set(viewName);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }


  /**********************************************************************
   * Metodo para actualizar la pestaña activa en la vista de administración.
   * Recibe el nombre de la pestaña a activar (metrics, profile, authorities,
   * courses, teachers, gallery) y actualiza la señal currentAdminTab con ese
   * nombre para que la vista se actualice y muestre la pestaña correspondiente.
   * @param tabName - Nombre de la pestaña a activar
   **********************************************************************/
  public setAdminTab(tabName: string) {
    this.currentAdminTab.set(tabName);
  }


  /**
   * Metodo para actualizar el perfil de la organización. Recibe un objeto
   * OrganizationProfile con los datos actualizados del perfil, actualiza el
   * estado global con esos datos y luego guarda el estado actualizado en 
   * persistencia para persistencia.
   * @param updatedProfile - Objeto con los datos actualizados del perfil
   **********************************************************************/
  public updateProfile(updatedProfile: OrganizationProfile) {
    this.appData.update(state => {
      const newState = { ...state, profile: updatedProfile };
      return newState;
    });
    this.saveToStorage();
  }


  /**********************************************************************
   * Metodo para actualizar el número de miembros activos en las 
   * estadísticas. Recibe el nuevo número de miembros activos, actualiza el
   * estado global con ese número y luego guarda el estado actualizado en 
   * localStorage para persistencia.
   * @param membersCount - Nuevo número de miembros activos
   **********************************************************************/
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


  /**********************************************************************
   * Metodo para agregar una nueva autoridad a la Comisión Directiva. Recibe
   * un objeto Authority con los datos de la nueva autoridad, lo agrega al
   * array de autoridades en el estado y luego guarda el estado actualizado
   * en localStorage para persistencia.
   * @param auth - Objeto con los datos de la nueva autoridad (rol, nombre,
   * especialidad)
   **********************************************************************/
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


  /**********************************************************************
   * Metodo para editar una autoridad de la Comisión Directiva. Recibe el
   * índice de la autoridad a editar y un objeto Authority con los datos
   * actualizados. Actualiza el array de autoridades reemplazando el item
   * en el índice correspondiente y luego actualiza el estado con el nuevo
   * array. Luego guarda el estado actualizado en localStorage para 
   * persistencia.
   * @param index - Índice de la autoridad a editar
   * @param updatedAuth - Objeto Authority con los datos actualizados
   **********************************************************************/
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


  /**********************************************************************
   * Metodo para eliminar una autoridad de la Comisión Directiva. Recibe
   * el índice de la autoridad a eliminar, actualiza el array de autoridades 
   * filtrando la autoridad eliminada y actualiza el estado con
   * el nuevo array. Luego guarda el estado actualizado en localStorage para
   * persistencia.
   * @param index - Índice de la autoridad a eliminar
   **********************************************************************/
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


  /**********************************************************************
   * Metodo para agregar o editar un curso en el sistema. Recibe un 
   * objeto Course con los datos del curso a agregar o editar. Si el ID
   * del curso ya existe, se actualizan sus datos, si no existe, se agrega
   * como nuevo curso. Luego guarda el estado actualizado en localStorage
   * para persistencia.
   * @param course - Objeto con los datos del curso a agregar o editar
   **********************************************************************/
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


  /**********************************************************************
   * Metodo para eliminar un curso del sistema. Recibe el ID del curso
   * a eliminar, actualiza el array de cursos filtrando el curso 
   * eliminado y también actualiza los docentes que tenían asignado ese curso
   * dejando el campo teacherId vacío. Luego guarda el estado actualizado
   * en localStorage para persistencia.
   * @param id - ID del curso a eliminar
   **********************************************************************/
  public deleteCourse(id: string) {
    this.appData.update(state => {
      const updatedList = state.courses.filter(c => c.id !== id);
      return { ...state, courses: updatedList };
    });
    this.saveToStorage();
  }


  /***********************************************************************
   * Metodo para agregar o editar un docente en el sistema. Recibe un 
   * objeto Teacher con los datos del docente a agregar o editar. Si el ID
   * del docente ya existe, se actualizan sus datos, si no existe, se agrega
   * como nuevo docente. Luego guarda el estado actualizado en localStorage
   * para persistencia.
   * @param teacher - Objeto con los datos del docente a agregar o editar
   ***********************************************************************/
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


  /**********************************************************************
   * Metodo para eliminar un docente del sistema. Recibe el ID del docente
   * a eliminar, actualiza el array de docentes filtrando el docente 
   * eliminado y también actualiza los cursos que tenían asignado ese docente
   * dejando el campo teacherId vacío. Luego guarda el estado actualizado
   * en localStorage para persistencia.
   * @param id - ID del docente a eliminar
   **********************************************************************/
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

  /*********************************************************************
   * 
   * Galeria
   * Guarda un item de la galería, ya sea nuevo o existente.
   * @param item - Item de la galería a guardar
   * 
   *********************************************************************/
  public saveGalleryItem(item: GalleryItem) {
    this.appData.update(state => {
      const existsIndex = state.gallery.findIndex(g => g.id === item.id);
      const updatedList = [...state.gallery];
      if (existsIndex > -1) {
        updatedList[existsIndex] = item;
      } else {
        updatedList.push(item);
      }
      return { ...state, gallery: updatedList };
    });
    this.saveToStorage();
  }

  /*********************************************************************
   * Metodo para eliminar una obra de arte de la galería. Recibe el id 
   * del item a eliminar, filtra el array de gallery para excluir ese item 
   * y actualiza el estado con el nuevo array. Luego guarda el estado 
   * actualizado en localStorage para persistencia.
   * @param id - ID del item de la galería a eliminar
   ********************************************************************/
  public deleteGalleryItem(id: string) {
    this.appData.update(state => {
      return {
        ...state,
        gallery: state.gallery.filter(item => item.id !== id)
      };
    });
    this.saveToStorage();
  }


  /*********************************************************************
   * 
   * Inscripciones
   * Guarda una inscripción, ya sea nueva o existente.
   * @param reg - Datos de la inscripción.
   * 
   *******************************************************************/
  public saveRegistration(reg: Registration) {
    this.appData.update(state => {
      const existsIndex = state.registrations.findIndex(r => r.id === reg.id);
      let updatedList = [...state.registrations];
      let updatedCourses = [...state.courses];

      if (existsIndex > -1) {
        // If course changed, we should ideally adjust counts, but for simplicity, we'll just update the reg
        updatedList[existsIndex] = reg;
      } else {
        updatedList.push(reg);
        // Incrementar contador de alumnos en el curso
        updatedCourses = updatedCourses.map(c => {
          if (c.id === reg.courseId) {
            return { ...c, studentsCount: c.studentsCount + 1 };
          }
          return c;
        });
      }

      return {
        ...state,
        registrations: updatedList,
        courses: updatedCourses
      };
    });
    this.saveToStorage();
  }

  /**********************************************************************
   * 
   * Metodo para agregar o editar un socio. Si el ID ya existe, se 
   * actualizan sus datos; de lo contrario, se agrega a la lista.
   * 
   **********************************************************************/
  public saveMember(member: Member) {
    this.appData.update(state => {
      const members = state.members || [];
      const existsIndex = members.findIndex(m => m.id === member.id);
      const updatedList = [...members];
      if (existsIndex > -1) {
        updatedList[existsIndex] = member;
      } else {
        updatedList.push(member);
      }
      return { ...state, members: updatedList };
    });
    this.saveToStorage();
  }

  /**********************************************************************
   * 
   * Metodo para eliminar un socio del sistema. Recibe el ID del socio
   * a eliminar, actualiza el array de socios filtrando el socio 
   * eliminado y también actualiza las inscripciones que tenían asignado ese socio
   * dejando el campo memberId vacío. Luego guarda el estado actualizado
   * en localStorage para persistencia.
   * 
   * @param id - ID del socio a eliminar
   * 
   ***********************************************************************/
  public deleteMember(id: string) {
    this.appData.update(state => {
      const members = state.members || [];
      const updatedList = members.filter(m => m.id !== id);
      return { ...state, members: updatedList };
    });
    this.saveToStorage();
  }


  /**********************************************************************
   * 
   * Metodo para eliminar una inscripción del sistema. Recibe el ID de 
   * la inscripción a eliminar, actualiza el array de inscripciones filtrando 
   * la inscripción eliminada y también actualiza los cursos que tenían 
   * asignado esa inscripción dejando el campo registrationId vacío. Luego 
   * guarda el estado actualizado en localStorage para persistencia.
   * 
   * @param id - ID de la inscripción a eliminar
   * 
   ***********************************************************************/
  public deleteRegistration(id: string) {
    this.appData.update(state => {
      const reg = state.registrations.find(r => r.id === id);
      if (!reg) return state;

      const updatedList = state.registrations.filter(r => r.id !== id);
      const updatedCourses = state.courses.map(c => {
        if (c.id === reg.courseId) {
          return { ...c, studentsCount: Math.max(0, c.studentsCount - 1) };
        }
        return c;
      });

      return {
        ...state,
        registrations: updatedList,
        courses: updatedCourses
      };
    });
    this.saveToStorage();
  }

  /*********************************************************************
   * Metodo para importar una copia de seguridad de los datos de la 
   * aplicación. Recibe un objeto AppData con los datos importados y 
   * actualiza el estado global con esos datos. Luego guarda el estado 
   * actualizado en localStorage para persistencia.
   * @param importedData - Objeto con los datos importados
   *********************************************************************/
  public importBackup(importedData: AppData) {
    this.appData.set(importedData);
    this.saveToStorage();
  }
}
