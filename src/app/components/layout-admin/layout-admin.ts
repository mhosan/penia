import { Component, inject, signal, computed, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppStateService, OrganizationProfile, Authority, Course, Teacher, GalleryItem, Registration, Member } from '../../services/app-state.service';

@Component({
  selector: 'app-layout-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css',
})
export class LayoutAdmin implements OnInit, AfterViewInit {
  state = inject(AppStateService);

  // Tabs
  activeTab = computed(() => this.state.currentAdminTab());

  // Profile form
  profileForm = signal<OrganizationProfile>({ ...this.state.appData().profile });
  profileSaved = signal<boolean>(false);

  // Socios slider
  sociosCount = signal<number>(this.state.appData().stats.activeMembers);
  income = computed(() => this.sociosCount() * this.state.sociosTrimestralFee);
  incomePercent = computed(() => Math.min((this.income() / 1000000) * 100, 100));
  incomeDashoffset = computed(() => {
    const circ = 2 * Math.PI * 35;
    return circ - (this.incomePercent() / 100) * circ;
  });

  // Modals
  showCourseDrawer = signal<boolean>(false);
  showTeacherDrawer = signal<boolean>(false);
  showMemberDrawer = signal<boolean>(false);

  editingCourse = signal<Course | null>(null);
  editingTeacher = signal<Teacher | null>(null);
  editingMember = signal<Member | null>(null);

  courseForm = signal<Course>({ id: '', title: '', teacherId: '', schedule: '', duration: '', description: '', price: '', category: 'Pintura', studentsCount: 0 });
  teacherForm = signal<Teacher>({ id: '', name: '', specialty: '', bio: '', experience: '' });
  memberForm = signal<Member>({ id: '', name: '', apellido: '', phone: '', email: '', description: '' });

  showGalleryDrawer = signal<boolean>(false);
  editingGallery = signal<GalleryItem | null>(null);
  galleryForm = signal<GalleryItem>({ id: '', title: '', artist: '', category: 'Pintura', description: '', image: '' });

  showRegistrationDrawer = signal<boolean>(false);
  editingRegistration = signal<Registration | null>(null);
  registrationForm = signal<Registration>({ id: '', name: '', email: '', phone: '', courseId: '', date: '' });

  monthlyVisitsStr = computed(() => this.state.appData().stats.monthlyVisits.join(', '));

  ngOnInit() {
    this.profileForm.set({ ...this.state.appData().profile });
    this.sociosCount.set(this.state.appData().stats.activeMembers);
  }

  ngAfterViewInit() { }

  /*********************************************************************
   * Este metodo se llama al hacer clic en una pestaña del menú lateral. 
   * Actualiza el estado de la pestaña activa y, si se selecciona la 
   * pestaña de perfil, carga los datos actuales del perfil en el 
   * formulario para su edición. Esto asegura que el formulario siempre
   * muestre la información más reciente del perfil de la organización
   * cuando se accede a esa sección.    
   * @param tab 
   *********************************************************************/
  setTab(tab: string) {
    this.state.setAdminTab(tab);

    if (tab === 'profile') {
      this.profileForm.set({ ...this.state.appData().profile });
    }
  }


  updateSociosCount(value: number) {
    this.sociosCount.set(value);
    this.state.updateActiveMembers(value);
  }

  updateVisitorsToday(value: number) {
    this.state.appData.update(s => ({ ...s, stats: { ...s.stats, visitorsToday: value } }));
    this.state.saveToStorage();
  }

  updateMonthlyVisits(value: string) {
    const arr = value.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
    if (arr.length > 0) {
      this.state.appData.update(s => ({ ...s, stats: { ...s.stats, monthlyVisits: arr } }));
      this.state.saveToStorage();
    }
  }

  // Form update helpers
  updateProfileField(field: string, value: any) {
    const current = this.profileForm();
    this.profileForm.set({ ...current, [field]: value });
  }

  updateCourseField(field: string, value: any) {
    const current = this.courseForm();
    this.courseForm.set({ ...current, [field]: value });
  }

  updateTeacherField(field: string, value: any) {
    const current = this.teacherForm();
    this.teacherForm.set({ ...current, [field]: value });
  }

  updateMemberField(field: string, value: any) {
    const current = this.memberForm();
    this.memberForm.set({ ...current, [field]: value });
  }

  updateGalleryField(field: string, value: any) {
    this.galleryForm.set({ ...this.galleryForm(), [field]: value });
  }

  updateRegistrationField(field: string, value: any) {
    this.registrationForm.set({ ...this.registrationForm(), [field]: value });
  }

  saveProfile(event: Event) {
    event.preventDefault();
    this.state.updateProfile({ ...this.profileForm() });
    this.profileSaved.set(true);
    setTimeout(() => this.profileSaved.set(false), 3000);
  }

