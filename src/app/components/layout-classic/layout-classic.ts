import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutAdmin } from '../layout-admin/layout-admin';
import { Calendario } from '../calendario/calendario';
import { AppStateService, Course, GalleryItem, Registration } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-classic',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutAdmin, Calendario], 
  templateUrl: './layout-classic.html',
  styleUrl: './layout-classic.css',
})

export class LayoutClassic implements OnInit {
  state = inject(AppStateService); //inyecta servicio de estado global para acceder a datos y funciones compartidas

  //el componente usa signals para manejar su eestado interno, como el filtro de la galería, la búsqueda, 
  // y el estado del menú móvil. Estas señales actualizan la interfaz automaticamente cuando cambian.
  galleryFilter = signal<string>('all'); 
  gallerySearch = signal<string>('');
  mobileMenuOpen = signal<boolean>(false);
  showGalleryModal = signal<boolean>(false);
  selectedGalleryItem = signal<GalleryItem | null>(null);
  showInscripcionModal = signal<boolean>(false);
  selectedCourse = signal<Course | null>(null);
  inscripcionForm = signal<{ name: string; email: string; phone: string }>({
    name: '', email: '', phone: ''
  });

  historyParagraphs = computed(() => this.state.historyParagraphs());

  galleryCategories = ['all', 'Pintura', 'Escultura', 'Cerámica', 'Dibujo', 'Conciertos', 'Talleres'];

  filteredGallery = computed(() => {
    const items = this.state.appData().gallery;
    const filter = this.galleryFilter();
    const search = this.gallerySearch().toLowerCase();
    return items
      .filter(item => filter === 'all' || item.category === filter)
      .filter(item => !search || item.title.toLowerCase().includes(search) || item.artist.toLowerCase().includes(search));
  });

  ngOnInit() {}

  /***********************************************************************
   * Metodo para alternar el estado del menú móvil. Cambia el valor de la señal mobileMenuOpen a su opuesto.
   * Si el menú está cerrado, lo abre; si está abierto, lo cierra. Esto permite que el menú móvil se muestre
   * o se oculte en función de la interacción del usuario con el botón del menú.
   ***********************************************************************/
  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  /***********************************************************************
   * Metodo para actualizar un campo del formulario de inscripción. Recibe el
   * nombre del campo y su nuevo valor, luego actualiza la señal inscripcionForm
   * con el nuevo valor manteniendo los demás campos intactos. Esto permite que
   * el formulario de inscripción se mantenga sincronizado con la interfaz de
   * usuario a medida que el usuario ingresa sus datos.
   * @param field - El nombre del campo a actualizar (name, email o phone).
   * @param value - El nuevo valor para el campo especificado.
   ***********************************************************************/
  updateInscripcionField(field: string, value: any) {
    const current = this.inscripcionForm();
    this.inscripcionForm.set({ ...current, [field]: value });
  }


  /**********************************************************************
   * Metodo para navegar entre las vistas clásicas.
   * Actualiza la vista actual en el estado global y cierra el menú móvil.
   * @param view - Nombre de la vista a mostrar (home, gallery, courses, contact, etc.)
   **********************************************************************/
  navigate(view: string) {
    this.state.setClassicView(view);
    this.mobileMenuOpen.set(false);
  }


  /**********************************************************************
   * 
   * Metodo para abrir un modal con los detalles de una obra de arte
   * seleccionada en la galería. Actualiza la señal selectedGalleryItem
   * con el item seleccionado y muestra el modal.
   * @param item 
   * 
   *********************************************************************/
  openGalleryModal(item: GalleryItem) {
    this.selectedGalleryItem.set(item);
    this.showGalleryModal.set(true);
  }