  // Autoridades
  addAuthority() {
    const role = prompt('Nuevo Cargo:');
    if (!role) return;
    const name = prompt('Nombre completo:');
    if (!name) return;
    const specialty = prompt('Especialidad/Formación:');
    if (!specialty) return;
    this.state.addAuthority({ role, name, specialty });
  }

  editAuthority(index: number, auth: Authority) {
    const role = prompt('Editar Cargo:', auth.role);
    if (role === null) return;
    const name = prompt('Editar Nombre:', auth.name);
    if (name === null) return;
    const specialty = prompt('Editar Especialidad:', auth.specialty);
    if (specialty === null) return;
    this.state.editAuthority(index, { role, name, specialty });
  }

  deleteAuthority(index: number, auth: Authority) {
    if (confirm(`¿Eliminar a ${auth.name} de la Comisión Directiva?`)) {
      this.state.deleteAuthority(index);
    }
  }

  // Cursos
  openCourseDrawer(course?: Course) {
    if (course) {
      this.courseForm.set({ ...course });
      this.editingCourse.set(course);
    } else {
      this.courseForm.set({ id: `cur-${Date.now()}`, title: '', teacherId: '', schedule: '', duration: '', description: '', price: '', category: 'Pintura', studentsCount: 0 });
      this.editingCourse.set(null);
    }
    this.showCourseDrawer.set(true);
  }

  closeCourseDrawer() { this.showCourseDrawer.set(false); }

  saveCourse(event: Event) {
    event.preventDefault();
    this.state.saveCourse({ ...this.courseForm() });
    this.closeCourseDrawer();
  }

  deleteCourse(id: string) {
    const course = this.state.appData().courses.find(c => c.id === id);
    if (course && confirm(`¿Eliminar el curso "${course.title}"?`)) {
      this.state.deleteCourse(id);
    }
  }

  // Docentes 
  openTeacherDrawer(teacher?: Teacher) {
    if (teacher) {
      this.teacherForm.set({ ...teacher });
      this.editingTeacher.set(teacher);
    } else {
      this.teacherForm.set({ id: `doc-${Date.now()}`, name: '', specialty: '', bio: '', experience: '' });
      this.editingTeacher.set(null);
    }
    this.showTeacherDrawer.set(true);
  }

  closeTeacherDrawer() { this.showTeacherDrawer.set(false); }

  saveTeacher(event: Event) {
    event.preventDefault();
    this.state.saveTeacher({ ...this.teacherForm() });
    this.closeTeacherDrawer();
  }

  deleteTeacher(id: string) {
    const teacher = this.state.appData().teachers.find(t => t.id === id);
    if (teacher && confirm(`¿Eliminar al docente "${teacher.name}"?`)) {
      this.state.deleteTeacher(id);
    }
  }

  getTeacherName(teacherId: string): string {
    return this.state.appData().teachers.find(t => t.id === teacherId)?.name ?? 'A designar';
  }

  /*********************************************************************
   * 
   * Socios
   * Abre el drawer para agregar o editar un socio.
   * @param member - Objeto Member con los datos del socio a editar, 
   * o undefined para agregar uno nuevo.
   * 
   *********************************************************************/
  openMemberDrawer(member?: Member) {
    if (member) {
      this.memberForm.set({ ...member });
      this.editingMember.set(member);
    } else {
      this.memberForm.set({ id: `mem-${Date.now()}`, name: '', apellido: '', phone: '', email: '', description: '' });
      this.editingMember.set(null);
    }
    this.showMemberDrawer.set(true);
  }

  /*********************************************************************
   * 
   * Socios
   * Cierra el drawer de socios.
   * 
   *********************************************************************/
  closeMemberDrawer() { this.showMemberDrawer.set(false); }

  /*********************************************************************
   * 
   * Socios
   * Guarda un socio, ya sea nuevo o existente.
   * @param event - Evento que contiene los datos del socio.
   * 
   *********************************************************************/
  saveMember(event: Event) {
    event.preventDefault();
    this.state.saveMember({ ...this.memberForm() });
    this.closeMemberDrawer();
  }

  /*********************************************************************
   * 
   * Socios
   * Elimina un socio. 
   * @param id - ID del socio a eliminar.
   * 
   *********************************************************************/
  deleteMember(id: string) {
    const member = this.state.appData().members?.find(m => m.id === id);
    if (member && confirm(`¿Eliminar al socio "${member.name} ${member.apellido}"?`)) {
      this.state.deleteMember(id);
    }
  }

  /*********************************************************************
   * 
   * Galería
   * Abre el drawer para agregar o editar una obra.
   * @param item - Objeto GalleryItem con los datos de la obra a editar, 
   * o undefined para agregar una nueva.
   * 
   *********************************************************************/
  openGalleryDrawer(item?: GalleryItem) {
    if (item) {
      this.galleryForm.set({ ...item });
      this.editingGallery.set(item);
    } else {
      this.galleryForm.set({ id: `gal-${Date.now()}`, title: '', artist: '', category: 'Pintura', description: '', image: '' });
      this.editingGallery.set(null);
    }
    this.showGalleryDrawer.set(true);
  }

  /*********************************************************************
   * 
   * Galería
   * Cierra el drawer de galería.
   * 
   *********************************************************************/
  closeGalleryDrawer() { this.showGalleryDrawer.set(false); }

  /*********************************************************************
   * 
   * Galería
   * Guarda una obra, ya sea nueva o existente.
   * @param event - Evento que contiene los datos de la obra.
   * 
   *********************************************************************/
  saveGallery(event: Event) {
    event.preventDefault();
    this.state.saveGalleryItem({ ...this.galleryForm() });
    this.closeGalleryDrawer();
  }

  /*********************************************************************
   * 
   * Galería
   * Elimina una obra. 
   * @param id - ID de la obra a eliminar.
   * 
   *********************************************************************/
  deleteGallery(id: string) {
    const item = this.state.appData().gallery.find(g => g.id === id);
    if (item && confirm(`¿Eliminar la obra "${item.title}"?`)) {
      this.state.deleteGalleryItem(id);
    }
  }

  // Inscripciones
  /*********************************************************************
   * 
   * Inscripciones
   * Abre el drawer para agregar o editar una inscripción.
   * @param reg - Objeto Registration con los datos de la inscripción a editar, 
   * o undefined para agregar una nueva.
   * 
   *********************************************************************/
  openRegistrationDrawer(reg?: Registration) {
    if (reg) {
      this.registrationForm.set({ ...reg });
      this.editingRegistration.set(reg);
    } else {
      this.registrationForm.set({ id: `reg-${Date.now()}`, name: '', email: '', phone: '', courseId: '', date: new Date().toISOString().split('T')[0] });
      this.editingRegistration.set(null);
    }
    this.showRegistrationDrawer.set(true);
  }

  /*********************************************************************
   * 
   * Inscripciones
   * Cierra el drawer de inscripciones.
   * 
   *********************************************************************/
  closeRegistrationDrawer() { this.showRegistrationDrawer.set(false); }

  /*********************************************************************
   * 
   * Inscripciones
   * Guarda una inscripción, ya sea nueva o existente.
   * @param event - Evento que contiene los datos de la inscripción.
   * 
   *********************************************************************/
  saveRegistration(event: Event) {
    event.preventDefault();
    this.state.saveRegistration({ ...this.registrationForm() });
    this.closeRegistrationDrawer();
  }

  /*********************************************************************
   * 
   * Inscripciones
   * Elimina una inscripción. 
   * @param id - ID de la inscripción a eliminar.
   * 
   *********************************************************************/
  deleteRegistration(id: string) {
    if (confirm(`¿Eliminar esta inscripción?`)) {
      this.state.deleteRegistration(id);
    }
  }

  /*********************************************************************
   * 
   * Inscripciones
   * Obtiene el nombre de un curso.
   * @param courseId - ID del curso.
   * 
   *********************************************************************/
  getCourseName(courseId: string): string {
    return this.state.appData().courses.find(c => c.id === courseId)?.title ?? 'Desconocido';
  }

  /*********************************************************************
   * 
   * Backup
   * Exporta un backup de la base de datos a un archivo JSON.
   * 
   *********************************************************************/
  exportBackup() {
    const dataStr = JSON.stringify(this.state.appData(), null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `penia-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /*********************************************************************
   * 
   * Backup
   * Importa un backup de la base de datos desde un archivo JSON.
   * @param event - Evento que contiene el archivo a importar.
   * 
   *********************************************************************/
  importBackup(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        this.state.importBackup(data);
        alert('¡Base de datos restaurada exitosamente!');
      } catch {
        alert('Error: el archivo no es un JSON válido de la Peña.');
      }
    };
    reader.readAsText(file);
  }

  /*********************************************************************
   * 
   * Estadísticas
   * Genera los datos para el gráfico SVG de visitas.
   * @returns String con las coordenadas del gráfico.
   * 
   *********************************************************************/
  getVisitsChartPath(): string {
    const data = this.state.appData().stats.monthlyVisits;
    const width = 500, height = 160, padding = 30;
    const maxVal = Math.max(...data) * 1.1;
    const points = data.map((val, i) => {
      const x = padding + (i * (width - 2 * padding) / (data.length - 1));
      const y = height - padding - (val * (height - 2 * padding) / maxVal);
      return { x, y };
    });
    return points.reduce((acc, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, '');
  }

  /*********************************************************************
   * 
   * Estadísticas
   * Genera la ruta para el área sombreada del gráfico de visitas.
   * @returns String con las coordenadas del área del gráfico.
   * 
   *********************************************************************/
  getVisitsAreaPath(): string {
    const path = this.getVisitsChartPath();
    const data = this.state.appData().stats.monthlyVisits;
    const width = 500, height = 160, padding = 30;
    const lastX = padding + ((data.length - 1) * (width - 2 * padding) / (data.length - 1));
    return `${path} L ${lastX} ${height - padding} L ${padding} ${height - padding} Z`;
  }
}