  /**********************************************************************
   * 
   * Metodo para cerrar el modal de detalles de la galería. Oculta el 
   * modal y limpia la señal selectedGalleryItem para que no quede 
   * información residual del item anterior. Esto asegura que al abrir el
   * modal nuevamente, no se muestre información incorrecta o desactualizada.
   * 
   **********************************************************************/
  closeGalleryModal() {
    this.showGalleryModal.set(false);
    this.selectedGalleryItem.set(null);
  }

  
  /*********************************************************************
   * 
   * Metodo para abrir el modal de inscripción a un taller. Recibe el 
   * curso seleccionado, actualiza el signal selectedCourse con ese curso,
   * resetea el formulario de inscripción y muestra el modal. Esto permite
   * que el usuario vea los detalles del curso al que se va a inscribir y 
   * tenga un formulario limpio para ingresar sus datos. 
   * @param course 
   * 
   *********************************************************************/
  openInscripcionModal(course: Course) {
    this.selectedCourse.set(course);
    this.inscripcionForm.set({ name: '', email: '', phone: '' });
    this.showInscripcionModal.set(true);
  }

  
  /*********************************************************************
   * Metodo para cerrar el modal de inscripción a un taller. Oculta el 
   * modal y limpia el signal selectedCourse para que no quede información
   * residual del curso seleccionado. Esto asegura que al abrir el modal
   * nuevamente, no se muestre información incorrecta o desactualizada
   * del curso anterior. Además, resetea el formulario de inscripción 
   * para que esté limpio para la próxima inscripción. 
   * 
   * @returns void
   *********************************************************************/
  closeInscripcionModal() {
    this.showInscripcionModal.set(false);
    this.selectedCourse.set(null);
  }

  /********************************************************************
   * Metodo para manejar la inscripción a un taller. Valida que haya un
   * curso seleccionado y que el formulario esté completo. Si todo es 
   * correcto, crea un nuevo registro de inscripción con los datos del 
   * formulario y el curso seleccionado, lo agrega al estado global 
   * usando el servicio AppStateService, muestra una alerta de éxito y
   * cierra el modal de inscripción. Esto permite que los usuarios se 
   * inscriban fácilmente a los talleres disponibles y que la información
   * de las inscripciones se gestione centralizadamente en el estado 
   * global de la aplicación. 
   * this.inscripcionForm() es un signal que devuelve el estado actual del
   * formulario de inscripción, que contiene los campos name, email y phone.
   * @param event - El evento de envío del formulario de inscripción. 
   * Se previene su comportamiento por defecto para manejar la lógica 
   * de inscripción manualmente.
   * @returns 
   *******************************************************************/
  submitInscripcion() {
    const form = this.inscripcionForm();
    const course = this.selectedCourse();
    if (!course || !form.name || !form.email || !form.phone) return;

    const reg: Registration = {
      id: `reg-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      courseId: course.id,
      date: new Date().toISOString().split('T')[0]
    };

    this.state.saveRegistration(reg);
    alert(`¡Inscripción al taller "${course.title}" realizada con éxito!`);
    this.closeInscripcionModal();
  }

  /********************************************************************
   * Metodo para obtener el nombre del profesor a partir de su ID. Busca
   * en la lista de profesores del estado global el que tenga el ID 
   * coincidente y devuelve su nombre. Si no se encuentra ningún profesor
   * con ese ID, devuelve 'A designar' para indicar que el profesor aún
   * no ha sido asignado. Esto es útil para mostrar el nombre del profesor
   * en la interfaz de usuario cuando solo se tiene su ID disponible.
   * @param teacherId - El ID del profesor cuyo nombre se desea obtener.
   * @returns El nombre del profesor o 'A designar' si no se encuentra.
   ********************************************************************/
  getTeacherName(teacherId: string): string {
    const teacher = this.state.appData().teachers.find(t => t.id === teacherId);
    return teacher?.name ?? 'A designar';
  }

  /********************************************************************
   * Metodo para manejar el envío del formulario de contacto.
   * Previene el comportamiento por defecto del formulario y muestra
   * una alerta de éxito. Luego, resetea el formulario.
   * @param event - El evento de envío del formulario de contacto.
   ********************************************************************/
  handleContactSubmit(event: Event) {
    event.preventDefault();
    alert('¡Mensaje despachado con éxito a la administración de la Peña!');
    (event.target as HTMLFormElement).reset();
  }
}
